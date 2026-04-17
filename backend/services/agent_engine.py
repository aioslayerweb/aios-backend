from collections import Counter


# =========================================================
# SAFE EMAIL FUNCTION (NO DEPLOY CRASHES)
# =========================================================

def send_email(to_email, subject, content):
    """
    Safe fallback email sender.
    Replace later with real Resend / SMTP integration.
    """

    return {
        "status": "mock_email_sent",
        "to": to_email,
        "subject": subject,
        "content_preview": content[:100] if content else ""
    }


# =========================================================
# EVENT WEIGHTS (AIOS CORE INTELLIGENCE)
# =========================================================

EVENT_WEIGHTS = {
    "login": 5,
    "view_pricing": 10,
    "start_trial": 25,
    "feature_used": 15,
    "cancel_subscription": -40,
    "signup": 20,
    "upgrade_plan": 35
}


# =========================================================
# SCORE ENGINE
# =========================================================

def calculate_aios_score(events):
    score = 0

    for e in events:
        event_name = e.get("event_name")
        score += EVENT_WEIGHTS.get(event_name, 0)

    return max(score, 0)


# =========================================================
# CHURN ENGINE
# =========================================================

def predict_churn(events, score):
    if not events:
        return "unknown"

    breakdown = Counter([e.get("event_name") for e in events])
    last_event = events[-1].get("event_name")

    if "cancel_subscription" in breakdown:
        return "critical"

    if score < 20:
        return "high"

    if score < 50:
        return "medium"

    if last_event == "login" and breakdown.get("feature_used", 0) == 0:
        return "medium"

    return "low"


# =========================================================
# ACTION ENGINE
# =========================================================

def decide_action(score, churn_risk):
    if churn_risk == "critical":
        return "send_discount_offer"

    if churn_risk == "high":
        return "send_email_reengagement"

    if score >= 70:
        return "upsell_premium"

    return None


# =========================================================
# ACTION EXECUTION
# =========================================================

def execute_action(action, user_email):
    try:
        if not action or not user_email:
            return {"status": "no_action"}

        if action == "send_email_reengagement":
            return send_email(
                to_email=user_email,
                subject="We miss you at AIOS 🚀",
                content="<h1>Come back!</h1><p>Your insights are waiting.</p>"
            )

        if action == "send_discount_offer":
            return send_email(
                to_email=user_email,
                subject="Special Offer Just for You 💡",
                content="<h1>20% Off</h1><p>Come back and save.</p>"
            )

        if action == "upsell_premium":
            return send_email(
                to_email=user_email,
                subject="Upgrade to AIOS Pro 🚀",
                content="<h1>Unlock Full Power</h1><p>Upgrade now to scale faster.</p>"
            )

        return {"status": "unknown_action"}

    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }


# =========================================================
# MAIN INSIGHTS ENGINE
# =========================================================

def build_user_insights(user_id, events, user_email=None):

    if not events:
        return {
            "user_id": user_id,
            "total_events": 0,
            "aios_score": 0,
            "churn_risk": "unknown",
            "event_breakdown": {},
            "last_event": None,
            "agent_insights": [],
            "recommended_action": None,
            "action_result": None
        }

    breakdown = Counter([e.get("event_name") for e in events])
    last_event = events[-1].get("event_name")

    score = calculate_aios_score(events)
    churn_risk = predict_churn(events, score)

    # fallback email extraction from events
    if not user_email:
        user_email = next(
            (e.get("user_email") for e in events if e.get("user_email")),
            None
        )

    action = decide_action(score, churn_risk)
    action_result = execute_action(action, user_email)

    # simple agent insights layer (MVP version)
    agent_insights = [
        {
            "agent": "sales",
            "insight": "Revenue behavior trend analyzed",
            "impact_score": min(score, 100),
            "severity": "high" if score > 60 else "medium"
        },
        {
            "agent": "customer_success",
            "insight": f"Churn risk detected: {churn_risk}",
            "impact_score": 100 - score,
            "severity": churn_risk
        },
        {
            "agent": "operations",
            "insight": "System engagement patterns evaluated",
            "impact_score": int(score * 0.8),
            "severity": "medium"
        }
    ]

    return {
        "user_id": user_id,
        "user_email": user_email,
        "total_events": len(events),
        "event_breakdown": dict(breakdown),
        "last_event": last_event,
        "aios_score": score,
        "churn_risk": churn_risk,
        "recommended_action": action,
        "action_result": action_result,
        "agent_insights": agent_insights
    }
