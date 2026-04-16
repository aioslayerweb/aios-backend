def generate_ai_agent_insight(agent_name: str, events: list, score: int):
    """
    REAL AI agent with safe fallback mode
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
        # ✅ SAFE FALLBACK (THIS IS THE PATCH)
        return {
            "agent": agent_name,
            "insight": "AI offline (fallback mode active)",
            "impact_score": 50,
            "recommended_action": "monitor system health",
            "severity": "medium",
            "mode": "fallback",
            "error": str(e)
        }
