from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from supabase_client import supabase
import json
from collections import defaultdict

app = FastAPI()


# =========================
# 🏠 ROOT
# =========================
@app.get("/")
def root():
    return {"message": "AIOS Decision Engine v4 running"}


# =========================
# 📊 EVENTS
# =========================
@app.get("/events")
def get_events():
    response = supabase.table("events").select("*").execute()
    return {"status": "success", "data": response.data}


# =========================
# 🧠 PROFILE BUILDER
# =========================
def build_profile(events):
    profile = {
        "total_events": 0,
        "event_types": defaultdict(int),
        "active_sessions": set()
    }

    for e in events:
        profile["total_events"] += 1

        name = e.get("event_name", "unknown")
        profile["event_types"][name] += 1

        if e.get("user_id"):
            profile["active_sessions"].add(e["user_id"])

    return profile


# =========================
# 🔮 PREDICTION LAYER (simplified reuse)
# =========================
def churn_score(profile):
    score = 0

    if profile["total_events"] < 3:
        score += 60
    elif profile["total_events"] < 10:
        score += 30
    else:
        score += 10

    if len(profile["event_types"]) <= 1:
        score += 25
    elif len(profile["event_types"]) <= 2:
        score += 10

    return min(score, 100)


# =========================
# 🎯 DECISION ENGINE (CORE OF V4)
# =========================
def generate_decision(profile, churn, user_id):
    actions = []

    # LOW ENGAGEMENT CASE
    if churn > 70:
        actions.append({
            "type": "alert",
            "priority": "high",
            "action": "notify_admin",
            "message": f"User {user_id} is high churn risk"
        })

        actions.append({
            "type": "engagement_campaign",
            "action": "trigger_onboarding_sequence",
            "message": "Send re-engagement flow"
        })

    # MEDIUM RISK
    elif churn > 40:
        actions.append({
            "type": "warning",
            "priority": "medium",
            "action": "nudge_user",
            "message": "Suggest feature usage onboarding"
        })

    # HIGH VALUE USER DETECTED
    elif profile["total_events"] > 20:
        actions.append({
            "type": "opportunity",
            "priority": "high",
            "action": "upsell_candidate",
            "message": "User eligible for premium upsell"
        })

    else:
        actions.append({
            "type": "normal",
            "action": "monitor",
            "message": "No action required"
        })

    return actions


# =========================
# 📊 DECISION API
# =========================
@app.get("/decisions/{user_id}")
def get_decisions(user_id: str):
    response = supabase.table("events").select("*").execute()
    events = response.data or []

    user_events = [e for e in events if e.get("user_id") == user_id]

    if not user_events:
        return {"status": "error", "message": "User not found"}

    profile = build_profile(user_events)
    churn = churn_score(profile)

    actions = generate_decision(profile, churn, user_id)

    return {
        "status": "success",
        "user_id": user_id,
        "churn_risk_score": churn,
        "total_events": profile["total_events"],
        "event_breakdown": dict(profile["event_types"]),
        "recommended_actions": actions
    }


# =========================
# 🔌 REAL-TIME SYSTEM
# =========================
active_connections = set()


async def broadcast(message: dict):
    dead = set()

    for conn in active_connections:
        try:
            await conn.send_text(json.dumps(message))
        except:
            dead.add(conn)

    for d in dead:
        active_connections.discard(d)


# =========================
# ⚡ WEBSOCKET EVENTS
# =========================
@app.websocket("/ws/events")
async def ws_events(websocket: WebSocket):
    await websocket.accept()
    active_connections.add(websocket)

    try:
        while True:
            data = await websocket.receive_text()
            event = json.loads(data)

            # SAVE EVENT
            supabase.table("events").insert(event).execute()

            # ACK
            await websocket.send_text(json.dumps({
                "status": "received",
                "event_name": event.get("event_name"),
                "user_id": event.get("user_id")
            }))

            # BROADCAST EVENT
            await broadcast({
                "type": "new_event",
                "data": event
            })

            # =========================
            # 🧠 DECISION ENGINE RUN
            # =========================
            response = supabase.table("events").select("*").execute()
            events = response.data or []

            user_id = event.get("user_id")
            user_events = [e for e in events if e.get("user_id") == user_id]

            if user_events:
                profile = build_profile(user_events)
                churn = churn_score(profile)

                decisions = generate_decision(profile, churn, user_id)

                # REAL-TIME DECISION BROADCAST
                await broadcast({
                    "type": "decision_update",
                    "data": {
                        "user_id": user_id,
                        "churn_risk_score": churn,
                        "recommended_actions": decisions
                    }
                })

    except WebSocketDisconnect:
        active_connections.discard(websocket)
