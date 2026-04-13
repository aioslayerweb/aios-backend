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
    insight_text: str | None = None
    score: int | None = None
    message: str | None = None


# =========================
# HEALTH
# =========================

@app.get("/")
def root():
    return {"message": "AIOS backend v2 running"}

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
# INTELLIGENCE ENGINE (CORE)
# =========================

def calculate_score(events: list) -> int:
    """
    AIOS v2 scoring logic
    """

    count = len(events)

    if count == 0:
        return 0

    # base score from activity volume
    score = min(count * 10, 60)

    # bonus for diversity of event types
    event_types = set(e.get("event_name") for e in events)
    score += len(event_types) * 5

    # cap at 100
    return min(score, 100)


def generate_insight_text(score: int, count: int) -> str:

    if count == 0:
        return "No activity detected for this user."

    if score < 30:
        return "Low engagement user with minimal interaction patterns."

    if score < 70:
        return "Moderate engagement user with consistent activity."

    return "High engagement power user with strong behavioral signals."


# =========================
# GENERATE INSIGHT (V2)
# =========================

@app.post("/generate-insight", response_model=InsightResponse)
def generate_insight(request: InsightRequest):

    try:
        if not supabase:
            raise HTTPException(status_code=500, detail="Supabase not configured")

        # Fetch user events
        res = supabase.table("events") \
            .select("*") \
            .eq("user_id", request.user_id) \
            .execute()

        events = res.data or []

        # AIOS v2 intelligence
        score = calculate_score(events)
        insight_text = generate_insight_text(score, len(events))

        # Save insight
        supabase.table("insights").insert({
            "user_id": request.user_id,
            "insight_type": request.insight_type,
            "insight_text": insight_text
        }).execute()

        return InsightResponse(
            success=True,
            insight_text=insight_text,
            score=score
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =========================
# STARTUP
# =========================

@app.on_event("startup")
def startup_event():
    print("AIOS backend v2 started successfully")
