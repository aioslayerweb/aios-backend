from fastapi import FastAPI
from pydantic import BaseModel
from openai import OpenAI
from supabase import create_client
import os

app = FastAPI()

# ----------------------------
# OpenAI (still kept for later)
# ----------------------------
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# ----------------------------
# Supabase setup
# ----------------------------
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_ANON_KEY")

supabase = create_client(supabase_url, supabase_key)

# ----------------------------
# Request model
# ----------------------------
class Event(BaseModel):
    event_name: str
    event_data: dict

# ----------------------------
# Root
# ----------------------------
@app.get("/")
def root():
    return {"message": "AIOS backend is running"}

# ----------------------------
# Main AI endpoint
# ----------------------------
@app.post("/generate-insight")
def generate_insight(event: Event):

    # ----------------------------
    # 1. Save event to Supabase
    # ----------------------------
    try:
        supabase.table("events").insert({
            "event_name": event.event_name,
            "event_data": event.event_data
        }).execute()
    except Exception as db_error:
        # Do NOT break API if DB fails
        print("Supabase error:", db_error)

    # ----------------------------
    # 2. Build AI prompt
    # ----------------------------
    prompt = f"""
You are an AI business analyst.

Event:
{event.event_name}

Data:
{event.event_data}

Generate:
1. A short title
2. A short description
"""

    # ----------------------------
    # 3. Try OpenAI (fallback if no billing)
    # ----------------------------
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "user", "content": prompt}
            ]
        )

        return {
            "insight": response.choices[0].message.content,
            "mode": "ai"
        }

    except Exception as e:
        return {
            "insight": f"[MOCK INSIGHT] Event '{event.event_name}' from {event.event_data} detected. This is a high-value user interaction.",
            "mode": "mock",
            "error": str(e)
        }
