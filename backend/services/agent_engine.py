import json
from datetime import datetime, timezone
from openai import OpenAI
import os

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
# AI AGENT (REAL LLM)
# -----------------------------
def generate_ai_agent_insight(agent_name: str, events: list, score: int):
    prompt = f"""
You are an AI business intelligence agent.

Agent: {agent_name}

User events:
{json.dumps(events[:20], default=str)}

AIOS score: {score}

Return ONLY valid JSON:
{{
  "agent": "{agent_name}",
  "insight": "...",
  "impact_score": 0-100,
  "recommended_action": "...",
  "severity": "low|medium|high"
}}
"""

    try:
        res = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a strict JSON generator."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.4
        )

        return json.loads(res.choices[0].message.content)

    except Exception as e:
        return {
            "agent": agent_name,
            "insight": "AI offline (fallback mode)",
            "impact_score": 50,
            "recommended_action": "monitor system",
            "severity": "medium",
            "mode": "fallback",
            "error": str(e)
        }


# -----------------------------
# MAIN FUNCTION (THIS FIXES YOUR IMPORT ERROR)
# -----------------------------
def build_user_insights(user_id: str, events: list):

    score = calculate_aios_score(events)
    churn_risk = calculate_churn_risk(score, len(events))

    agents = ["sales", "customer_success", "operations"]

    agent_insights = [
        generate_ai_agent_insight(agent, events, score)
        for agent in agents
    ]

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
        "agent_insights": agent_insights
    }
