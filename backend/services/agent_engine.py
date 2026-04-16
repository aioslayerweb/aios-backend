import os
import json
from datetime import datetime, timezone
from openai import OpenAI

# -----------------------------
# INIT OPENAI CLIENT
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
    elif score >= 40:
        return "medium"
    return "high"


# -----------------------------
# AI AGENT REASONING (LLM)
# -----------------------------
def ai_agent_reasoning(agent_name: str, context: dict):
    prompt = f"""
You are an AI business intelligence agent inside AIOS.

Agent role: {agent_name}

User context:
{json.dumps(context, indent=2)}

Return ONLY valid JSON:
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
                {
                    "role": "system",
                    "content": "You are a precise business intelligence engine."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.4
        )

        return response.choices[0].message.content

    except Exception:
        return None


# -----------------------------
# FALLBACK AGENTS (NON-AI)
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
            except Exception:
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
# USER INSIGHTS BUILDER
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
        "agent_insights": run_all_agents(events, user_id)
    }
