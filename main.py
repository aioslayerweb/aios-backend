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

        breakdown = {}
        for e in events:
            name = e["event_name"]
            breakdown[name] = breakdown.get(name, 0) + 1

        # 🧠 RULE-BASED SCORING
        score = min(total_events * 5, 100)

        # 👤 USER TYPE CLASSIFICATION
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

        if "login" in breakdown and breakdown["login"] > (total_events * 0.7):
            flags.append("login_heavy")

        if len(breakdown) <= 2:
            flags.append("low_feature_usage")

        # 🔥 GROQ AI CALL
        try:
            prompt = f"""
            Analyze this user:

            Total events: {total_events}
            Breakdown: {breakdown}
            User type: {user_type}
            Flags: {flags}

            Give:
            1. A short insight
            2. One actionable recommendation
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
            "total_events": total_events,
            "event_breakdown": breakdown,
            "ai_insight": ai_text
        }

    except Exception as e:
        return {"status": "error", "message": str(e)}
