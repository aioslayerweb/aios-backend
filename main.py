from fastapi import FastAPI
from pydantic import BaseModel
from supabase import create_client
from openai import OpenAI
import os

app = FastAPI(title="AIOS Backend", version="0.1.0")

# =========================
# ENV VARIABLES
# =========================
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# =========================
# DEBUG STARTUP LOGS
# =========================
print("=== AIOS STARTUP ===")
print("SUPABASE_URL:", SUPABASE_URL)
print("SUPABASE_ANON_KEY exists:", bool(SUPABASE_ANON_KEY))
print("OPENAI_API_KEY exists:", bool(OPENAI_API_KEY))

# =========================
# CLIENT INIT
# =========================
client = OpenAI(api_key=OPENAI_API_KEY) if OPENAI_API_KEY else None

supabase = None
if SUPABASE_URL and SUPABASE_ANON_KEY:
    try:
        supabase = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)
        print("✅ Supabase client initialized")
    except Exception as e:
        print("❌ Supabase init error:", e)
else:
    print("❌ Supabase not initialized (missing env vars)")


# =========================
# DATA MODEL
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
    return {"message": "AIOS backend is running"}


# =========================
# DEBUG ENDPOINT
# =========================
@app.get("/debug-env")
def debug_env():
    return {
        "SUPABASE_URL": SUPABASE_URL,
        "SUPABASE_ANON_KEY": bool(SUPABASE_ANON_KEY),
        "OPENAI_API_KEY": bool(OPENAI_API_KEY),
        "SUPABASE_CLIENT": supabase is not None
    }


# =========================
# MAIN ENDPOINT
# =========================
@app.post("/generate-insight")
def generate_insight(event: Event):

    # -------------------------
    # DEBUG LOGS
    # -------------------------
    print("🚀 ENTERED generate_insight endpoint")
    print("EVENT RECEIVED:", event)
    print("SUPABASE CLIENT:", supabase)

    # -------------------------
    # SUPABASE INSERT (FIXED)
    # -------------------------
    if supabase:
        try:
            print("➡️ Inserting into Supabase...")

            result = supabase.table("events").insert({
                "user_id": None,  # 👈 FIX: avoid UUID conflict
                "event_name": event.event_name,
                "event_data": event.event_data
            }).execute()

            print("✅ Supabase insert success")
            print("RESULT:", result)

        except Exception as e:
            print("❌ Supabase insert error:", str(e))
    else:
        print("❌ Supabase client is None (skipping insert)")

    # -------------------------
    # AI RESPONSE (optional)
    # -------------------------
    prompt = f"""
User ID: {event.user_id}
Event: {event.event_name}
Data: {event.event_data}

Generate a short insight.
"""

    if client:
        try:
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}]
            )

            return {
                "insight": response.choices[0].message.content,
                "mode": "ai"
            }

        except Exception as e:
            print("OpenAI error:", e)

    # -------------------------
    # FALLBACK RESPONSE
    # -------------------------
    return {
        "insight": f"[MOCK INSIGHT] User {event.user_id} did {event.event_name}",
        "mode": "mock"
    }
