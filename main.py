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
    return {"message": "AIOS Customer Lifetime Value Engine v2"}


# =========================
# 📊 EVENTS
# =========================
def get_all_events():
    res = supabase.table("events").select("*").execute()
    return res.data or []


# =========================
# 🧠 FEATURE EXTRACTION
# =========================
def extract_user_features(events):
    total_events = len(events)
    logins = len([e for e in events if e["event_name"] == "login"])
    pricing_views = len([e for e in events if e["event_name"] == "view_pricing"])
    interactions = len([e for e in events if e["event_name"] == "interaction"])

    last_seen = None
    if events:
        last_seen = max(e["created_at"] for e in events)

    return {
        "total_events": total_events,
        "logins": logins,
        "pricing_views": pricing_views,
        "interactions": interactions,
        "last_seen": last_seen
    }


# =========================
# 💎 CLV SCORING MODEL
# =========================
def calculate_clv(features):
    score = 0

    # engagement weight
    score += features["total_events"] * 2

    # intent weight
    score += features["pricing_views"] * 10

    # activity weight
    score += features["interactions"] * 3

    return score


# =========================
# 🧠 RETENTION ESTIMATION
# =========================
def estimate_retention(features):
    if features["total_events"] > 20:
        return "high_retention"
    elif features["total_events"] > 5:
        return "medium_retention"
    return "low_retention"


# =========================
# 💰 CLV SEGMENTATION
# =========================
def segment_user(clv_score):
    if clv_score > 150:
        return "whale"
    elif clv_score > 80:
        return "high_value"
    elif clv_score > 30:
        return "mid_value"
    return "low_value"


# =========================
# 🎯 STRATEGY ENGINE
# =========================
def generate_clv_strategy(segment, retention):
    if segment == "whale":
        return {
            "strategy": "vip_treatment",
            "actions": ["early_access", "premium_support", "exclusive_offers"]
        }

    if segment == "high_value":
        return {
            "strategy": "upsell",
            "actions": ["premium_upgrade", "bundle_offer"]
        }

    if segment == "mid_value":
        return {
            "strategy": "nurture",
            "actions": ["feature_education", "email_sequences"]
        }

    return {
        "strategy": "activation",
        "actions": ["onboarding_flow", "discount_offer"]
    }


# =========================
# 📊 CLV ENGINE
# =========================
def run_clv_engine(user_id):
    events = get_all_events()
    user_events = [e for e in events if e.get("user_id") == user_id]

    if not user_events:
        return {"status": "error", "message": "user_not_found"}

    features = extract_user_features(user_events)
    clv_score = calculate_clv(features)
    segment = segment_user(clv_score)
    retention = estimate_retention(features)
    strategy = generate_clv_strategy(segment, retention)

    return {
        "status": "success",
        "user_id": user_id,
        "clv_score": clv_score,
        "segment": segment,
        "retention": retention,
        "features": features,
        "strategy": strategy
    }


# =========================
# 📡 API: USER CLV
# =========================
@app.get("/clv/{user_id}")
def clv(user_id: str):
    return run_clv_engine(user_id)


# =========================
# 📊 GLOBAL CLV DASHBOARD
# =========================
@app.get("/clv/global")
def global_clv():
    events = get_all_events()

    users = defaultdict(list)
    for e in events:
        if e.get("user_id"):
            users[e["user_id"]].append(e)

    segments = defaultdict(int)

    for uid, evs in users.items():
        features = extract_user_features(evs)
        score = calculate_clv(features)
        segment = segment_user(score)
        segments[segment] += 1

    return {
        "total_users": len(users),
        "segment_distribution": dict(segments)
    }


# =========================
# 🔌 WEBSOCKET REAL-TIME CLV
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


@app.websocket("/ws/clv")
async def ws_clv(websocket: WebSocket):
    await websocket.accept()
    active_connections.add(websocket)

    try:
        while True:
            raw = await websocket.receive_text()
            event = json.loads(raw)

            supabase.table("events").insert(event).execute()

            user_id = event.get("user_id")

            if user_id:
                result = run_clv_engine(user_id)

                await broadcast({
                    "type": "clv_update",
                    "data": result
                })

    except WebSocketDisconnect:
        active_connections.remove(websocket)
