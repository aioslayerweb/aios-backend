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
# REQUEST MODEL (UPDATED)
# ----------------------------
class Event(BaseModel):
    user_id: str
    event_name: str
    event_data: dict

# ----------------------------
# ROOT
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
    # 1. STORE EVENT IN SUPABASE
    # ----------------------------
    if supabase:
        try:
            result = supabase.table("events").insert({
                "user_id": event.user_id,
                "event_name": event.event_name,
                "event_data": event.event_data
            }).execute()

            print("Supabase insert success:", result)

        except Exception as e:
            print("Supabase insert error:", e)

    # ----------------------------
    # 2. BUILD AI PROMPT
    # ----------------------------
    prompt = f"""
You are an AI learning and business analyst.

User ID:
{event.user_id}

Event:
{event.event_name}

Data:
{event.event_data}

Generate:
1. A short title
2. A short insight description
3. One recommendation for improvement
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
    # 4. FALLBACK (ALWAYS WORKS)
    # ----------------------------
    return {
        "insight": f"[MOCK INSIGHT] User '{event.user_id}' performed '{event.event_name}' with data {event.event_data}. This indicates engagement and progress.",
        "mode": "mock"
    }
