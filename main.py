from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from supabase import create_client
import os

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
    message: str | None = None


# =========================
# HEALTH CHECK
# =========================

@app.get("/")
def root():
    return {"message": "AIOS backend is running"}


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
            "event_type": request.insight_type,
            "event_data": request.data or {}
        }).execute()

        return {
            "success": True,
            "message": "event stored"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =========================
# GENERATE INSIGHT
# =========================

@app.post("/generate-insight", response_model=InsightResponse)
def generate_insight(request: InsightRequest):

    try:
        if not supabase:
            raise HTTPException(status_code=500, detail="Supabase not configured")

        # Fetch events for user
        res = supabase.table("events") \
            .select("*") \
            .eq("user_id", request.user_id) \
            .execute()

        events = res.data or []

        event_count = len(events)

        # Simple intelligence logic (upgrade later to AI)
        if event_count == 0:
            insight_text = "No user activity detected yet."
        elif event_count < 3:
            insight_text = f"Low activity user with {event_count} events."
        else:
            insight_text = f"High activity user with {event_count} events."

        # Store insight
        supabase.table("insights").insert({
            "user_id": request.user_id,
            "insight_type": request.insight_type,
            "insight_text": insight_text
        }).execute()

        return InsightResponse(
            success=True,
            insight_text=insight_text
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =========================
# STARTUP LOG
# =========================

@app.on_event("startup")
def startup_event():
    print("AIOS backend started successfully")
