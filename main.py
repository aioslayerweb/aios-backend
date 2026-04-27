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
    return {"message": "AIOS Agent Communication Protocol v7 running"}


# =========================
# 📡 AGENT MESSAGE BUS (CORE SYSTEM)
# =========================
AGENT_BUS = []


def send_to_bus(message: dict):
    message["timestamp"] = datetime.utcnow().isoformat()
    AGENT_BUS.append(message)


def get_bus_messages():
    return AGENT_BUS[-100:]  # last 100 messages only


# =========================
# 🧠 MEMORY LAYER
# =========================
def build_memory(events):
    memory = {
        "total_events": 0,
        "users": defaultdict(list),
        "event_types": defaultdict(int)
    }

    for e in events:
        memory["total_events"] += 1

        uid = e.get("user_id")
        if uid:
            memory["users"][uid].append(e)

        memory["event_types"][e.get("event_name", "unknown")] += 1

    return memory


# =========================
# 🤖 AGENT BASE CLASS (LOGIC STANDARD)
# =========================
def agent_emit(agent_name, user_id, payload):
    send_to_bus({
        "agent": agent_name,
        "user_id": user_id,
        "payload": payload
    })


# =========================
# 👤 BEHAVIOR AGENT
# =========================
def behavior_agent(user_id, events):
    activity = len(events)

    if activity > 20:
        state = "power_user"
    elif activity < 3:
        state = "inactive"
    else:
        state = "normal"

    agent_emit("behavior_agent", user_id, {
        "activity_score": activity,
        "state": state
    })

    return state


# =========================
# 💰 REVENUE AGENT
# =========================
def revenue_agent(user_id, events):
    has_pricing = any(e.get("event_name") == "view_pricing" for e in events)

    score = 80 if has_pricing else 25

    agent_emit("revenue_agent", user_id, {
        "conversion_score": score,
        "intent": "high" if score > 60 else "low"
    })

    return score


# =========================
# ⚠️ RISK AGENT
# =========================
def risk_agent(user_id, events):
    if len(events) < 3:
        risk = 90
    elif len(events) < 10:
        risk = 60
    else:
        risk = 20

    agent_emit("risk_agent", user_id, {
        "churn_risk": risk,
        "level": "high" if risk > 70 else "stable"
    })

    return risk


# =========================
# 🔁 ORCHESTRATOR (COMMUNICATION COORDINATOR)
# =========================
def orchestrator(user_id, events):
    behavior_state = behavior_agent(user_id, events)
    revenue_score = revenue_agent(user_id, events)
    risk_score = risk_agent(user_id, events)

    # =========================
    # 🧠 CROSS-AGENT COMMUNICATION RULES
    # =========================

    # Risk influences revenue strategy
    if risk_score > 70:
        send_to_bus({
            "agent": "orchestrator",
            "user_id": user_id,
            "action": "trigger_reengagement_flow",
            "reason": "high_churn_risk"
        })

    # Revenue intent influences behavior agent
    if revenue_score > 60:
        send_to_bus({
            "agent": "orchestrator",
            "user_id": user_id,
            "action": "mark_as_monetizable_user",
            "reason": "high_conversion_intent"
        })

    # Behavior influences system classification
    if behavior_state == "power_user":
        send_to_bus({
            "agent": "orchestrator",
            "user_id": user_id,
            "action": "upgrade_candidate_flag",
            "reason": "heavy_usage_detected"
        })

    return {
        "behavior_state": behavior_state,
        "revenue_score": revenue_score,
        "risk_score": risk_score
    }


# =========================
# 📊 API: RUN AGENTS
# =========================
@app.get("/agents/{user_id}")
def run_agents(user_id: str):
    response = supabase.table("events").select("*").execute()
    events = response.data or []

    user_events = [e for e in events if e.get("user_id") == user_id]

    if not user_events:
        return {"status": "error", "message": "User not found"}

    result = orchestrator(user_id, user_events)

    return {
        "status": "success",
        "user_id": user_id,
        "results": result
    }


# =========================
# 📡 BUS INSPECTION API
# =========================
@app.get("/bus")
def view_bus():
    return {
        "status": "success",
        "messages": get_bus_messages()
    }


# =========================
# 🔌 WEBSOCKET SYSTEM
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
# ⚡ REAL-TIME COMM PROTOCOL
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
            # 🧠 AGENT COMMUNICATION LOOP
            # =========================
            response = supabase.table("events").select("*").execute()
            events = response.data or []

            user_id = event.get("user_id")
            user_events = [e for e in events if e.get("user_id") == user_id]

            if user_events:
                result = orchestrator(user_id, user_events)

                # SEND FULL AGENT STATE
                await broadcast({
                    "type": "agent_state_update",
                    "data": {
                        "user_id": user_id,
                        "state": result,
                        "bus_tail": get_bus_messages()[-10:]
                    }
                })

    except WebSocketDisconnect:
        active_connections.discard(websocket)
