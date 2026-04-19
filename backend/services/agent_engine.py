def calculate_aios_score(events):
    return len(events) * 10


def predict_churn(events):
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


def build_user_insights(score, churn, plan="free"):
    """
    FREE vs PRO logic
    """

    if plan == "free":
        return {
            "score": score,
            "insight": "Upgrade to PRO to unlock AI insights"
        }

    # PRO users get real insights
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


def decide_action(score, churn, plan="free"):
    """
    Only PRO users get automation
    """

    if plan != "pro":
        return {"action": "none"}

    if churn > 0.7:
        return {
            "action": "send_email",
            "reason": "high churn risk"
        }

    return {"action": "none"}
