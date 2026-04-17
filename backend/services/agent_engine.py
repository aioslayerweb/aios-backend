from collections import Counter
from backend.services.email_service import send_email


EVENT_WEIGHTS = {
    "login": 5,
    "view_pricing": 10,
    "start_trial": 25,
    "feature_used": 15,
    "cancel_subscription": -40
}


def calculate_aios_score(events):
    score = 0
    for e in events:
        score += EVENT_WEIGHTS.get(e.get("event_name"), 0)
    return max(score, 0)


def predict_churn(events, score):
    if not events:
        return "unknown"

    breakdown = Counter([e.get("event_name") for e in events])
    last_event = events[-1].get("event_name")

    if "cancel_subscription" in breakdown:
        return "critical"

    if score < 20:
        return "high"

    if last_event == "login" and breakdown.get("feature_used", 0) == 0:
        return "medium"

    return "low"


def decide_action(score, churn_risk):
    if churn_risk == "critical":
        return "send_discount_offer"
    if churn_risk == "high":
        return "send_email_reengagement"
    if score > 50:
        return "upsell_premium"
    return None


def execute_action(action, user_email):
    try:
        if not action or not user_email:
            return {"status": "no_action"}

        if action == "send_email_reengagement":
            return send_email(
                to_email=user_email,
                subject="We miss you at AIOS 🚀",
                content="<h1>Come back!</h1>"
            )

        if action == "send_discount_offer":
            return send_email(
                to_email=user_email,
                subject="Special Offer 💡",
                content="<h1>20% discount</h1>"
            )

        if action == "upsell_premium":
            return send_email(
                to_email=user_email,
                subject="Upgrade 🚀",
                content="<h1>Go Pro</h1>"
            )

    except Exception as e:
        return {"status": "error", "message": str(e)}

    return {"status": "unknown_action"}


def build_user_insights(user_id, events, user_email=None):

    if not events:
        return {
            "user_id": user_id,
            "total_events": 0,
            "aios_score": 0,
            "churn_risk": "unknown",
            "agent_insights": []
        }

    breakdown = Counter([e.get("event_name") for e in events])
    last_event = events[-1].get("event_name")

    score = calculate_aios_score(events)
    churn_risk = predict_churn(events, score)

    # SAFE email extraction fallback
    if not user_email:
        user_email = next(
            (e.get("user_email") for e in events if e.get("user_email")),
            None
        )

    action = decide_action(score, churn_risk)
    action_result = execute_action(action, user_email)

    return {
        "user_id": user_id,
        "user_email": user_email,
        "total_events": len(events),
        "event_breakdown": dict(breakdown),
        "last_event": last_event,
        "aios_score": score,
        "churn_risk": churn_risk,
        "recommended_action": action,
        "action_result": action_result
    }
