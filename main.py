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
    return {"message": "AIOS Growth Autopilot v3 running"}


# =========================
# 📊 DATA ACCESS
# =========================
def get_all_events():
    res = supabase.table("events").select("*").execute()
    return res.data or []


# =========================
# 🧠 FEATURE EXTRACTION
# =========================
def extract_features(events):
    return {
        "total_events": len(events),
        "logins": len([e for e in events if e["event_name"] == "login"]),
        "pricing_views": len([e for e in events if e["event_name"] == "view_pricing"]),
        "interactions": len([e for e in events if e["event_name"] == "interaction"])
    }


# =========================
# 💎 CLV ENGINE
# =========================
def clv_score(f):
    return f["total_events"]*2 + f["pricing_views"]*10 + f["interactions"]*3


def segment(score):
    if score > 150:
        return "whale"
    if score > 80:
        return "high_value"
    if score > 30:
        return "mid_value"
    return "low_value"


# =========================
# 💰 REVENUE ENGINE
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
# 👤 BEHAVIOR ENGINE
# =========================
def behavior_state(f):
    if f["total_events"] > 20:
        return "power_user"
    if f["total_events"] < 3:
        return "inactive"
    return "normal"


# =========================
# 🎯 GROWTH DECISION ENGINE
# =========================
def decide_action(segment_value, intent, behavior):
    
    # 1. HIGH VALUE + HIGH INTENT
    if segment_value in ["whale", "high_value"] and intent == "high":
        return {
            "action": "show_premium_upgrade",
            "priority": "high",
            "reason": "high_value_high_intent"
        }

    # 2. HIGH VALUE BUT LOW INTENT
    if segment_value in ["wh
