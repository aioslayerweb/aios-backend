from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from supabase_client import supabase
import json
from collections import defaultdict
from datetime import datetime
import uuid

app = FastAPI()


# =========================
# 🏠 SYSTEM STATE
# =========================
AUTONOMOUS_MODE = True  # master switch (safe guard)
AUTO_APPLY_THRESHOLD = 0.75  # confidence needed for auto-apply


# =========================
# 🧠 ROOT
# =========================
@app.get("/")
def root():
    return {"message": "AIOS Fully Autonomous Mode (Guarded v10)"}


# =========================
# 📊 EVENTS
# =========================
@app.get("/events")
def events():
    res = supabase.table("events").select("*").execute()
    return {"status": "success", "data": res.data}


# =========================
# 🧠 STRATEGY CORE
# =========================
STRATEGIES = {
    "behavior_agent": {"version": 1, "weight": 1.0},
    "revenue_agent": {"version": 1, "weight": 1.0},
    "risk_agent": {"version": 1, "weight": 1.0}
}


METRICS = defaultdict(lambda: {"runs": 0, "success": 0})


# =========================
# 👤 AGENTS
# =========================
def behavior_agent(events):
    score = len(events)
    state = "power_user" if score > 20 else "inactive" if score < 3 else "normal"

    METRICS["behavior_agent"]["runs"] += 1
    if state == "power_user":
        METRICS["behavior_agent"]["success"] += 1

    return {"score": score, "state": state}


def revenue_agent(events):
    has_pricing = any(e["event_name"] == "view_pricing" for e in events)
    score = 80 if has_pricing else 20

    METRICS["revenue_agent"]["runs"] += 1
    if has_pricing:
        METRICS["revenue_agent"]["success"] += 1

    return {"score": score, "intent": "high" if score > 60 else "low"}


def risk_agent(events):
    n = len(events)

    if n < 3:
        risk = 90
    elif n < 10:
        risk = 60
    else:
        risk = 20

    METRICS["risk_agent"]["runs"] += 1
    if risk > 70:
        METRICS["risk_agent"]["success"] += 1

    return {"risk": risk}


# =========================
# 🧪 SIMULATION ENGINE
# =========================
def simulate_upgrade(agent, factor):
    original = STRATEGIES[agent]["weight"]

    STRATEGIES[agent]["weight"] = factor
    result = run_agent_test(agent)

    STRATEGIES[agent]["weight"] = original

    return result


def run_agent_test(agent):
    dummy_events = [{"event_name": "login"}] * 10

    if agent == "behavior_agent":
        return behavior_agent(dummy_events)
    if agent == "revenue_agent":
        return revenue_agent(dummy_events)
    if agent == "risk_agent":
        return risk_agent(dummy_events)


# =========================
# 🧠 UPGRADE ENGINE
# =========================
def generate_upgrade_plan():
    plans = []

    for agent, stats in METRICS.items():
        if stats["runs"] < 5:
            continue

        success_rate = stats["success"] / stats["runs"]

        confidence = min(success_rate, 1.0)

        # LOW PERFORMANCE → ADJUST UPWARD
        if success_rate < 0.3:
            plans.append({
                "id": str(uuid.uuid4()),
                "agent": agent,
                "action": "increase_sensitivity",
                "confidence": confidence,
                "recommended_weight": 1.2
            })

        # HIGH PERFORMANCE → STABILIZE
        elif success_rate > 0.7:
            plans.append({
                "id": str(uuid.uuid4()),
                "agent": agent,
                "action": "stabilize",
                "confidence": confidence,
                "recommended_weight": 0.95
            })

    return plans


# =========================
# 🛡️ AUTONOMOUS EXECUTION ENGINE
# =========================
def apply_autonomous_upgrade(plan):
    agent = plan["agent"]

    if not AUTONOMOUS_MODE:
        return {"applied": False, "reason": "autonomous_mode_disabled"}

    confidence = plan["confidence"]

    # 🧠 SAFE AUTO-APPLY RULE
    if confidence < AUTO_APPLY_THRESHOLD:
        return {"applied": False, "reason": "low_confidence"}

    # APPLY CHANGE SAFELY
    STRATEGIES[agent]["weight"] = plan["recommended_weight"]
    STRATEGIES[agent]["version"] += 1

    return {"applied": True, "agent": agent, "new_version": STRATEGIES[agent]["version"]}


# =========================
# 📊 SYSTEM RUN
# =========================
def run_system(events):
    return {
        "behavior": behavior_agent(events),
        "revenue": revenue_agent(events),
        "risk": risk_agent(events)
    }


# =========================
# 📡 AGENT API
# =========================
@app.get("/agents/{user_id}")
def agents(user_id: str):
    res = supabase.table("events").select("*").execute()
    events = [e for e in res.data if e["user_id"] == user_id]

    analysis = run_system(events)
    plans = generate_upgrade_plan()

    applied = []

    # 🤖 AUTONOMOUS LOOP
    for p in plans:
        result = apply_autonomous_upgrade(p)
        applied.append(result)

    return {
        "status": "success",
        "autonomous_mode": AUTONOMOUS_MODE,
        "analysis": analysis,
        "upgrade_plans": plans,
        "auto_applied": applied
    }


# =========================
# 📡 UPGRADE INSPECTOR
# =========================
@app.get("/autonomy/status")
def status():
    return {
        "autonomous_mode": AUTONOMOUS_MODE,
        "threshold": AUTO_APPLY_THRESHOLD,
        "strategies": STRATEGIES,
        "metrics": dict(METRICS)
    }


# =========================
# 🔌 WEBSOCKET REAL-TIME LOOP
# =========================
active_connections = set()


async def broadcast(msg):
    dead = set()

    for c in active_connections:
        try:
            await c.send_text(json.dumps(msg))
        except:
            dead.add(c)

    for d in dead:
        active_connections.remove(d)


@app.websocket("/ws/events")
async def ws(websocket: WebSocket):
    await websocket.accept()
    active_connections.add(websocket)

    try:
        while True:
            raw = await websocket.receive_text()
            event = json.loads(raw)

            supabase.table("events").insert(event).execute()

            res = supabase.table("events").select("*").execute()
            events = [e for e in res.data if e["user_id"] == event["user_id"]]

            analysis = run_system(events)
            plans = generate_upgrade_plan()

            applied = [apply_autonomous_upgrade(p) for p in plans]

            await broadcast({
                "type": "autonomous_update",
                "analysis": analysis,
                "plans": plans,
                "applied": applied
            })

    except WebSocketDisconnect:
        active_connections.remove(websocket)
