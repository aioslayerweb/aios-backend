from fastapi import FastAPI
from pydantic import BaseModel
from supabase import create_client
from openai import OpenAI
import os

app = FastAPI(title="AIOS Backend", version="0.2.0")

# =========================
# ENV
# =========================
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

client = OpenAI(api_key=OPENAI_API_KEY) if OPENAI_API_KEY else None

supabase = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)


# =========================
# MODEL
# =========================
class Event(BaseModel):
    user_id: str
    event_name: str
    event_data: dict


# =========================
# ROOT
# =========================
@app.get("/")
def root():
    return {"message": "AIOS backend running"}


# =========================
# MAIN ENDPOINT
# =========================
@app.post("/generate-insight")
def generate_insight(event: Event):

    print("🚀 NEW EVENT:", event)

    # -------------------------
    # 1. STORE EVENT
    # -------------------------
    try:
        supabase.table("events").insert({
            "user_id": None,
            "event_name": event.event_name,
            "event_data": event.event_data
        }).execute()

        print("✅ Event stored")

    except Exception as e:
        print("❌ Insert error:", e)

    # -------------------------
    # 2. FETCH HISTORY
    # -------------------------
    try:
        history = supabase.table("events") \
            .select("*") \
            .order("created_at", desc=True) \
            .limit(10) \
            .execute()

        events_history = history.data
        print("📊 History fetched:", events_history)

    except Exception as e:
        print("❌ Fetch error:", e)
        events_history = []

    # -------------------------
    # 3. BUILD AI INPUT
    # -------------------------
    history_text = "\n".join([
        f"{e['event_name']} → {e['event_data']}"
        for e in events_history
    ])

    prompt = f"""
You are an AI product analyst.

User recent activity:
{history_text}

Latest event:
{event.event_name} → {event.event_data}

Give 1 short insight about user behavior.
"""

    # -------------------------
    # 4. GENERATE AI INSIGHT
    # -------------------------
    insight_text = None

    if client:
        try:
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}]
            )

            insight_text = response.choices[0].message.content
            print("🤖 AI insight:", insight_text)

        except Exception as e:
            print("❌ OpenAI error:", e)

    # fallback
    if not insight_text:
        insight_text = f"[MOCK] Based on recent activity, user triggered {event.event_name}"

    # -------------------------
    # 5. STORE INSIGHT
    # -------------------------
    try:
        supabase.table("insights").insert({
            "user_id": None,
            "insight_text": insight_text
        }).execute()

        print("✅ Insight stored")

    except Exception as e:
        print("❌ Insight insert error:", e)

    # -------------------------
    # RESPONSE
    # -------------------------
    return {
        "insight": insight_text,
        "mode": "ai" if client else "mock"
    }
