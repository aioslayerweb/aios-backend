from datetime import datetime
from backend.services.supabase_client import supabase


def calculate_engagement(event_name: str, current_score: int) -> int:
    """Simple scoring engine (AIOS v1 logic)"""

    scores = {
        "login": 5,
        "logout": 1,
        "purchase": 20,
        "signup": 25,
        "page_view": 2,
        "feature_use": 10
    }

    return current_score + scores.get(event_name, 1)


def compute_churn_risk(score: int) -> str:
    """Simple AIOS churn model (v1 heuristic)"""

    if score < 10:
        return "high"
    elif score < 40:
        return "medium"
    return "low"


def update_user_insights(user_id: str, event_name: str, event_data: dict):
    """Main AIOS intelligence pipeline"""

    # 1. Fetch existing insights
    existing = supabase.table("user_insights") \
        .select("*") \
        .eq("user_id", user_id) \
        .execute()

    now = datetime.utcnow().isoformat()

    # 2. If user doesn't exist → create base row
    if not existing.data:
        new_score = calculate_engagement(event_name, 0)

        supabase.table("user_insights").insert({
            "user_id": user_id,
            "engagement_score": new_score,
            "churn_risk": compute_churn_risk(new_score),
            "last_activity": now,
            "insights": {
                "last_event": event_name,
                "event_data": event_data
            }
        }).execute()

        return

    # 3. Update existing user
    row = existing.data[0]
    new_score = calculate_engagement(event_name, row["engagement_score"])

    supabase.table("user_insights").update({
        "engagement_score": new_score,
        "churn_risk": compute_churn_risk(new_score),
        "last_activity": now,
        "insights": {
            "last_event": event_name,
            "event_data": event_data
        },
        "updated_at": now
    }).eq("user_id", user_id).execute()
