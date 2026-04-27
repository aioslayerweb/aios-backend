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
    return {"message": "AIOS Multi-Agent System v6 running"}


# =========================
# 📊 EVENTS
# =========================
@app.get("/events")
def get_events():
    response = supabase.table("events").select("*").execute()
    return {"status": "success", "data": response.data}


# =========================
# 🧠 MEMORY LAYER (GLOBAL STATE)
# =========================
def build_memory(events):
    memory = {
        "total_events": 0,
        "event_types": defaultdict(int),
        "users": defaultdict(list)
    }

    for e in events:
        memory["total_events"] += 1

        uid = e.get("user_id")
        if uid:
            memory["users"][uid].append(e)

        name = e.get("event_name", "unknown")
        memory["event_types"][name] += 1

    return memory


# =========================
# 👤 USER BEHAVIOR AGENT
# =========================
def behavior_agent(user_events):
    score = len(user_events)

    return {
        "agent": "behavior_agent",
        "activity_score": score,
        "status": "active" if score > 5 else "low_activity"
    }


# =========================
# 💰 REVENUE / CONVERSION AGENT
# =========================
def revenue_agent(user_events):
    has_pricing = any(e.get("event_name") == "view_pricing" for e in user_events)

    score = 70 if has_pricing else 20

    return {
        "agent": "revenue_agent",
        "conversion_score": score,
        "status": "high_intent" if score > 50 else "low_intent"
    }


# =========================
# ⚠️ RISK / CHURN AGENT
# =========================
def risk_agent(user_events):
    if len(user_events) < 3:
        risk = 85
    elif len(user_events) < 10:
        risk = 50
    else:
        risk = 20

    return {
        "agent": "risk_agent",
        "churn_risk": risk,
        "status": "high_risk" if risk > 70 else "stable"
    }


# =========================
# 🎯 ORCHESTRATOR (MAIN BRAIN)
# =========================
def orchestrator(user_id, user_events):
    behavior = behavior_agent(user_events)
    revenue = revenue_agent(user_events)
    risk = risk_agent(user_events)

    # 🧠 DECISION LOGIC (multi-agent fusion)
    if risk["churn_risk"] > 70:
        global_action = "reengagement_campaign"
    elif revenue["conversion_score"] > 60:
        global_action = "sales_nurture_flow"
    elif behavior["activity_score"] > 20:
        global_action = "premium_upsell"
    else:
        global_action = "monitor"

    return {
        "user_id": user_id,
        "agents": {
            "behavior": behavior,
            "revenue": revenue,
            "risk": risk
        },
        "global_decision": global_action,
        "timestamp": datetime.utcnow().isoformat()
    }


# =========================
# 📊 MULTI-AGENT API
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
        **result
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
# ⚡ WEBSOCKET MULTI-AGENT LOOP
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
            # 🧠 MULTI-AGENT EXECUTION
            # =========================
            response = supabase.table("events").select("*").execute()
            events = response.data or []

            user_id = event.get("user_id")
            user_events = [e for e in events if e.get("user_id") == user_id]

            if user_events:
                result = orchestrator(user_id, user_events)

                # REAL-TIME AGENT OUTPUT
                await broadcast({
                    "type": "multi_agent_update",
                    "data": result
                })

    except WebSocketDisconnect:
        active_connections.discard(websocket)
