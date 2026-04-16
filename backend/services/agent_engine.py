from datetime import datetime, timezone

# -----------------------------
# EVENT WEIGHTS (IMPORTANT)
# -----------------------------
EVENT_WEIGHTS = {
    "login": 1,
    "signup": 3,
    "view_product": 2,
    "add_to_cart": 4,
    "purchase": 8,
    "support_ticket": 5,
    "cancel_subscription": 10
}

# -----------------------------
# RECENCY DECAY FUNCTION
# -----------------------------
def recency_weight(hours_ago: float) -> float:
    """
    The older the event, the less impact it has.
    """
    decay_rate = 0.85
    return decay_rate ** (hours_ago / 24)


# -----------------------------
# AIOS SCORE ENGINE
# -----------------------------
def calculate_aios_score(events: list) -> int:
    """
    Converts raw events into intelligence score
    """
    if not events:
        return 0

    score = 0
    now = datetime.now(timezone.utc)

    for event in events:
        event_name = event.get("event_name", "login")
        created_at = event.get("created_at")

        base_weight = EVENT_WEIGHTS.get(event_name, 1)

        # Parse timestamp safely
        try:
            event_time = datetime.fromisoformat(
                created_at.replace("Z", "+00:00")
            )
        except Exception:
            event_time = now

        hours_ago = max((now - event_time).total_seconds() / 3600, 0)

        score += base_weight * recency_weight(hours_ago)

    return min(int(score * 10), 100)  # normalize to 0–100


# -----------------------------
# CHURN RISK MODEL
# -----------------------------
def calculate_churn_risk(score: int, total_events: int) -> str:
    """
    Simple behavioral risk model
    """
    if total_events == 0:
        return "high"

    if score >= 70:
        return "low"
    elif score >= 40:
        return "medium"
    else:
        return "high"


# -----------------------------
# AGENT ENGINE (MAIN FUNCTION)
# -----------------------------
def run_all_agents(events: list = None):
    if events is None:
        events = []

    score = calculate_aios_score(events)
    churn_risk = calculate_churn_risk(score, len(events))

    return [
        {
            "agent": "sales",
            "insight": (
                "Revenue opportunity detected in active users"
                if score > 50
                else "Low purchase activity detected"
            ),
            "impact_score": min(score + 10, 100),
            "recommended_action": "Optimize pricing funnel",
            "severity": "high" if score < 40 else "medium"
        },
        {
            "agent": "customer_success",
            "insight": (
                "User engagement healthy"
                if churn_risk == "low"
                else "Churn risk increasing based on inactivity patterns"
            ),
            "impact_score": min(score + 5, 100),
            "recommended_action": "Trigger engagement workflow",
            "severity": churn_risk
        },
        {
            "agent": "operations",
            "insight": (
                "System usage stable"
                if score > 60
                else "Operational friction detected in user journey"
            ),
            "impact_score": min(score, 100),
            "recommended_action": "Improve onboarding flow",
            "severity": "medium"
        }
    ]


# -----------------------------
# USER INSIGHT SUMMARY
# -----------------------------
def build_user_insights(user_id: str, events: list):
    score = calculate_aios_score(events)
    churn_risk = calculate_churn_risk(score, len(events))

    breakdown = {}
    last_event = None

    for e in events:
        name = e.get("event_name", "unknown")
        breakdown[name] = breakdown.get(name, 0) + 1
        last_event = name

    return {
        "user_id": user_id,
        "total_events": len(events),
        "event_breakdown": breakdown,
        "last_event": last_event,
        "aios_score": score,
        "churn_risk": churn_risk,
        "agent_insights": run_all_agents(events)
    }
