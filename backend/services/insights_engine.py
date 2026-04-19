def build_user_insights(events):
    """
    Core AIOS logic: converts raw events into insights + churn prediction
    """

    events_count = len(events)

    # --- SIMPLE CHURN MODEL (MVP) ---
    if events_count >= 5:
        churn_risk = 0.2
        insight = "Active user — low churn risk"
    elif events_count >= 2:
        churn_risk = 0.5
        insight = "Moderately active — monitor engagement"
    else:
        churn_risk = 0.8
        insight = "Low activity — high churn risk"

    return {
        "user_id": events[0]["user_id"] if events else None,
        "events_count": events_count,
        "churn_risk": churn_risk,
        "insight": insight
    }
