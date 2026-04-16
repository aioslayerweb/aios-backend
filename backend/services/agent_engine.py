import os
from datetime import datetime, timezone

# -----------------------------
# EVENT WEIGHTS (AIOS CORE SIGNALS)
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
# RECENCY FUNCTION
# -----------------------------
def recency_weight(hours_ago: float) -> float:
    return 0.85 ** (hours_ago / 24)


# -----------------------------
# AIOS SCORE ENGINE
# -----------------------------
def calculate_aios_score(events: list) -> int:
    if not events:
        return 0

    now = datetime.now(timezone.utc)
    score = 0

    for e in events:
        name = e.get("event_name", "login")
        created_at = e.get("created_at")

        weight = EVENT_WEIGHTS.get(name, 1)

        try:
            t = datetime.fromisoformat(created_at.replace("Z", "+00:00"))
        except:
            t = now

        hours = max((now - t).total_seconds() / 3600, 0)

        score += weight * recency_weight(hours)

    return min(int(score * 10), 100)


# -----------------------------
# CHURN RISK MODEL
# -----------------------------
def calculate_churn_risk(score: int, total_events: int) -> str:
    if total_events == 0:
        return "high"
    if score >= 70:
        return "low"
    if score >= 40:
        return "medium"
    return "high"


# -----------------------------
# PREDICTIVE LAYER (STEP 5.4)
# -----------------------------
def predict_churn_probability(score, total_events, churn_risk):
    base = 100 - score

    if churn_risk == "high":
        base += 25
    if total_events == 0:
        base += 30

    return max(0, min(100, base))


def predict_next_best_action(score, churn_risk, events):
    has_purchase = any(e.get("event_name") == "purchase" for e in events)
    has_cart = any(e.get("event_name") == "add_to_cart" for e in events)

    if churn_risk == "high":
        return "send_email_reengagement"

    if has_cart and not has_purchase:
        return "send_discount_offer"

    if score > 70:
        return "upsell_premium"

    return "monitor"


# -----------------------------
# AUTONOMOUS ACTION LAYER (STEP 5.5)
# -----------------------------
def execute_action(action: str, user_id: str, score: int):
    payload = {
        "user_id": user_id,
        "action": action,
        "score": score,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

    if action == "send_email_reengagement":
        return {
            "status": "email_sent",
            "payload": payload
        }

    if action == "send_discount_offer":
        return {
            "status": "discount_sent",
            "payload": payload
        }

    if action == "upsell_premium":
        return {
            "status": "upsell_triggered",
            "payload": payload
        }

    return {
        "status": "no_action",
        "payload": payload
    }


# -----------------------------
# MAIN AIOS ENGINE (USED BY /api/insights/{user_id})
# -----------------------------
def build_user_insights(user_id: str, events: list):
    score = calculate_aios_score(events)
    churn_risk = calculate_churn_risk(score, len(events))

    churn_probability = predict_churn_probability(
        score, len(events), churn_risk
    )

    next_action = predict_next_best_action(
        score, churn_risk, events
    )

    action_result = execute_action(
        next_action, user_id, score
    )

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

        # predictive layer
        "churn_probability": round(churn_probability, 2),
        "next_best_action": next_action,

        # autonomous layer
        "action_result": action_result
    }


# -----------------------------
# COMPATIBILITY LAYER (FIXES IMPORT ERROR)
# -----------------------------
def run_all_agents():
    """
    Legacy endpoint support for /api/insights
    """

    return [
        {
            "agent": "sales",
            "insight": "Revenue anomaly detected in mid-tier customers",
            "impact_score": 85,
            "recommended_action": "Review pricing conversion funnel",
            "severity": "high"
        },
        {
            "agent": "customer_success",
            "insight": "Churn risk increased for inactive accounts",
            "impact_score": 90,
            "recommended_action": "Trigger re-engagement campaign",
            "severity": "high"
        },
        {
            "agent": "operations",
            "insight": "Support ticket resolution time is increasing",
            "impact_score": 78,
            "recommended_action": "Optimize support workflow routing",
            "severity": "medium"
        }
    ]
