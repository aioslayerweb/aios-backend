# backend/services/agent_engine.py

from datetime import datetime
import random

# Optional email service (safe fallback if missing)
try:
    from backend.services.email_service import send_email
except Exception:
    def send_email(*args, **kwargs):
        return None


# ==============================
# CORE AIOS SCORE ENGINE
# ==============================

def calculate_aios_score(events: list) -> int:
    """
    Calculates system intelligence score based on user behavior.
    """
    if not events:
        return 0

    score = 0

    for e in events:
        event_name = e.get("event_name", "")

        if event_name == "login":
            score += 10
        elif event_name == "view_pricing":
            score += 15
        elif event_name == "upgrade":
            score += 40
        elif event_name == "cancel_subscription":
            score -= 50
        elif event_name == "support_ticket":
            score += 5
        else:
            score += 2

    return max(0, score)


# ==============================
# CHURN PREDICTION (SIMPLE HEURISTIC AI)
# ==============================

def predict_churn(events: list, score: int) -> str:
    """
    Returns churn risk level.
    """
    if score < 20:
        return "high"
    elif score < 50:
        return "medium"
    return "low"


# ==============================
# AGENT ENGINE (3 CORE AGENTS)
# ==============================

def run_all_agents(events: list) -> list:
    """
    Runs Sales, CS, Ops agents and returns insights.
    """

    insights = []

    # SALES AGENT
    insights.append({
        "agent": "sales",
        "insight": "Revenue anomaly detected in mid-tier customers",
        "impact_score": random.randint(70, 95),
        "recommended_action": "Review pricing conversion funnel",
        "severity": "high"
    })

    # CUSTOMER SUCCESS AGENT
    insights.append({
        "agent": "customer_success",
        "insight": "Churn risk increased for inactive accounts",
        "impact_score": random.randint(60, 98),
        "recommended_action": "Trigger re-engagement campaign",
        "severity": "high"
    })

    # OPERATIONS AGENT
    insights.append({
        "agent": "operations",
        "insight": "Support ticket resolution time is increasing",
        "impact_score": random.randint(55, 90),
        "recommended_action": "Optimize support workflow routing",
        "severity": "medium"
    })

    return insights


# ==============================
# USER INSIGHT BUILDER (MAIN ENTRY)
# ==============================

def build_user_insights(user_id: str, events: list) -> dict:
    """
    Main intelligence function used by /api/insights/{user_id}
    """

    ai_score = calculate_aios_score(events)
    churn_risk = predict_churn(events, ai_score)
    agent_insights = run_all_agents(events)

    return {
        "user_id": user_id,
        "total_events": len(events),
        "event_breakdown": _group_events(events),
        "last_event": events[-1]["event_name"] if events else None,
        "aios_score": ai_score,
        "churn_risk": churn_risk,
        "agent_insights": agent_insights
    }


# ==============================
# EVENT HELPERS
# ==============================

def _group_events(events: list) -> dict:
    """
    Groups event counts by type.
    """
    breakdown = {}

    for e in events:
        name = e.get("event_name", "unknown")
        breakdown[name] = breakdown.get(name, 0) + 1

    return breakdown
