def calculate_aios_score(events):
    """
    Simple scoring logic based on number of events
    """
    if not events:
        return 0

    return min(len(events) * 10, 100)


def predict_churn(events):
    """
    Simple churn prediction:
    fewer events = higher churn risk
    """
    if not events:
        return 0.9

    if len(events) < 3:
        return 0.7
    elif len(events) < 5:
        return 0.5
    else:
        return 0.2


def build_user_insights(score, churn):
    """
    Build human-readable insights
    """
    if score > 70:
        insight = "Highly engaged user"
    elif score > 40:
        insight = "Active user"
    else:
        insight = "Low engagement"

    if churn > 0.7:
        insight += " — High churn risk"
    elif churn > 0.4:
        insight += " — Medium churn risk"
    else:
        insight += " — Low churn risk"

    return {
        "score": score,
        "insight": insight
    }
