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

        # 🔥 GROQ AI CALL (UPDATED MODEL)
        try:
            prompt = f"""
            Analyze this user behavior:
            Total events: {total_events}
            Breakdown: {breakdown}

            Give a short insight about the user.
            """

            ai_response = requests.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {GROQ_API_KEY}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "llama3-8b-8192",
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
            "total_events": total_events,
            "event_breakdown": breakdown,
            "ai_insight": ai_text
        }

    except Exception as e:
        return {"status": "error", "message": str(e)}
