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
    return {"message": "AIOS Prediction Engine v3 running"}


# =========================
# 📊 EVENTS
# =========================
@app.get("/events")
def get_events():
    response = supabase.table("events").select("*").execute()
    return {"status": "success", "data": response.data}


# =========================
# 🧠 BUILD USER PROFILE
# =========================
def build_profile(events):
    profile = {
        "total_events": 0,
        "event_types": defaultdict(int),
        "sessions": set()
    }

    for e in events:
        profile["total_events"] += 1

        name = e.get("event_name", "unknown")
        profile["event_types"][name] += 1

        if e.get("user_id"):
            profile["sessions"].add(e["user_id"])

    return profile


# =========================
# 🔮 CHURN PREDICTION MODEL (RULE-BASED MVP)
# =========================
def predict_churn(profile):
    score = 0

    # low activity = higher churn
    if profile["total_events"] < 3:
        score += 60
    elif profile["total_events"] < 10:
        score += 30
    else:
        score += 10

    # low feature diversity
    if len(profile["event_types"]) <= 1:
        score += 25
    elif len(profile["event_types"]) <= 2:
        score += 10

    return min(score, 100)


# =========================
# 💰 CONVERSION PROBABILITY
# =========================
def predict_conversion(profile):
    base = profile["total_events"] * 4
    diversity = len(profile["event_types"]) * 8

    score = base + diversity

    return min(score, 100)


# =========================
# 📈 RETENTION SCORE
# =========================
def predict_retention(churn_score):
    return max(0, 100 - churn_score)


# =========================
# ⚠️ RISK CLASSIFIER
# =========================
def classify_risk(churn_score):
    if churn_score > 70:
        return "high_risk"
    elif churn_score > 40:
        return "medium_risk"
    return "low_risk"


# =========================
# 🧠 AI REASONING LAYER (MVP EXPLANATION ENGINE)
# =========================
def generate_ai_reasoning(profile, churn, conversion, retention):
    top_event = max(profile["event_types"], key=profile["event_types"].get, default="none")

    return f"""
AI Prediction Summary:

- Total activity: {profile['total_events']} events
- Most used feature: {top_event}

Predictions:
- Churn risk: {churn}/100
- Conversion likelihood: {conversion}/100
- Retention score: {retention}/100

Interpretation:
User behavior suggests {'low engagement patterns' if churn > 60 else 'stable usage patterns'}.
Primary engagement driver is {top_event}.
"""


# =========================
# 📊 PREDICTION API
# =========================
@app.get("/predict/{user_id}")
def predict_user(user_id: str):
    response = supabase.table("events").select("*").execute()
    events = response.data or []

    user_events = [e for e in events if e.get("user_id") == user_id]

    if not user_events:
        return {"status": "error", "message": "User not found"}

    profile = build_profile(user_events)

    churn = predict_churn(profile)
    conversion = predict_conversion(profile)
    retention = predict_retention(churn)
    risk = classify_risk(churn)

    ai_reasoning = generate_ai_reasoning(profile, churn, conversion, retention)

    return {
        "status": "success",
        "user_id": user_id,
        "churn_risk_score": churn,
        "conversion_probability": conversion,
        "retention_score": retention,
        "risk_level": risk,
        "total_events": profile["total_events"],
        "event_breakdown": dict(profile["event_types"]),
        "ai_reasoning": ai_reasoning
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

            # REAL-TIME PREDICTION UPDATE
            response = supabase.table("events").select("*").execute()
            events = response.data or []

            user_id = event.get("user_id")
            user_events = [e for e in events if e.get("user_id") == user_id]

            if user_events:
                profile = build_profile(user_events)

                churn = predict_churn(profile)
                conversion = predict_conversion(profile)
                retention = predict_retention(churn)
                risk = classify_risk(churn)

                await broadcast({
                    "type": "live_prediction_update",
                    "data": {
                        "user_id": user_id,
                        "churn_risk_score": churn,
                        "conversion_probability": conversion,
                        "retention_score": retention,
                        "risk_level": risk
                    }
                })

    except WebSocketDisconnect:
        active_connections.discard(websocket)
