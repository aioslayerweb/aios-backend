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
    return {"message": "AIOS Self-Optimizing Revenue Engine v1"}


# =========================
# 📊 EVENTS
# =========================
@app.get("/events")
def events():
    res = supabase.table("events").select("*").execute()
    return {"status": "success", "data": res.data}


# =========================
# 🧠 REVENUE MEMORY
# =========================
REVENUE_METRICS = defaultdict(lambda: {
    "sessions": 0,
    "pricing_views": 0,
    "logins": 0,
    "conversion_signals": 0
})


# =========================
# 💰 REVENUE SIGNAL ENGINE
# =========================
def analyze_revenue(events):
    score = 0

    for e in events:
        name = e.get("event_name")

        if name == "login":
            score += 1
        elif name == "view_pricing":
            score += 5
        elif name == "interaction":
            score += 2

    return score


# =========================
# 🧠 CONVERSION INTENT MODEL
# =========================
def detect_intent(events):
    has_pricing = any(e["event_name"] == "view_pricing" for e in events)
    activity = len(events)

    if has_pricing and activity > 10:
        return "high_intent"

    if has_pricing:
        return "medium_intent"

    if activity > 15:
        return "warm_intent"

    return "cold_intent"


# =========================
# 🧪 REVENUE SIMULATOR
# =========================
def simulate_conversion_boost(events, boost_factor):
    base = analyze_revenue(events)
    return base * boost_factor


# =========================
# 📈 OPTIMIZATION ENGINE
# =========================
def generate_revenue_optimizations(events):
    intent = detect_intent(events)
    base_score = analyze_revenue(events)

    recommendations = []

    # HIGH VALUE USERS
    if intent == "high_intent":
        recommendations.append({
            "type": "upsell_trigger",
            "action": "show_premium_offer",
            "confidence": 0.85,
            "expected_revenue_impact": "+25%"
        })

    # MEDIUM INTENT USERS
    elif intent == "medium_intent":
        recommendations.append({
            "type": "conversion_nudge",
            "action": "show_discount_banner",
            "confidence": 0.70,
            "expected_revenue_impact": "+12%"
        })

    # WARM USERS
    elif intent == "warm_intent":
        recommendations.append({
            "type": "engagement_boost",
            "action": "trigger_onboarding_flow",
            "confidence": 0.65,
            "expected_revenue_impact": "+8%"
        })

    # COLD USERS
    else:
        recommendations.append({
            "type": "activation_campaign",
            "action": "email_reengagement",
            "confidence": 0.60,
            "expected_revenue_impact": "+5%"
        })

    return {
        "intent": intent,
        "base_revenue_score": base_score,
        "recommendations": recommendations
    }


# =========================
# 🛡️ SAFE AUTO-APPLY ENGINE
# =========================
def apply_revenue_optimization(plan):
    confidence = plan.get("confidence", 0)

    # ONLY SAFE AUTOMATIONS
    if confidence < 0.75:
        return {
            "applied": False,
            "reason": "low_confidence_safety_lock"
        }

    return {
        "applied": True,
        "action": plan["action"],
        "note": "safe_revenue_automation_executed"
    }


# =========================
# 📊 CORE REVENUE ANALYZER
# =========================
def run_revenue_engine(user_id):
    res = supabase.table("events").select("*").execute()
    events = [e for e in res.data if e.get("user_id") == user_id]

    if not events:
        return {"status": "error", "message": "no_user_events"}

    optimizations = generate_revenue_optimizations(events)

    applied = []

    for rec in optimizations["recommendations"]:
        applied.append(apply_revenue_optimization(rec))

    return {
        "status": "success",
        "user_id": user_id,
        "analysis": optimizations,
        "auto_applied": applied
    }


# =========================
# 📡 API: REVENUE INSIGHTS
# =========================
@app.get("/revenue/{user_id}")
def revenue(user_id: str):
    return run_revenue_engine(user_id)


# =========================
# 📊 GLOBAL REVENUE INSIGHTS
# =========================
@app.get("/revenue/global")
def global_revenue():
    res = supabase.table("events").select("*").execute()
    events = res.data or []

    total = len(events)
    pricing_views = len([e for e in events if e["event_name"] == "view_pricing"])
    logins = len([e for e in events if e["event_name"] == "login"])

    return {
        "total_events": total,
        "pricing_views": pricing_views,
        "logins": logins,
        "conversion_ratio": pricing_views / total if total else 0
    }


# =========================
# 🔌 WEBSOCKET REAL-TIME REVENUE ENGINE
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


@app.websocket("/ws/revenue")
async def ws_revenue(websocket: WebSocket):
    await websocket.accept()
    active_connections.add(websocket)

    try:
        while True:
            raw = await websocket.receive_text()
            event = json.loads(raw)

            supabase.table("events").insert(event).execute()

            user_id = event.get("user_id")

            analysis = run_revenue_engine(user_id)

            await broadcast({
                "type": "revenue_update",
                "data": analysis
            })

    except WebSocketDisconnect:
        active_connections.remove(websocket)
