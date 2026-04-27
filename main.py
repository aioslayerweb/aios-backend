from fastapi import FastAPI
from supabase_client import supabase

app = FastAPI()


@app.get("/")
def root():
    return {"message": "AIOS backend is running"}


@app.get("/alerts")
def alerts():
    response = supabase.table("events").select("*").execute()
    events = response.data

    if not events:
        return {"status": "success", "total_alerts": 0, "alerts": []}

    # =========================
    # 📊 USER ACTIVITY MAP
    # =========================
    user_activity = {}
    pricing_views = {}

    for e in events:
        uid = e.get("user_id")
        if not uid:
            continue

        user_activity[uid] = user_activity.get(uid, 0) + 1

        if e["event_name"] == "view_pricing":
            pricing_views[uid] = pricing_views.get(uid, 0) + 1

    # =========================
    # 🧠 FINAL ALERT MAP (DEDUPED)
    # =========================
    alerts_map = {}

    # =========================
    # 🚨 RULE 1: REVENUE (HIGHEST PRIORITY)
    # =========================
    for uid, count in pricing_views.items():
        if count >= 2:
            alerts_map[uid] = {
                "type": "revenue_opportunity",
                "severity": "high",
                "user_id": uid,
                "priority": 1,
                "message": f"User {uid} shows strong purchase intent ({count} pricing views)"
            }

    # =========================
    # ⚠️ RULE 2: CHURN RISK
    # =========================
    for uid, count in user_activity.items():
        if uid in alerts_map:
            continue  # already high-priority alert assigned

        if count < 3:
            alerts_map[uid] = {
                "type": "churn_risk",
                "severity": "high",
                "user_id": uid,
                "priority": 2,
                "message": f"User {uid} is at high churn risk ({count} events)"
            }

    # =========================
    # 📉 RULE 3: LOW ENGAGEMENT
    # =========================
    for uid, count in user_activity.items():
        if uid in alerts_map:
            continue  # skip if already assigned

        if count < 6:
            alerts_map[uid] = {
                "type": "low_engagement",
                "severity": "medium",
                "user_id": uid,
                "priority": 3,
                "message": f"User {uid} has low engagement ({count} events)"
            }

    # =========================
    # 📦 FINAL OUTPUT
    # =========================
    alerts_list = list(alerts_map.values())

    # sort by priority (1 = highest)
    alerts_list.sort(key=lambda x: x["priority"])

    # remove internal field before returning
    for a in alerts_list:
        a.pop("priority", None)

    return {
        "status": "success",
        "total_alerts": len(alerts_list),
        "alerts": alerts_list
    }
