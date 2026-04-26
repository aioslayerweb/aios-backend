from fastapi import FastAPI
from pydantic import BaseModel
from typing import Dict, Any, Optional
import os
import requests

from services.supabase_client import supabase

app = FastAPI()

# -----------------------------
# ROOT
# -----------------------------
@app.get("/")
def root():
    return {"message": "AIOS backend is running"}

# -----------------------------
# EVENT MODEL
# -----------------------------
class Event(BaseModel):
    event_name: str
    event_data: Dict[str, Any]
    user_id: Optional[str] = None

# -----------------------------
# EVENTS
# -----------------------------
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

# -----------------------------
# MISTRAL CONFIG
# -----------------------------
MISTRAL_API_KEY = os.getenv("MISTRAL_API_KEY")

def get_ai_insight(event_breakdown: dict):

    # 🔴 HARD CHECK (prevents fake outputs)
    if not MISTRAL_API_KEY:
        return "AI error: missing API key"

    prompt = f"""
Analyze this user behavior:

{event_breakdown}

Return 1–2 sentences only.
"""

    try:
        response = requests.post(
            "https://api.mistral.ai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {MISTRAL_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "model": "mistral-small-latest",
                "messages": [
                    {"role": "user", "content": prompt}
                ],
                "temperature": 0.5
            },
            timeout=20
        )

        data = response.json()

        # 🔴 STRICT ERROR HANDLING
        if response.status_code != 200:
            return f"AI error: {data}"

        # OpenAI-style
        if "choices" in data:
            return data["choices"][0]["message"]["content"]

        # Mistral-style
        if "outputs" in data:
            return data["outputs"][0].get("text", "AI error: invalid output")

        return f"AI error: unexpected format {data}"

    except Exception as e:
        return f"AI error: {str(e)}"


# -----------------------------
# INSIGHTS
# -----------------------------
@app.get("/insights/{user_id}")
def get_insights(user_id: str):

    try:
        response = supabase.table("events").select("*").eq("user_id", user_id).execute()
        data = response.data

        event_breakdown = {}

        for event in data:
            name = event.get("event_name")
            event_breakdown[name] = event_breakdown.get(name, 0) + 1

        ai_insight = get_ai_insight(event_breakdown)

        return {
            "status": "success",
            "user_id": user_id,
            "total_events": len(data),
            "event_breakdown": event_breakdown,
            "ai_insight": ai_insight
        }

    except Exception as e:
        return {"status": "error", "message": str(e)}
