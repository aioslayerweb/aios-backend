import os
import json
import random
from datetime import datetime, timezone
from openai import OpenAI

# -----------------------------
# OPENAI CLIENT
# -----------------------------
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# -----------------------------
# EVENT WEIGHTS
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
# RECENCY DECAY
# -----------------------------
def recency_weight(hours_ago: float) -> float:
    decay_rate = 0.85
    return decay_rate ** (hours_ago / 24)


# -----------------------------
# AIOS SCORE ENGINE
# -----------------------------
def calculate_aios_score(events: list) -> int:
    if not events:
        return 0

    score = 0
    now = datetime.now(timezone.utc)

    for event in events:
        event_name = event.get("event_name", "login")
        created_at = event.get("created_at")

        base_weight = EVENT_WEIGHTS.get(event_name, 1)

        try:
            event_time = datetime.fromisoformat(
                created_at.replace("Z", "+00:00")
            )
        except Exception:
            event_time = now

        hours_ago = max((now - event_time).total_seconds() / 3600, 0)

        score += base_weight * recency_weight(hours_ago)

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
# PREDICTIVE LAYER 5.4
# -----------------------------

def predict_churn_probability(score: int, total_events: int, churn_risk: str) -> float:
    base = 100 - score

    if churn_risk == "high":
        base += 25
    elif churn_risk == "medium":
        base += 10

    if total_events == 0:
        base += 30

    return max(0, min(100, base))


def predict_revenue_potential(score: int, events: list) -> float:
    event_value = {
        "login": 1,
        "view_product": 3,
        "add_to_cart": 7,
        "purchase": 20,
        "signup": 5
    }

    activity_score = 0

    for e in events:
        activity_score += event_value.get(e.get("event_name", ""), 1)

    return min(100, (score * 0.6) + (activity_score * 2))


def predict_next_best_action(score: int, churn_risk: str, events: list) -> str:
    has_purchase = any(e.get("event_name") == "purchase" for e in events)
    has_cart = any(e.get("event_name") == "add_to_cart" for e in events)

    if churn_risk == "high":
        return "Send re-engagement campaign"

    if has_cart and not has_purchase:
        return "Offer discount to complete purchase"

    if not has_cart and score > 50:
        return "Trigger product recommendation flow"

    if score > 70:
        return "Upsell premium plan"

    return "Continue monitoring behavior"


# -----------------------------
# FALLBACK AGENTS
# -----------------------------
def fallback_agents(score: int, churn_risk: str):
    return [
        {
            "agent": "sales",
            "insight": "Revenue opportunity detected" if score > 50 else "Low purchase activity",
            "impact_score": min(score + 10, 100),
            "recommended_action": "Optimize pricing funnel",
            "severity": "high" if score < 40 else "medium"
        },
        {
            "agent": "customer_success",
            "insight": "Engagement stable" if churn_risk == "low"
            else "Churn risk increasing",
            "impact_score": min(score + 5, 100),
            "recommended_action": "Trigger engagement campaign",
            "severity": churn_risk
        },
        {
            "agent": "operations",
            "insight": "System stable" if score > 60 else "Operational friction detected",
            "impact_score": min(score, 100),
            "recommended_action": "Improve workflow efficiency",
            "severity": "medium"
        }
    ]


# -----------------------------
# LLM AGENT REASONING
# -----------------------------
def ai_agent_reasoning(agent_name: str, context: dict):
    prompt = f"""
You are an AI business intelligence agent.

Agent: {agent_name}

Context:
{json.dumps(context, indent=2)}

Return ONLY JSON:
{{
  "insight": "...",
  "impact_score": 0-100,
  "recommended_action": "...",
  "severity": "low|medium|high"
}}
"""

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a business intelligence engine."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.4
        )

        return response.choices[0].message.content

    except Exception:
        return None


# -----------------------------
# MAIN AGENT ENGINE
# -----------------------------
def run_all_agents(events: list = None, user_id: str = None):
    if events is None:
        events = []

    score = calculate_aios_score(events)
    churn_risk = calculate_churn_risk(score, len(events))

    context = {
        "user_id": user_id,
        "total_events": len(events),
        "aios_score": score,
        "churn_risk": churn_risk,
        "events": events
    }

    agents = ["sales", "customer_success", "operations"]
    results = []

    for agent in agents:
        ai_output = ai_agent_reasoning(agent, context)

        parsed = None
        if ai_output:
            try:
                parsed = json.loads(ai_output)
            except:
                parsed = None

        if parsed:
            results.append({
                "agent": agent,
                "insight": parsed.get("insight"),
                "impact_score": parsed.get("impact_score", 50),
                "recommended_action": parsed.get("recommended_action"),
                "severity": parsed.get("severity", "medium")
            })
        else:
            fallback = fallback_agents(score, churn_risk)
            results.append(next(f for f in fallback if f["agent"] == agent))

    return results


# -----------------------------
# USER INSIGHTS (PREDICTIVE OUTPUT)
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

    # -----------------------------
    # PREDICTIONS (5.4)
    # -----------------------------
    churn_probability = predict_churn_probability(score, len(events), churn_risk)
    revenue_potential = predict_revenue_potential(score, events)
    next_action = predict_next_best_action(score, churn_risk, events)

    return {
        "user_id": user_id,
        "total_events": len(events),
        "event_breakdown": breakdown,
        "last_event": last_event,

        # CORE
        "aios_score": score,
        "churn_risk": churn_risk,

        # PREDICTIVE LAYER
        "churn_probability": round(churn_probability, 2),
        "revenue_potential": round(revenue_potential, 2),
        "next_best_action": next_action,

        # AGENTS
        "agent_insights": run_all_agents(events, user_id)
    }
