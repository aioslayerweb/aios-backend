from fastapi import FastAPI
from pydantic import BaseModel
from typing import Dict, Any, Optional
from services.supabase_client import supabase
import requests
import os

app = FastAPI()

MISTRAL_API_KEY = os.getenv("MISTRAL_API_KEY")

@app.get("/")
def root():
    return {"message": "AIOS backend is running"}

class Event(BaseModel):
    event_name: str
    event_data: Dict[str, Any]
    user_id: Optional[str] = None

@app.post("/events")
def create_event(event: Event):
    try:
        response = supabase.table("events").insert(event.dict()).execute()
        return {"status": "success", "data": response.data}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.get("/events")
def get_events():
    try:
        response = supabase.table("events").select("*").execute()
        return {"status": "success", "data": response.data}
    except Exception as e:
        return {"status": "error", "message": str(e)}

# 🔥 AI FUNCTION
def generate_ai_insight(events):
    try:
        headers = {
            "Authorization": f"Bearer {MISTRAL_API_KEY}",
            "Content-Type": "application/json"
        }

        summary = {}
        for e in events:
            name = e["event_name"]
            summary[name] = summary.get(name, 0) + 1

        prompt = f"""
        Analyze this user behavior data and give a short insight:

        {summary}

        Focus on engagement level and user intent.
        """

        response = requests.post(
            "https://api.mistral.ai/v1/chat/completions",
            headers=headers,
            json={
                "model": "mistral-small",
                "messages": [{"role": "user", "content": prompt}]
            }
        )

        result = response.json()
        return result["choices"][0]["message"]["content"]

    except Exception as e:
        return f"AI error: {str(e)}"

# 🔥 AI INSIGHTS ENDPOINT
@app.get("/insights/{user_id}")
def get_insights(user_id: str):
    try:
        response = supabase.table("events").select("*").eq("user_id", user_id).execute()
        events = response.data

        if not events:
            return {
                "status": "success",
                "message": "No data for this user"
            }

        event_counts = {}
        for event in events:
            name = event["event_name"]
            event_counts[name] = event_counts.get(name, 0) + 1

        ai_insight = generate_ai_insight(events)

        return {
            "status": "success",
            "user_id": user_id,
            "event_breakdown": event_counts,
            "ai_insight": ai_insight
        }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }
