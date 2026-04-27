from fastapi import FastAPI
from supabase_client import supabase
from collections import defaultdict

app = FastAPI()


# =========================
# 🏠 HEALTH CHECK
# =========================
@app.get("/")
def root():
    return {"message": "AIOS backend is running"}


# =========================
# 📊 DASHBOARD OVERVIEW (MAIN KPI SCREEN)
# =========================
@app.get("/dashboard/overview")
def dashboard_overview():
    response = supabase.table("events").select("*").execute()
    events = response.data or []

    total_events = len(events)
    unique_users = len(set(e["user_id"] for e in events if e.get("user_id")))

    event_types = defaultdict(int)
    for e in events:
        event_types[e["event_name"]] += 1

    top_event = max(event_types.items(), key=lambda x: x[1])[0] if event_types else None

    return {
        "status": "success",
        "kpis": {
            "total_events": total_events,
            "unique_users": unique_users,
            "top_event": top_event
        },
        "event_breakdown": dict(event_types)
    }


# =========================
# 👤 USER ANALYTICS (FRONTEND PROFILE PAGE)
# =========================
@app.get("/dashboard/user/{user_id}")
def user_dashboard(user_id: str):
    response = supabase.table("events").select("*").eq("user_id", user_id).execute()
    events = response.data or []

    if not events:
        return {
            "status": "success",
            "user_id": user_id,
            "message": "No activity found"
        }

    event_counts = defaultdict(int)

    for e in events:
        event_counts[e["event_name"]] += 1

    total_events = len(events)

    engagement_score = min(100, total_events * 5)

    return {
        "status": "success",
        "user_id": user_id,
        "engagement_score": engagement_score,
        "total_events": total_events,
        "event_breakdown": dict(event_counts),
        "last_activity": events[-1]["created_at"]
    }


# =========================
# 📈 EVENT ANALYTICS (TREND SCREEN)
# =========================
@app.get("/dashboard/events")
def event_dashboard():
    response = supabase.table("events").select("*").execute()
    events = response.data or []

    trend = defaultdict(int)
    for e in events:
        trend[e["event_name"]] += 1

    sorted_trend = sorted(trend.items(), key=lambda x: x[1], reverse=True)

    return {
        "status": "success",
        "total_events": len(events),
        "event_trends": [
            {"event": k, "count": v} for k, v in sorted_trend
        ]
    }


# =========================
# 🔔 ALERTS FEED (FRONTEND READY)
# =========================
@app.get("/dashboard/alerts")
def dashboard_alerts():
    response = supabase.table("events").select("*").execute()
    events = response.data or []

    user_activity = defaultdict(int)
    pricing_views = defaultdict(int)

    for e in events:
        uid = e.get("user_id")
        if not uid:
            continue

        user_activity[uid] += 1

        if e["event_name"] == "view_pricing":
            pricing_views[uid] += 1

    alerts = []

    for uid, count in pricing_views.items():
        if count >= 2:
            alerts.append({
                "type": "revenue_opportunity",
                "severity": "high",
                "user_id": uid,
                "message": "High purchase intent detected"
            })

    for uid, count in user_activity.items():
        if count < 3:
            alerts.append({
                "type": "churn_risk",
                "severity": "high",
                "user_id": uid,
                "message": "User at risk of churn"
            })

    return {
        "status": "success",
        "total_alerts": len(alerts),
        "alerts": alerts
    }


# =========================
# 🧠 AI INSIGHTS (NORMALIZED OUTPUT)
# =========================
@app.get("/dashboard/insights/{user_id}")
def dashboard_insights(user_id: str):
    response = supabase.table("events").select("*").eq("user_id", user_id).execute()
    events = response.data or []

    if not events:
        return {
            "status": "success",
            "user_id": user_id,
            "insight": "No data available"
        }

    total = len(events)
    logins = len([e for e in events if e["event_name"] == "login"])

    engagement_score = min(100, total * 5)

    if engagement_score > 80:
        user_type = "power_user"
    elif engagement_score > 40:
        user_type = "active_user"
    else:
        user_type = "low_activity"

    return {
        "status": "success",
        "user_id": user_id,
        "engagement_score": engagement_score,
        "user_type": user_type,
        "total_events": total,
        "login_count": logins,
        "insight": f"{user_type} with {total} total events"
    }
