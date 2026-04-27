from fastapi import FastAPI
from supabase_client import supabase
import os
import requests

app = FastAPI()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")


@app.get("/")
def root():
    return {"message": "AIOS backend is running"}


@app.get("/events")
def get_events():
    response = supabase.table("events").select("*").execute()
    return {"status": "success", "data": response.data}


@app.get("/insights/{user_id}")
def get_insights(user_id: str):
    try:
        response = supabase.table("events").select("*").eq("user_id", user_id).execute()
        events = response.data

        if not events:
            return {"status": "success", "message": "No events found"}

        total_events = len(events)

        # 📊 Event breakdown
        breakdown = {}
        for e in events:
            name = e["event_name"]
            breakdown[name] = breakdown.get(name, 0) + 1

        # 🧠 ENGAGEMENT SCORE (0–100)
        score = min(total_events * 5, 100)

        # 👤 USER TYPE
        if score >= 80:
            user_type = "power_user"
        elif score >= 50:
            user_type = "active_user"
        elif score >= 20:
            user_type = "casual_user"
        else:
            user_type = "inactive_user"

        # ⚠️ FLAGS
        flags = []

        login_ratio = breakdown.get("login", 0) / total_events

        if login_ratio > 0.7:
            flags.append("login_heavy")

        if len(breakdown) <= 2:
            flags.append("low_feature_usage")

        # 💰 REVENUE SIGNAL
        if user_type == "power_user" and "view_pricing" in breakdown:
            revenue_signal = "high"
        elif user_type == "active_user":
            revenue_signal = "medium"
        else:
            revenue_signal = "low"

        # 📉 CHURN RISK
        if score < 30:
            churn_risk = "high"
        elif score < 70:
            churn_risk = "medium"
        else:
            churn_risk = "low"

        # 🎯 NEXT BEST ACTION (RULE-BASED)
        if "low_feature_usage" in flags:
            next_action = "trigger onboarding for unused features"
        elif churn_risk == "high":
            next_action = "send re-engagement campaign"
        elif revenue_signal == "high":
            next_action = "offer premium upgrade prompt"
        else:
            next_action = "continue monitoring behavior"

        # 🤖 AI INSIGHT (GROQ)
        try:
            prompt = f"""
You are a product intelligence AI.

Analyze this user:

- Total events: {total_events}
- Breakdown: {breakdown}
- Score: {score}
- User type: {user_type}
- Revenue signal: {revenue_signal}
- Churn risk: {churn_risk}
- Flags: {flags}

Return:
1. Short behavioral insight
2. One business recommendation
"""

            ai_response = requests.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {GROQ_API_KEY}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "llama-3.1-8b-instant",
                    "messages": [
                        {"role": "user", "content": prompt}
                    ]
                }
            )

            result = ai_response.json()

            if "choices" in result:
                ai_text = result["choices"][0]["message"]["content"]
            else:
                ai_text = f"AI error: {result}"

        except Exception as e:
            ai_text = f"AI error: {str(e)}"

        return {
            "status": "success",
            "user_id": user_id,
            "engagement_score": score,
            "user_type": user_type,
            "flags": flags,
            "revenue_signal": revenue_signal,
            "churn_risk": churn_risk,
            "next_best_action": next_action,
            "total_events": total_events,
            "event_breakdown": breakdown,
            "ai_insight": ai_text
        }

    except Exception as e:
        return {"status": "error", "message": str(e)}
