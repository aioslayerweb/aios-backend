from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from supabase_client import supabase
import json
from collections import defaultdict
from datetime import datetime

app = FastAPI()


# =========================
# 🏠 ROOT
# =========================
@app.get("/")
def root():
    return {"message": "AIOS Behavior Analytics Engine v2 running"}


# =========================
# 📊 EVENTS
# =========================
@app.get("/events")
def get_events():
    response = supabase.table("events").select("*").execute()
    return {"status": "success", "data": response.data}


# =========================
# 🧠 USER BEHAVIOR MODEL
# =========================
def build_user_profiles(events):
    profiles = defaultdict(lambda: {
        "total_events": 0,
        "event_types": defaultdict(int),
        "last_seen": None
    })

    for e in events:
        uid = e.get("user_id")
        if not uid:
            continue

        profiles[uid]["total_events"] += 1

        event_name = e.get("event_name", "unknown")
        profiles[uid]["event_types"][event_name] += 1

        profiles[uid]["last_seen"] = e.get("created_at")

    return profiles


# =========================
# 📈 ENGAGEMENT SCORING ENGINE
# =========================
def calculate_engagement(profile):
    base = profile["total_events"]

    diversity = len(profile["event_types"])

    score = (base * 5) + (diversity * 10)

    if score > 80:
        user_type = "power_user"
    elif score > 30:
        user_type = "active_user"
    else:
        user_type = "low_activity"

    return score, user_type


# =========================
# ⚠️ CHURN SIGNAL DETECTOR
# =========================
def detect_risks(profile):
    flags = []

    if profile["total_events"] < 3:
        flags.append("low_engagement")

    if len(profile["event_types"]) <= 1:
        flags.append("low_feature_usage")

    return flags


# =========================
# 🧠 AI INSIGHT GENERATOR (RULE-BASED MVP)
# =========================
def generate_insight(profile, score, user_type, flags):
    top_event = max(profile["event_types"], key=profile["event_types"].get, default="none")

    return f"""
User Analysis Summary:

- User type: {user_type}
- Engagement score: {score}
- Total events: {profile['total_events']}
- Primary activity: {top_event}
- Risk flags: {', '.join(flags) if flags else 'none'}

Insight:
This user shows {user_type.replace('_', ' ')} behavior with focus on {top_event}.
"""


# =========================
# 📊 INSIGHTS ENDPOINT
# =========================
@app.get("/insights/{user_id}")
def get_insights(user_id: str):
    response = supabase.table("events").select("*").execute()
    events = response.data or []

    user_events = [e for e in events if e.get("user_id") == user_id]

    profile = build_user_profiles(user_events).get(user_id)

    if not profile:
        return {"status": "error", "message": "User not found"}

    score, user_type = calculate_engagement(profile)
    flags = detect_risks(profile)
    insight = generate_insight(profile, score, user_type, flags)

    return {
        "status": "success",
        "user_id": user_id,
        "engagement_score": score,
        "user_type": user_type,
        "flags": flags,
        "total_events": profile["total_events"],
        "event_breakdown": dict(profile["event_types"]),
        "ai_insight": insight
    }


# =========================
# 🔌 REAL-TIME EVENT STREAM
# =========================
active_connections = set()


async def broadcast(message: dict):
    disconnected = set()

    for conn in active_connections:
        try:
            await conn.send_text(json.dumps(message))
        except:
            disconnected.add(conn)

    for d in disconnected:
        active_connections.discard(d)


@app.websocket("/ws/events")
async def ws_events(websocket: WebSocket):
    await websocket.accept()
    active_connections.add(websocket)

    try:
        while True:
            data = await websocket.receive_text()
            event = json.loads(data)

            # Save event
            supabase.table("events").insert(event).execute()

            # ACK
            await websocket.send_text(json.dumps({
                "status": "received",
                "event_name": event.get("event_name"),
                "user_id": event.get("user_id")
            }))

            # Broadcast event
            await broadcast({
                "type": "new_event",
                "data": event
            })

            # Recompute insights live
            response = supabase.table("events").select("*").execute()
            events = response.data or []

            user_id = event.get("user_id")
            user_events = [e for e in events if e.get("user_id") == user_id]

            profile = build_user_profiles(user_events).get(user_id)

            if profile:
                score, user_type = calculate_engagement(profile)
                flags = detect_risks(profile)

                await broadcast({
                    "type": "live_user_update",
                    "data": {
                        "user_id": user_id,
                        "score": score,
                        "user_type": user_type,
                        "flags": flags
                    }
                })

    except WebSocketDisconnect:
        active_connections.discard(websocket)
