from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from supabase_client import supabase
import json
from collections import defaultdict

app = FastAPI()


# =========================
# CONSTANTS (ANTI-BREAK FIX)
# =========================
HIGH_VALUE_SEGMENTS = ["whale", "high_value"]

SAFE_ACTIONS = [
    "onboarding_flow",
    "feature_education",
    "email_nurture_sequence"
]


# =========================
# ROOT
# =========================
@app.get("/")
def root():
    return {"message": "AIOS Growth Autopilot v3 running (stable)"}


# =========================
# DATA
# =========================
def get_all_events():
    res = supabase.table("events").select("*").execute()
    return res.data or []


# =========================
# FEATURES
# =========================
def extract_features(events):
    return {
        "total_events": len(events),
        "logins": len([e for e in events if e["event_name"] == "login"]),
        "pricing_views": len([e for e in events if e["event_name"] == "view_pricing"]),
        "interactions": len([e for e in events if e["event_name"] == "interaction"])
    }


# =========================
# CLV
# =========================
def clv_score(f):
    return f["total_events"] * 2 + f["pricing_views"] * 10 + f["interactions"] * 3


def segment(score):
    if score > 150:
        return "whale"
    if score > 80:
        return "high_value"
    if score > 30:
        return "mid_value"
    return "low_value"


# =========================
# REVENUE INTENT
# =========================
def revenue_intent(f):
    if f["pricing_views"] > 0 and f["total_events"] > 10:
        return "high"
    if f["pricing_views"] > 0:
        return "medium"
    if f["total_events"] > 15:
        return "warm"
    return "cold"


# =========================
# BEHAVIOR
# =========================
def behavior_state(f):
    if f["total_events"] > 20:
        return "power_user"
    if f["total_events"] < 3:
        return "inactive"
    return "normal"


# =========================
# DECISION ENGINE
# =========================
def decide_action(seg, intent, behavior):

    if seg in HIGH_VALUE_SEGMENTS and intent == "high":
        return {
            "action": "show_premium_upgrade",
            "priority": "high",
            "reason": "high_value_high_intent"
        }

    if seg in HIGH_VALUE_SEGMENTS and intent != "high":
        return {
            "action": "feature_education",
            "priority": "high",
            "reason": "valuable_user_low_conversion"
        }

    if seg == "mid_value":
        return {
            "action": "email_nurture_sequence",
            "priority": "medium",
            "reason": "mid_value_growth"
        }

    if behavior == "inactive":
        return {
            "action": "reengagement_campaign",
            "priority": "high",
            "reason": "inactive_user"
        }

    return {
        "action": "onboarding_flow",
        "priority": "low",
        "reason": "default_path"
    }


# =========================
# SAFE EXECUTION
# =========================
def execute_action(decision):
    if decision["action"] in SAFE_ACTIONS:
        return {
            "executed": True,
            "mode": "auto",
            "action": decision["action"]
        }

    return {
        "executed": False,
        "mode": "manual_required",
        "action": decision["action"]
    }


# =========================
# AUTOPILOT CORE
# =========================
def run_autopilot(user_id):
    events = get_all_events()
    user_events = [e for e in events if e.get("user_id") == user_id]

    if not user_events:
        return {"status": "error", "message": "user_not_found"}

    f = extract_features(user_events)

    score = clv_score(f)
    seg = segment(score)
    intent = revenue_intent(f)
    behavior = behavior_state(f)

    decision = decide_action(seg, intent, behavior)
    execution = execute_action(decision)

    return {
        "status": "success",
        "user_id": user_id,
        "clv_score": score,
        "segment": seg,
        "intent": intent,
        "behavior": behavior,
        "decision": decision,
        "execution": execution
    }


# =========================
# API
# =========================
@app.get("/autopilot/{user_id}")
def autopilot(user_id: str):
    return run_autopilot(user_id)


@app.get("/autopilot/global")
def global_autopilot():
    events = get_all_events()

    users = defaultdict(list)
    for e in events:
        if e.get("user_id"):
            users[e["user_id"]].append(e)

    summary = {
        "whale": 0,
        "high_value": 0,
        "mid_value": 0,
        "low_value": 0
    }

    for uid, evs in users.items():
        f = extract_features(evs)
        s = clv_score(f)
        seg = segment(s)
        summary[seg] += 1

    return {
        "total_users": len(users),
        "segments": summary
    }


# =========================
# WEBSOCKET
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


@app.websocket("/ws/autopilot")
async def ws_autopilot(websocket: WebSocket):
    await websocket.accept()
    active_connections.add(websocket)

    try:
        while True:
            raw = await websocket.receive_text()
            event = json.loads(raw)

            supabase.table("events").insert(event).execute()

            user_id = event.get("user_id")

            if user_id:
                result = run_autopilot(user_id)

                await broadcast({
                    "type": "autopilot_update",
                    "data": result
                })

    except WebSocketDisconnect:
        active_connections.remove(websocket)
