from collections import Counter
from datetime import datetime
from typing import Dict, List, Any


def build_summary(counter: Counter) -> Dict[str, int]:
    """
    Returns a normalized event summary.
    """

    return {
        "page_views": counter.get("page_view", 0),
        "pricing_views": counter.get("view_pricing", 0),
        "signups": counter.get("signup", 0),
        "emails_opened": counter.get("email_opened", 0),
        "emails_clicked": counter.get("email_clicked", 0),
        "support_requests": counter.get("support_request", 0),
    }


def calculate_customer_health(event_count: int, counter: Counter) -> Dict[str, Any]:
    """
    Calculates a simple customer health score.

    This will later be replaced by Bayesian reasoning and AI models.
    """

    score = 50

    score += min(counter.get("signup", 0) * 20, 20)
    score += min(counter.get("view_pricing", 0) * 10, 20)
    score += min(event_count, 20)

    score = max(0, min(score, 100))

    if score >= 80:
        status = "excellent"
    elif score >= 60:
        status = "healthy"
    elif score >= 40:
        status = "watch"
    else:
        status = "at_risk"

    return {
        "score": score,
        "status": status,
    }


def extract_signals(events: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    AIOS Signal Engine v1

    Converts raw events into structured business intelligence.

    Future versions will include:
    - Bayesian reasoning
    - Monte Carlo forecasting
    - Customer Lifetime Value prediction
    - Churn prediction
    - Executive recommendations
    """

    if not events:
        return {
            "status": "no_data",
            "event_count": 0,
            "summary": {},
            "customer_health": {
                "score": 0,
                "status": "unknown"
            },
            "signals": [],
            "recommendations": [],
            "timestamp": datetime.utcnow().isoformat()
        }

    event_names = [
        e.get("event_name")
        for e in events
        if e.get("event_name")
    ]

    counter = Counter(event_names)

    signals = []

    # -------------------------
    # Engagement
    # -------------------------

    if len(events) >= 5:
        signals.append({
            "category": "engagement",
            "signal": "active_user",
            "priority": "medium",
            "strength": len(events)
        })

    # -------------------------
    # Revenue Intent
    # -------------------------

    if counter.get("view_pricing", 0) > 0:
        signals.append({
            "category": "revenue",
            "signal": "pricing_interest",
            "priority": "high",
            "strength": counter["view_pricing"]
        })

    # -------------------------
    # Conversion
    # -------------------------

    if counter.get("signup", 0) > 0:
        signals.append({
            "category": "conversion",
            "signal": "signup_completed",
            "priority": "high",
            "strength": counter["signup"]
        })

    # -------------------------
    # Churn Risk
    # -------------------------

    if len(events) == 1:
        signals.append({
            "category": "risk",
            "signal": "low_activity",
            "priority": "medium",
            "strength": 1
        })

    recommendations = []

    if counter.get("view_pricing", 0) > 0:
        recommendations.append(
            "High buying intent detected. Prioritise sales follow-up."
        )

    if len(events) <= 1:
        recommendations.append(
            "Low engagement detected. Trigger a re-engagement workflow."
        )

    if counter.get("signup", 0) > 0:
        recommendations.append(
            "Customer converted. Start onboarding sequence."
        )

    return {
        "status": "ok",
        "event_count": len(events),
        "summary": build_summary(counter),
        "customer_health": calculate_customer_health(
            len(events),
            counter
        ),
        "signals": signals,
        "recommendations": recommendations,
        "timestamp": datetime.utcnow().isoformat()
    }