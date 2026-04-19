# backend/services/agent_engine.py

def calculate_aios_score(events):
    """
    Simple scoring based on number of events
    """
    return len(events) * 10


def predict_churn(events):
    """
    Basic churn prediction logic
    """
    count = len(events)

    if count <= 1:
        return 0.95
    elif count <= 3:
        return 0.75
    elif count <= 5:
        return 0.5
    elif count <= 10:
        return 0.3
    else:
        return 0.15


def build_user_insights(score, churn):
    """
    Generate human-readable insights
    """
    if churn > 0.7:
        insight = "User at high risk of churn"
    elif churn > 0.4:
        insight = "User engagement dropping"
    else:
        insight = "Active user — low churn risk"

    return {
        "score": score,
        "insight": insight
    }


# 🚨 FORCE TEST MODE (THIS IS THE KEY PART)
def decide_action(score, churn):
    """
    FORCE email trigger to test revenue layer
    """
    return {
        "action": "send_email",
        "reason": "FORCED TEST FROM PHONE"
    }
