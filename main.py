from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from supabase import create_client
import os
from datetime import datetime
from openai import OpenAI

app = FastAPI()

# =========================
# CONFIG
# =========================
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# Supabase
if SUPABASE_URL and SUPABASE_KEY:
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
else:
    supabase = None

# OpenAI
if OPENAI_API_KEY:
    client = OpenAI(api_key=OPENAI_API_KEY)
else:
    client = None


# =========================
# MODELS
# =========================

class InsightRequest(BaseModel):
    user_id: str
    insight_type: str = "behavior"
    data: dict | None = None


class InsightResponse(BaseModel):
    success: bool
    score: int | None = None
    user_segment: str | None = None
    insight_text: str | None = None
    message: str | None = None


# =========================
# HEALTH
# =========================

@app.get("/")
def root():
    return {"message": "AIOS backend v4 running"}

@app.get("/health")
def health():
    return {"status": "ok"}


# =========================
# TRACK EVENT
# =========================

@app.post("/track-event")
def track_event(request: InsightRequest):
    try:
        if not supabase:
            raise HTTPException(status_code=500, detail="Supabase not configured")

        supabase.table("events").insert({
            "user_id": request.user_id,
            "event_name": request.insight_type,
            "event_data": request.data or {}
        }).execute()

        return {"success": True, "message": "event stored"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =========================
# V3 SCORING ENGINE
# =========================

def calculate_base_score(events):
    return min(len(events) * 10, 60)


def calculate_recency_score(events):
    if not events:
        return 0

    now = datetime.utcnow()
    score = 0

    for e in events:
        created_at = e.get("created_at")
        if not created_at:
            continue

        try:
            event_time = datetime.fromisoformat(created_at.replace("Z", ""))
            diff_hours = (now - event_time).total_seconds() / 3600

            if diff_hours < 24:
                score += 20
            elif diff_hours < 72:
                score += 10
            else:
                score += 2
        except:
            continue

    return min(score, 40)


def detect_burst(events):
    return 10 if len(events) >= 5 else 0


def classify_user(score):
    if score >= 80:
        return "🔥 Power User"
    elif score >= 50:
        return "🟢 Active User"
    elif score >= 20:
        return "🟡 Casual User"
    return "⚫ Dormant User"


# =========================
# AI INSIGHT (OPENAI)
# =========================

def generate_ai_insight(events, score, segment):
    if not client:
        return "AI not configured."

    try:
        # Prepare summary of events
        event_summary = []
        for e in events[-10:]:  # last 10 events
            event_summary.append(f"{e.get('event_name')} -> {e.get('event_data')}")

        prompt = f"""
You are an AI behavioral analyst.

User segment: {segment}
Score: {score}

Recent user activity:
{event_summary}

Generate a concise insight explaining:
- user behavior
- engagement level
- possible pattern

Keep it short and clear.
"""

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You analyze user behavior."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=120
        )

        return response.choices[0].message.content.strip()

    except Exception as e:
        return f"AI insight error: {str(e)}"


# =========================
# GENERATE INSIGHT v4
# =========================

@app.post("/generate-insight", response_model=InsightResponse)
def generate_insight(request: InsightRequest):

    try:
        if not supabase:
            raise HTTPException(status_code=500, detail="Supabase not configured")

        res = supabase.table("events") \
            .select("*") \
            .eq("user_id", request.user_id) \
            .execute()

        events = res.data or []

        base = calculate_base_score(events)
        recency = calculate_recency_score(events)
        burst = detect_burst(events)

        total_score = min(base + recency + burst, 100)
        segment = classify_user(total_score)

        # 🔥 AI-generated insight
        insight_text = generate_ai_insight(events, total_score, segment)

        # Save insight
        supabase.table("insights").insert({
            "user_id": request.user_id,
            "insight_type": request.insight_type,
            "insight_text": insight_text
        }).execute()

        return InsightResponse(
            success=True,
            score=total_score,
            user_segment=segment,
            insight_text=insight_text
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =========================
# STARTUP
# =========================

@app.on_event("startup")
def startup_event():
    print("AIOS backend v4 started successfully")
