from fastapi import FastAPI
from supabase_client import supabase
from datetime import datetime

app = FastAPI()


@app.get("/")
def root():
    return {"message": "AIOS backend is running"}


# =========================
# 📊 ALERTS ENGINE (CLEAN v1.1)
# =========================
@app.get("/alerts")
def alerts():
    response = supabase.table("events").select("*").execute()
    events = response.data

    if not events:
        return {"status": "success", "total_alerts": 0, "alerts": []}

    user_activity = {}
    pricing_views = {}

    for e in events:
        uid = e.get("user_id")
        if not uid:
            continue

        user_activity[uid] = user_activity.get(uid, 0) + 1

        if e["event_name"] == "view_pricing":
            pricing_views[uid] = pricing_views.get(uid, 0) + 1

    alerts_map = {}

    # Revenue intent (highest priority)
    for uid, count in pricing_views.items():
        if count >= 2:
            alerts_map[uid] = {
                "type": "revenue_opportunity",
                "severity": "high",
                "user_id": uid,
                "message": f"Strong purchase intent detected ({count} pricing views)"
            }

    # Churn risk
    for uid, count in user_activity.items():
        if uid in alerts_map:
            continue

        if count < 3:
            alerts_map[uid] = {
                "type": "churn_risk",
                "severity": "high",
                "user_id": uid,
                "message": f"High churn risk detected ({count} events)"
            }

    # Low engagement
    for uid, count in user_activity.items():
        if uid in alerts_map:
            continue

        if count < 6:
            alerts_map[uid] = {
                "type": "low_engagement",
                "severity": "medium",
                "user_id": uid,
                "message": f"Low engagement detected ({count} events)"
            }

    alerts_list = list(alerts_map.values())

    return {
        "status": "success",
        "total_alerts": len(alerts_list),
        "alerts": alerts_list
    }


# =========================
# 🔔 NOTIFICATION ENGINE v1
# =========================
@app.get("/notifications")
def notifications():
    alerts_response = alerts()
    alerts_list = alerts_response["alerts"]

    notifications = []

    for alert in alerts_list:
        notif = {
            "id": f"notif_{alert['user_id']}_{datetime.utcnow().timestamp()}",
            "user_id": alert["user_id"],
            "type": alert["type"],
            "severity": alert["severity"],
            "title": build_title(alert),
            "message": alert["message"],
            "created_at": datetime.utcnow().isoformat(),
            "channel": "api"  # future: email, slack, push
        }
        notifications.append(notif)

    return {
        "status": "success",
        "total_notifications": len(notifications),
        "notifications": notifications
    }


# =========================
# 🧠 NOTIFICATION TITLE ENGINE
# =========================
def build_title(alert):
    if alert["type"] == "revenue_opportunity":
        return "🔥 High Purchase Intent Detected"
    elif alert["type"] == "churn_risk":
        return "⚠️ User at Risk of Churn"
    elif alert["type"] == "low_engagement":
        return "📉 Low User Engagement"
    return "AIOS Alert"


# =========================
# 📦 EVENTS (existing DB endpoint)
# =========================
@app.get("/events")
def events():
    response = supabase.table("events").select("*").execute()
    return {"status": "success", "data": response.data}
