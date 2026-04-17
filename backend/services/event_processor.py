from backend.services.agent_engine import (
    calculate_aios_score,
    build_user_insights,
    predict_churn,
    decide_action,
    execute_action
)

from backend.services.supabase_client import supabase


# =========================
# REQUIRED FIX: missing function
# =========================

def get_user_events(user_id: str):
    """
    Fetch raw events from Supabase for a user.
    This is required by insights.py.
    """

    response = supabase.table("events") \
        .select("*") \
        .eq("user_id", user_id) \
        .execute()

    return response.data or []


# =========================
# MAIN PROCESSOR (keeps system working)
# =========================

def process_event(event: dict):
    """
    Main event pipeline entry
    """

    user_id = event.get("user_id")
    user_email = event.get("user_email")

    if not user_id:
        return {"error": "missing user_id"}

    insights = build_user_insights(user_id)
    action = decide_action(user_id)

    result = execute_action(user_id, user_email, action)

    return {
        "insights": insights,
        "action": action,
        "result": result
    }
