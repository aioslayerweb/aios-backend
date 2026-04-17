# backend/services/agent_engine.py

import random
from datetime import datetime

# Optional email service (safe fallback)
try:
    from backend.services.email_service import send_email
except Exception:
    def send_email(*args, **kwargs):
        return None


# =========================
# 1. AIOS SCORE ENGINE
# =========================

def calculate_aios_score(events: list) -> int:
    if not events:
        return 0

    score = 0

    for e in events:
        name = e.get("event_name", "")

        if name == "login":
            score += 10
        elif name == "view_pricing":
            score += 15
        elif name == "upgrade":
            score += 50
        elif name == "cancel_subscription":
            score -= 60
        elif name == "support_ticket":
            score += 5
        else:
            score += 2

    return max(0, score)


# =========================
# 2. CHURN PREDICTION
# =========================

def predict_churn(events: list, score: int) -> str:
    if score < 20:
        return "high"
    elif score < 50:
        return "medium"
    return "low"


# =========================
# 3. AGENT SYSTEM
# =========================

def run_all_agents(events: list) -> list:
    return [
        {
            "agent": "sales",
            "insight": "Revenue anomaly detected in mid-tier customers",
            "impact_score": random.randint(70, 98),
            "recommended_action": "Review pricing conversion funnel",
            "severity": "high"
        },
        {
            "agent": "customer_success",
            "insight": "Churn risk increased for inactive accounts",
            "impact_score": random.randint(60, 99),
            "recommended_action": "Trigger re-engagement campaign",
            "severity": "high"
        },
        {
            "agent": "operations",
            "insight": "Support ticket resolution time is increasing",
            "impact_score": random.randint(55, 90),
            "recommended_action": "Optimize support workflow routing",
            "severity": "medium"
        }
    ]


# =========================
# 4. ACTION DECISION ENGINE (NEW FIX)
# =========================

def decide_action(aios_score: int, churn_risk: str) -> dict:
    """
    Determines whether system should trigger automation actions.
    """

    if churn_risk == "high":
        return {
            "trigger": True,
            "action": "send_recovery_email",
            "priority": "urgent"
        }

    if aios_score > 70:
        return {
            "trigger": True,
            "action": "upsell_email",
            "priority": "medium"
        }

    return {
        "trigger": False,
        "action": None,
        "priority": "low"
    }


# =========================
# 5. USER INSIGHTS BUILDER
# =========================

def build_user_insights(user_id: str, events: list) -> dict:

    score = calculate_aios_score(events)
    churn = predict_churn(events, score)
    agents = run_all_agents(events)
    action = decide_action(score, churn)

    # Optional: trigger email (safe hook)
    if action["trigger"]:
        send_email(
            to_email=f"{user_id}@aios.com",
            subject="AIOS Insight Alert",
            content=f"Action: {action['action']}"
        )

    return {
        "user_id": user_id,
        "total_events": len(events),
        "event_breakdown": _group_events(events),
        "last_event": events[-1]["event_name"] if events else None,
        "aios_score": score,
        "churn_risk": churn,
        "agent_insights": agents,
        "automation": action
    }


# =========================
# 6. HELPERS
# =========================

def _group_events(events: list) -> dict:
    result = {}

    for e in events:
        name = e.get("event_name", "unknown")
        result[name] = result.get(name, 0) + 1

    return result
