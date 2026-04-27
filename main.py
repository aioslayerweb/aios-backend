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
    return {"message": "AIOS Self-Improving Agents v8 running"}


# =========================
# 📊 EVENTS
# =========================
@app.get("/events")
def get_events():
    response = supabase.table("events").select("*").execute()
    return {"status": "success", "data": response.data}


# =========================
# 🧠 AGENT STRATEGY STORE (VERSIONED)
# =========================
AGENT_STRATEGIES = {
    "behavior_agent": {"version": 1, "weight_activity": 1.0},
    "revenue_agent": {"version": 1, "weight_conversion": 1.0},
    "risk_agent": {"version": 1, "weight_risk": 1.0}
}


# =========================
# 📊 PERFORMANCE TRACKING
# =========================
AGENT_PERFORMANCE = defaultdict(lambda: {
    "runs": 0,
    "success_signals": 0
})


# =========================
# 🧠 MEMORY LAYER
# =========================
def build_memory(events):
    memory = {
        "total_events": 0,
        "users": defaultdict(list)
    }

    for e in events:
        memory["total_events"] += 1
        uid = e.get("user_id")
        if uid:
            memory["users"][uid].append(e)

    return memory


# =========================
# 👤 BEHAVIOR AGENT (VERSIONED STRATEGY)
# =========================
def behavior_agent(user_id, events):
    strategy = AGENT_STRATEGIES["behavior_agent"]

    score = len(events) * strategy["weight_activity"]

    state = "power_user" if score > 20 else "inactive" if score < 3 else "normal"

    AGENT_PERFORMANCE["behavior_agent"]["runs"] += 1
    if state == "power_user":
        AGENT_PERFORMANCE["behavior_agent"]["success_signals"] += 1

    return {
        "agent": "behavior_agent",
        "score": score,
        "state": state,
        "strategy_version": strategy["version"]
    }


# =========================
# 💰 REVENUE AGENT
# =========================
def revenue_agent(user_id, events):
    strategy = AGENT_STRATEGIES["revenue_agent"]

    has_pricing = any(e.get("event_name") == "view_pricing" for e in events)

    score = (80 if has_pricing else 20) * strategy["weight_conversion"]

    AGENT_PERFORMANCE["revenue_agent"]["runs"] += 1
    if has_pricing:
        AGENT_PERFORMANCE["revenue_agent"]["success_signals"] += 1

    return {
        "agent": "revenue_agent",
        "score": score,
        "intent": "high" if score > 60 else "low",
        "strategy_version": strategy["version"]
    }


# =========================
# ⚠️ RISK AGENT
# =========================
def risk_agent(user_id, events):
    strategy = AGENT_STRATEGIES["risk_agent"]

    base = len(events)

    if base < 3:
        risk = 90
    elif base < 10:
        risk = 60
    else:
        risk = 20

    risk = risk * strategy["weight_risk"]

    AGENT_PERFORMANCE["risk_agent"]["runs"] += 1
    if risk > 70:
        AGENT_PERFORMANCE["risk_agent"]["success_signals"] += 1

    return {
        "agent": "risk_agent",
        "score": risk,
        "level": "high" if risk > 70 else "stable",
        "strategy_version": strategy["version"]
    }


# =========================
# 🔁 SELF-IMPROVEMENT ENGINE
# =========================
def self_improve_agents():
    suggestions = []

    for agent, stats in AGENT_PERFORMANCE.items():
        if stats["runs"] < 5:
            continue

        success_rate = stats["success_signals"] / stats["runs"]

        # LOW PERFORMANCE DETECTED
        if success_rate < 0.3:
            suggestions.append({
                "agent": agent,
                "action": "adjust_weight",
                "reason": "low_success_rate",
                "current_rate": success_rate,
                "suggested_change": "increase sensitivity"
            })

        # HIGH PERFORMANCE DETECTED
        elif success_rate > 0.7:
            suggestions.append({
                "agent": agent,
                "action": "stabilize_model",
                "reason": "high_performance",
                "current_rate": success_rate,
                "suggested_change": "lock strategy version"
            })

    return suggestions


# =========================
# 🎯 ORCHESTRATOR
# =========================
def orchestrator(user_id, events):
    behavior = behavior_agent(user_id, events)
    revenue = revenue_agent(user_id, events)
    risk = risk_agent(user_id, events)

    return {
        "behavior": behavior,
        "revenue": revenue,
        "risk": risk
    }


# =========================
# 📊 API: AGENTS
# =========================
@app.get("/agents/{user_id}")
def run_agents(user_id: str):
    response = supabase.table("events").select("*").execute()
    events = response.data or []

    user_events = [e for e in events if e.get("user_id") == user_id]

    if not user_events:
        return {"status": "error", "message": "User not found"}

    return {
        "status": "success",
        "user_id": user_id,
        "result": orchestrator(user_id, user_events),
        "improvement_suggestions": self_improve_agents()
    }


# =========================
# 📡 SELF-IMPROVEMENT API
# =========================
@app.get("/agents/improvements")
def improvements():
    return {
        "status": "success",
        "suggestions": self_improve_agents(),
        "agent_performance": dict(AGENT_PERFORMANCE)
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
# ⚡ REAL-TIME LOOP
# =========================
@app.websocket("/ws/events")
async def ws_events(websocket: WebSocket):
    await websocket.accept()
    active_connections.add(websocket)

    try:
        while True:
            data = await websocket.receive_text()
            event = json.loads(data)

            supabase.table("events").insert(event).execute()

            await websocket.send_text(json.dumps({
                "status": "received",
                "event_name": event.get("event_name"),
                "user_id": event.get("user_id")
            }))

            await broadcast({
                "type": "event_received",
                "data": event
            })

            # RUN SELF-IMPROVEMENT LOOP
            improvements = self_improve_agents()

            await broadcast({
                "type": "self_improvement_update",
                "data": improvements
            })

    except WebSocketDisconnect:
        active_connections.discard(websocket)
