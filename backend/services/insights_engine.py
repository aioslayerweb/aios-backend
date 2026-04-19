from backend.services.supabase_client import supabase

def build_user_insights(user_id: str):
    """
    Build insights for a user based on their events
    """

    # Fetch user events
    response = supabase.table("events") \
        .select("*") \
        .eq("user_id", user_id) \
        .execute()

    events = response.data if response.data else []

    events_count = len(events)

    # Basic churn logic (MVP)
    if events_count == 0:
        churn_risk = 0.9
        insight_text = "No activity — high churn risk"
    elif events_count < 3:
        churn_risk = 0.6
        insight_text = "Low activity — medium churn risk"
    else:
        churn_risk = 0.2
        insight_text = "Active user — low churn risk"

    return {
        "user_id": user_id,
        "events_count": events_count,
        "insights": {
            "score": int((1 - churn_risk) * 100),
            "insight": insight_text
        },
        "churn_risk": churn_risk
    }
