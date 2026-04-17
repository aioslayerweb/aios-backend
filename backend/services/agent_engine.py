def calculate_aios_score(events):
    """
    Simple engagement scoring model
    """
    if not events:
        return 0

    score = len(events) * 10

    # cap score at 100
    return min(score, 100)


def predict_churn(events):
    """
    Simple churn prediction model (0 → low risk, 1 → high risk)
    """
    if not events:
        return 0.9

    count = len(events)

    if count < 3:
        return 0.7
    elif count < 5:
        return 0.4
    else:
        return 0.2


def build_user_insights(score, churn):
    """
    Generate human-readable insight string + structured output
    """

    if score >= 70:
        base = "Highly engaged user"
    elif score >= 40:
        base = "Active user"
    else:
        base = "Low engagement user"

    # IMPORTANT: use simple hyphen to avoid encoding issues
    if churn >= 0.7:
        base += " - High churn risk"
    elif churn >= 0.4:
        base += " - Medium churn risk"
    else:
        base += " - Low churn risk"

    return {
        "score": score,
        "insight": base
    }


def decide_action(score, churn):
    """
    Future AIOS ACTION ENGINE (used in STEP 3)

    Returns what system should DO next:
    - send_email
    - upsell
    - do_nothing
    """

    if churn >= 0.7:
        return {
            "action": "send_email",
            "reason": "High churn risk detected"
        }

    if score >= 80:
        return {
            "action": "upsell",
            "reason": "Highly engaged user"
        }

    return {
        "action": "do_nothing",
        "reason": "No trigger conditions met"
    }
