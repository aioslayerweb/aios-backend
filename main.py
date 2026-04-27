from fastapi import FastAPI
from supabase_client import supabase
import os
from datetime import datetime, timedelta

app = FastAPI()


@app.get("/")
def root():
    return {"message": "AIOS backend is running"}


@app.get("/events")
def get_events():
    response = supabase.table("events").select("*").execute()
    return {"status": "success", "data": response.data}


# =========================
# 🚨 ALERT ENGINE v1
# =========================
@app.get("/alerts")
def alerts():
    response = supabase.table("events").select("*").execute()
    events = response.data

    if not events:
        return {"status": "success", "alerts": []}

    user_activity = {}
    recent_events = []

    # 🕒 time threshold (last 24h logic simplified)
    now = datetime.utcnow()
    threshold = now - timedelta(hours=24)

    for e in events:
        uid = e.get("user_id")
        if not uid:
            continue

        user_activity[uid] = user_activity.get(uid, 0) + 1

        # try parse timestamp safely
        try:
            created = e.get("created_at")
            if created:
                recent_events.append(e)
        except:
            pass

    alerts_list = []

    # =========================
    # 🔥 ALERT 1: HIGH ACTIVITY SPIKE
    # =========================
    for uid, count in user_activity.items():
        if count >= 25:
            alerts_list.append({
                "type": "activity_spike",
                "severity": "high",
                "user_id": uid,
                "message": f"User {uid} has extremely high activity ({count} events)"
            })

    # =========================
    # ⚠️ ALERT 2: LOW ENGAGEMENT USERS
    # =========================
    for uid, count in user_activity.items():
        if count < 3:
            alerts_list.append({
                "type": "low_engagement",
                "severity": "medium",
                "user_id": uid,
                "message": f"User {uid} is barely active ({count} events)"
            })

    # =========================
    # 💰 ALERT 3: REVENUE OPPORTUNITY
    # =========================
    pricing_views = {}

    for e in events:
        if e["event_name"] == "view_pricing":
            uid = e.get("user_id")
            pricing_views[uid] = pricing_views.get(uid, 0) + 1

    for uid, count in pricing_views.items():
        if count >= 2:
            alerts_list.append({
                "type": "revenue_opportunity",
                "severity": "high",
                "user_id": uid,
                "message": f"User {uid} viewed pricing multiple times ({count}) → strong conversion intent"
            })

    # =========================
    # 📉 ALERT 4: CHURN WARNING
    # =========================
    for uid, count in user_activity.items():
        if count < 5:
            alerts_list.append({
                "type": "churn_risk",
                "severity": "high",
                "user_id": uid,
                "message": f"User {uid} is at risk of churn (low activity)"
            })

    return {
        "status": "success",
        "total_alerts": len(alerts_list),
        "alerts": alerts_list
    }
