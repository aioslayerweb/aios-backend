from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from supabase_client import supabase
import json
from collections import defaultdict
from datetime import datetime
import uuid

app = FastAPI()


# =========================
# 🏠 ROOT
# =========================
@app.get("/")
def root():
    return {"message": "AIOS Autonomous Strategy Upgrader v9 running"}


# =========================
# 📊 EVENTS
# =========================
@app.get("/events")
def events():
    res = supabase.table("events").select("*").execute()
    return {"status": "success", "data": res.data}


# =========================
# 🧠 STRATEGY REGISTRY (VERSIONED)
# =========================
STRATEGIES = {
    "behavior_agent": {
        "version": 1,
        "weight_activity": 1.0
    },
    "revenue_agent": {
        "version": 1,
        "weight_conversion": 1.0
    },
    "risk_agent": {
        "version": 1,
        "weight_risk": 1.0
    }
}


# =========================
# 📦 STRATEGY UPGRADE STORE
# =========================
PENDING_UPGRADES = []


# =========================
# 📊 PERFORMANCE MEMORY
# =========================
METRICS = defaultdict(lambda: {
    "runs": 0,
    "positive_signals": 0
})


# =========================
# 🧠 AGENTS
# =========================
def behavior_agent(events):
    strat = STRATEGIES["behavior_agent"]

    score = len(events) * strat["weight_activity"]
    state = "power_user" if score > 20 else "inactive" if score < 3 else "normal"

    METRICS["behavior_agent"]["runs"] += 1
    if state == "power_user":
        METRICS["behavior_agent"]["positive_signals"] += 1

    return {"score": score, "state": state}


def revenue_agent(events):
    strat = STRATEGIES["revenue_agent"]

    has_pricing = any(e["event_name"] == "view_pricing" for e in events)

    score = (80 if has_pricing else 20) * strat["weight_conversion"]

    METRICS["revenue_agent"]["runs"] += 1
    if has_pricing:
        METRICS["revenue_agent"]["positive_signals"] += 1

    return {"score": score, "intent": "high" if score > 60 else "low"}


def risk_agent(events):
    strat = STRATEGIES["risk_agent"]

    n = len(events)

    if n < 3:
        risk = 90
    elif n < 10:
        risk = 60
    else:
        risk = 20

    risk = risk * strat["weight_risk"]

    METRICS["risk_agent"]["runs"] += 1
    if risk > 70:
        METRICS["risk_agent"]["positive_signals"] += 1

    return {"risk": risk, "level": "high" if risk > 70 else "stable"}


# =========================
# 🧪 SIMULATION ENGINE (A/B TEST CORE)
# =========================
def simulate_strategy_change(agent_name, key, new_value, events):
    original = STRATEGIES[agent_name][key]

    # simulate old
    STRATEGIES[agent_name][key] = original
    baseline = run_single_agent_test(agent_name, events)

    # simulate new
    STRATEGIES[agent_name][key] = new_value
    test = run_single_agent_test(agent_name, events)

    # revert
    STRATEGIES[agent_name][key] = original

    return {
        "baseline": baseline,
        "test": test,
        "improvement": test["score"] - baseline["score"]
    }


def run_single_agent_test(agent_name, events):
    if agent_name == "behavior_agent":
        return behavior_agent(events)
    if agent_name == "revenue_agent":
        return revenue_agent(events)
    if agent_name == "risk_agent":
        return risk_agent(events)


# =========================
# 🧠 STRATEGY UPGRADE ENGINE
# =========================
def generate_upgrades(events):
    upgrades = []

    for agent, stats in METRICS.items():
        if stats["runs"] < 5:
            continue

        success_rate = stats["positive_signals"] / stats["runs"]

        # LOW PERFORMANCE → PROPOSE CHANGE
        if success_rate < 0.3:
            upgrades.append({
                "id": str(uuid.uuid4()),
                "agent": agent,
                "type": "increase_sensitivity",
                "status": "pending",
                "created_at": datetime.utcnow().isoformat()
            })

        # HIGH PERFORMANCE → STABILIZE
        elif success_rate > 0.7:
            upgrades.append({
                "id": str(uuid.uuid4()),
                "agent": agent,
                "type": "stabilize_strategy",
                "status": "pending",
                "created_at": datetime.utcnow().isoformat()
            })

    return upgrades


# =========================
# 🛡️ APPROVAL SYSTEM
# =========================
def apply_upgrade(upgrade):
    agent = upgrade["agent"]

    if agent not in STRATEGIES:
        return False

    # SAFE RULES ONLY (NO AUTO CHAOS)
    if upgrade["type"] == "increase_sensitivity":
        for key in STRATEGIES[agent]:
            if "weight" in key:
                STRATEGIES[agent][key] *= 1.1

    if upgrade["type"] == "stabilize_strategy":
        for key in STRATEGIES[agent]:
            if "weight" in key:
                STRATEGIES[agent][key] *= 0.95

    STRATEGIES[agent]["version"] += 1
    return True


# =========================
# 📊 ORCHESTRATOR
# =========================
def run_system(events):
    return {
        "behavior": behavior_agent(events),
        "revenue": revenue_agent(events),
        "risk": risk_agent(events)
    }


# =========================
# 📡 API: AGENTS
# =========================
@app.get("/agents/{user_id}")
def agents(user_id: str):
    res = supabase.table("events").select("*").execute()
    events = [e for e in res.data if e["user_id"] == user_id]

    upgrades = generate_upgrades(events)

    return {
        "status": "success",
        "user_id": user_id,
        "analysis": run_system(events),
        "upgrade_suggestions": upgrades
    }


# =========================
# 🧠 APPLY UPGRADE (CONTROLLED)
# =========================
@app.post("/upgrade/apply")
def apply(upgrade: dict):
    success = apply_upgrade(upgrade)

    return {
        "status": "applied" if success else "failed",
        "strategy_state": STRATEGIES
    }


# =========================
# 📡 VIEW UPGRADES
# =========================
@app.get("/upgrade/suggestions")
def upgrades():
    return {
        "status": "success",
        "suggestions": PENDING_UPGRADES,
        "metrics": dict(METRICS)
    }


# =========================
# 🔌 WEBSOCKET REALTIME
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
            upgrades = generate_upgrades(events)

            await broadcast({
                "type": "analysis_update",
                "data": analysis
            })

            await broadcast({
                "type": "strategy_upgrades",
                "data": upgrades
            })

    except WebSocketDisconnect:
        active_connections.remove(websocket)
