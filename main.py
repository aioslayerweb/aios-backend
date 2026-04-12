from fastapi import FastAPI
from pydantic import BaseModel
from openai import OpenAI
from supabase import create_client
import os

app = FastAPI(title="AIOS Backend", version="0.1.0")

# ----------------------------
# ENV VARIABLES
# ----------------------------
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")

# ----------------------------
# CLIENTS (SAFE INIT)
# ----------------------------
client = OpenAI(api_key=OPENAI_API_KEY) if OPENAI_API_KEY else None

supabase = None
if SUPABASE_URL and SUPABASE_ANON_KEY:
    supabase = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

# ----------------------------
# REQUEST MODEL
# ----------------------------
class Event(BaseModel):
    event_name: str
    event_data: dict

# ----------------------------
# ROOT (IMPORTANT - makes /docs work properly)
# ----------------------------
@app.get("/")
def root():
    return {"message": "AIOS backend is running"}

# ----------------------------
# MAIN ENDPOINT
# ----------------------------
@app.post("/generate-insight")
def generate_insight(event: Event):

    # ----------------------------
    # 1. SAVE TO SUPABASE (IF AVAILABLE)
    # ----------------------------
    if supabase:
        try:
            supabase.table("events").insert({
                "event_name": event.event_name,
                "event_data": event.event_data
            }).execute()
        except Exception as e:
            print("Supabase insert error:", e)

    # ----------------------------
    # 2. BUILD PROMPT
    # ----------------------------
    prompt = f"""
You are an AI business analyst.

Event:
{event.event_name}

Data:
{event.event_data}

Generate:
1. A short title
2. A short insight description
"""

    # ----------------------------
    # 3. TRY OPENAI
    # ----------------------------
    if client:
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
            print("OpenAI error:", e)

    # ----------------------------
    # 4. FALLBACK MODE (ALWAYS WORKS)
    # ----------------------------
    return {
        "insight": f"[MOCK INSIGHT] Event '{event.event_name}' from {event.event_data} detected. This is a high-value user interaction.",
        "mode": "mock"
    }
