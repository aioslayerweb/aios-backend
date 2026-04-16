import os
import json
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
# SCORE ENGINE
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

        decay = 0.85 ** (hours / 24)
        score += weight * decay

    return min(int(score * 10), 100)


# -----------------------------
# CHURN RISK
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
# 🧠 REAL AI AGENT (OPENAI)
# -----------------------------
def generate_ai_agent_insight(agent_name: str, events: list, score: int):
    """
    THIS is the REAL AIOS intelligence layer.
    """

    event_summary = json.dumps(events[:20], default=str)

    prompt = f"""
You are an AI business intelligence agent.

Agent role: {agent_name}

User behavior data:
{event_summary}

AIOS score: {score}

Return ONLY valid JSON:
{{
  "agent": "{agent_name}",
  "insight": "...",
  "impact_score": number (0-100),
  "recommended_action": "...",
  "severity": "low | medium | high"
}}
"""

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a precise analytics engine."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.4
        )

        content = response.choices[0].message.content
        return json.loads(content)

    except Exception as e:
        # fallback safe mode
        return {
            "agent": agent_name,
            "insight": "AI generation failed, fallback activated",
            "impact_score": 50,
            "recommended_action": "review system logs",
            "severity": "medium",
            "error": str(e)
        }


# -----------------------------
# PREDICTIVE LAYER
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
# AUTONOMOUS ACTIONS (SAFE SIMULATION)
# -----------------------------
def execute_action(action: str, user_id: str, score: int):
    payload = {
        "user_id": user_id,
        "action": action,
        "score": score,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

    return {
        "status": f"{action}_triggered",
        "payload": payload
    }


# -----------------------------
# MAIN ENGINE
# -----------------------------
def build_user_insights(user_id: str, events: list):
    score = calculate_aios_score(events)
    churn_risk = calculate_churn_risk(score, len(events))

    churn_probability = predict_churn_probability(score, len(events), churn_risk)
    next_action = predict_next_best_action(score, churn_risk, events)

    # -----------------------------
    # REAL AI AGENTS (NEW)
    # -----------------------------
    agents = ["sales", "customer_success", "operations"]

    agent_insights = [
        generate_ai_agent_insight(agent, events, score)
        for agent in agents
    ]

    action_result = execute_action(next_action, user_id, score)

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

        # 🧠 REAL AI AGENTS OUTPUT
        "agent_insights": agent_insights,

        # autonomous layer
        "action_result": action_result
    }
