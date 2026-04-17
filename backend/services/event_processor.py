from backend.services.supabase_client import supabase
from backend.services.agent_engine import (
    calculate_aios_score,
    predict_churn,
    build_user_insights,
    decide_action,
    execute_action
)


# =========================
# FETCH USER EVENTS
# =========================
def get_user_events(user_id: str):
    response = supabase.table("events").select("*").eq("user_id", user_id).execute()
    return response.data if response.data else []


# =========================
# PROCESS EVENT (CORE PIPELINE)
# =========================
def process_event(event: dict):
    user_id = event.get("user_id")

    # 1. Fetch all events
    events = get_user_events(user_id)

    # 2. AI scoring
    score = calculate_aios_score(events)

    # 3. Churn prediction
    churn = predict_churn(events)

    # 4. Insights
    insights = build_user_insights(score, churn)

    # 5. Decision
    action = decide_action(score, churn)

    # 6. Execute action (email, etc.)
    execute_action(user_id, action)

    return {
        "score": score,
        "churn": churn,
        "insights": insights,
        "action": action
    }
