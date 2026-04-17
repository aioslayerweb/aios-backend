from backend.services.agent_engine import (
    build_user_insights,
    predict_churn,
    decide_action,
    execute_action
)

from backend.services.supabase_client import supabase


def get_user_events(user_id: str):
    response = supabase.table("events") \
        .select("*") \
        .eq("user_id", user_id) \
        .execute()

    return response.data or []


def process_event(event: dict):
    user_id = event.get("user_id")
    user_email = event.get("user_email")

    if not user_id:
        return {"error": "missing user_id"}

    # 🔥 STEP 1 — compute intelligence
    insights = build_user_insights(user_id)
    churn = predict_churn(user_id)

    # 🔥 STEP 2 — decide action
    action = decide_action(user_id)

    # 🔥 STEP 3 — execute action automatically
    result = execute_action(user_id, user_email, action)

    return {
        "insights": insights,
        "churn_risk": churn,
        "action": action,
        "result": result
    }
