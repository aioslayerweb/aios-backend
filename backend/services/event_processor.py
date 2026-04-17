# backend/services/event_processor.py

from backend.services.supabase_client import supabase
from backend.services.agent_engine import (
    calculate_aios_score,
    build_user_insights,
    predict_churn,
    decide_action,
    execute_action
)


def process_event(user_id: str, user_email: str, event_name: str):
    """
    Main pipeline triggered after event is stored
    """

    # 1. Get all user events
    response = supabase.table("events").select("*").eq("user_id", user_id).execute()
    events = response.data or []

    # 2. Compute intelligence
    score = calculate_aios_score(events)
    insights = build_user_insights(events)
    churn = predict_churn(events)

    # 3. Decide action
    action = decide_action(churn)

    # 4. Execute action
    execute_action(action, user_email)

    return {
        "score": score,
        "insights": insights,
        "churn": churn,
        "action": action
    }
