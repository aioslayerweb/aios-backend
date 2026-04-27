from fastapi import FastAPI
from supabase_client import supabase
import os

app = FastAPI()


@app.get("/")
def root():
    return {"message": "AIOS backend is running"}


@app.get("/events")
def get_events():
    response = supabase.table("events").select("*").execute()
    return {"status": "success", "data": response.data}


# =========================
# 🧠 GLOBAL DASHBOARD SUMMARY
# =========================
@app.get("/dashboard/summary")
def dashboard_summary():
    response = supabase.table("events").select("*").execute()
    events = response.data

    total_events = len(events)

    user_set = set()
    event_types = {}

    for e in events:
        user_set.add(e.get("user_id"))

        name = e["event_name"]
        event_types[name] = event_types.get(name, 0) + 1

    return {
        "status": "success",
        "total_events": total_events,
        "total_users": len(user_set),
        "event_distribution": event_types
    }


# =========================
# 👤 USERS OVERVIEW
# =========================
@app.get("/dashboard/users")
def dashboard_users():
    response = supabase.table("events").select("*").execute()
    events = response.data

    users = {}

    for e in events:
        uid = e.get("user_id")

        if not uid:
            continue

        if uid not in users:
            users[uid] = {
                "user_id": uid,
                "events": 0,
                "event_types": set()
            }

        users[uid]["events"] += 1
        users[uid]["event_types"].add(e["event_name"])

    # convert sets to lists for JSON
    result = []
    for u in users.values():
        result.append({
            "user_id": u["user_id"],
            "events": u["events"],
            "event_types": list(u["event_types"])
        })

    return {
        "status": "success",
        "users": result
    }


# =========================
# 🔥 POWER USERS FILTER
# =========================
@app.get("/dashboard/power-users")
def power_users():
    response = supabase.table("events").select("*").execute()
    events = response.data

    user_counts = {}

    for e in events:
        uid = e.get("user_id")
        if not uid:
            continue

        user_counts[uid] = user_counts.get(uid, 0) + 1

    power_users = []

    for uid, count in user_counts.items():
        if count >= 15:
            power_users.append({
                "user_id": uid,
                "event_count": count,
                "segment": "power_user"
            })

    return {
        "status": "success",
        "power_users": power_users
    }


# =========================
# 📉 CHURN RISK USERS
# =========================
@app.get("/dashboard/churn-risk")
def churn_risk():
    response = supabase.table("events").select("*").execute()
    events = response.data

    user_counts = {}

    for e in events:
        uid = e.get("user_id")
        if not uid:
            continue

        user_counts[uid] = user_counts.get(uid, 0) + 1

    churn_users = []

    for uid, count in user_counts.items():
        if count < 5:
            churn_users.append({
                "user_id": uid,
                "event_count": count,
                "risk": "high"
            })
        elif count < 10:
            churn_users.append({
                "user_id": uid,
                "event_count": count,
                "risk": "medium"
            })

    return {
        "status": "success",
        "churn_risk_users": churn_users
    }


# =========================
# 📊 REVENUE SIGNAL SUMMARY
# =========================
@app.get("/dashboard/revenue")
def revenue_summary():
    response = supabase.table("events").select("*").execute()
    events = response.data

    revenue_signals = {
        "high": 0,
        "medium": 0,
        "low": 0
    }

    for e in events:
        if e["event_name"] == "view_pricing":
            revenue_signals["high"] += 1
        elif e["event_name"] == "login":
            revenue_signals["medium"] += 1
        else:
            revenue_signals["low"] += 1

    return {
        "status": "success",
        "revenue_signal_distribution": revenue_signals
    }
