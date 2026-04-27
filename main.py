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
    return {"message": "AIOS Autonomous Agent v5 running"}


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
        "last_seen": None
    }

    for e in events:
        profile["total_events"] += 1

        name = e.get("event_name", "unknown")
        profile["event_types"][name] += 1

        profile["last_seen"] = e.get("created_at")

    return profile


# =========================
# 🧠 INTENT INFERENCE ENGINE
# =========================
def infer_intent(profile):
    events = profile["event_types"]

    if events.get("login", 0) > 10:
        return "habitual_user"

    if events.get("view_pricing", 0) > 0:
        return "purchase_intent"

    if profile["total_events"] < 3:
        return "at_risk_user"

    if profile["total_events"] > 20:
        return "power_user"

    return "normal_user"


# =========================
# 🤖 AUTONOMOUS DECISION ENGINE
# =========================
def autonomous_decisions(user_id, profile, intent):
    actions = []

    # 🚨 HIGH RISK USERS
    if intent == "at_risk_user":
        actions.append({
            "type": "alert",
            "action": "notify_system",
            "priority": "high",
            "message": f"User {user_id} is at risk of churn"
        })

        actions.append({
            "type": "workflow",
            "action": "send_reengagement_email",
            "safe": True
        })

    # 💰 PURCHASE INTENT
    elif intent == "purchase_intent":
        actions.append({
            "type": "workflow",
            "action": "trigger_sales_sequence",
            "safe": True
        })

    # 🧠 POWER USER
    elif intent == "power_user":
        actions.append({
            "type": "opportunity",
            "action": "upgrade_offer",
            "safe": True
        })

    # 📊 NORMAL USER
    else:
        actions.append({
            "type": "monitor",
            "action": "track_behavior",
            "safe": True
        })

    return actions


# =========================
# 🛡️ SAFETY LAYER (IMPORTANT)
# =========================
def safety_filter(actions):
    safe_actions = []

    for a in actions:
        # Only allow SAFE workflows in v5
        if a.get("safe", True):
            safe_actions.append(a)

    return safe_actions


# =========================
# 📊 AUTONOMOUS API
# =========================
@app.get("/agent/{user_id}")
def agent(user_id: str):
    response = supabase.table("events").select("*").execute()
    events = response.data or []

    user_events = [e for e in events if e.get("user_id") == user_id]

    if not user_events:
        return {"status": "error", "message": "User not found"}

    profile = build_profile(user_events)
    intent = infer_intent(profile)

    raw_actions = autonomous_decisions(user_id, profile, intent)
    safe_actions = safety_filter(raw_actions)

    return {
        "status": "success",
        "user_id": user_id,
        "intent": intent,
        "total_events": profile["total_events"],
        "event_breakdown": dict(profile["event_types"]),
        "autonomous_actions": safe_actions,
        "timestamp": datetime.utcnow().isoformat()
    }


# =========================
# 🔌 REAL-TIME ENGINE
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
# ⚡ WEBSOCKET AGENT LOOP
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
                "type": "event_received",
                "data": event
            })

            # =========================
            # 🤖 AUTONOMOUS LOOP
            # =========================
            response = supabase.table("events").select("*").execute()
            events = response.data or []

            user_id = event.get("user_id")
            user_events = [e for e in events if e.get("user_id") == user_id]

            if user_events:
                profile = build_profile(user_events)
                intent = infer_intent(profile)

                actions = autonomous_decisions(user_id, profile, intent)
                safe_actions = safety_filter(actions)

                # REAL-TIME AUTONOMOUS OUTPUT
                await broadcast({
                    "type": "autonomous_decision",
                    "data": {
                        "user_id": user_id,
                        "intent": intent,
                        "actions": safe_actions
                    }
                })

    except WebSocketDisconnect:
        active_connections.discard(websocket)
