from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from supabase import create_client
import os
from datetime import datetime

app = FastAPI()

# =========================
# SUPABASE SETUP
# =========================
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if SUPABASE_URL and SUPABASE_KEY:
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
else:
    supabase = None


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
    return {"message": "AIOS backend v3 running"}

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
# INTELLIGENCE ENGINE v3
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
    if len(events) >= 5:
        return 10
    return 0


def classify_user(score):
    if score >= 80:
        return "🔥 Power User"
    elif score >= 50:
        return "🟢 Active User"
    elif score >= 20:
        return "🟡 Casual User"
    return "⚫ Dormant User"


def generate_insight_text(segment, score, count):
    if count == 0:
        return "No user activity detected."

    if segment == "🔥 Power User":
        return "Highly engaged user with strong consistent activity patterns."

    if segment == "🟢 Active User":
        return "Active user with regular engagement and healthy interaction levels."

    if segment == "🟡 Casual User":
        return "Occasional user with moderate engagement patterns."

    return "Low activity user with minimal interaction signals."


# =========================
# GENERATE INSIGHT v3
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

        insight_text = generate_insight_text(segment, total_score, len(events))

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
    print("AIOS backend v3 started successfully")
