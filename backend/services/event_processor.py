from backend.services.agent_engine import (
    calculate_aios_score,
    predict_churn,
    decide_action,
    execute_action
)


def process_event(user_id, events, user_email=None):
    """
    Real-time AIOS processing layer
    """

    if not events:
        return {
            "status": "no_events"
        }

    score = calculate_aios_score(events)
    churn = predict_churn(events, score)
    action = decide_action(score, churn)
    action_result = execute_action(action, user_email)

    return {
        "user_id": user_id,
        "aios_score": score,
        "churn_risk": churn,
        "recommended_action": action,
        "action_result": action_result,
        "status": "processed"
    }
