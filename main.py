import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase = None


# ----------------------------
# SAFE SUPABASE INIT (NO CRASH)
# ----------------------------
def get_supabase():
    global supabase

    if supabase is not None:
        return supabase

    if not SUPABASE_URL or not SUPABASE_KEY:
        print("Supabase env missing - running without DB")
        return None

    try:
        from supabase import create_client
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
        return supabase
    except Exception as e:
        print("Supabase init failed:", e)
        return None


# ----------------------------
# MODELS
# ----------------------------
class InsightRequest(BaseModel):
    user_id: str
    insight_type: str = "behavior"
    data: dict = {}


# ----------------------------
# HEALTH CHECK (RENDER CRITICAL)
# ----------------------------
@app.get("/")
def root():
    return {
        "status": "ok",
        "service": "aios-backend",
        "runtime": "stable"
    }


# ----------------------------
# INSIGHT ENDPOINT
# ----------------------------
@app.post("/generate-insight")
def generate_insight(req: InsightRequest):

    supabase_client = get_supabase()

    # SAFE MODE (never crash)
    if supabase_client is None:
        return {
            "status": "ok",
            "mode": "fallback",
            "insight_type": req.insight_type,
            "insight_text": "Fallback insight (DB unavailable)"
        }

    try:
        response = supabase_client.table("insights").insert({
            "user_id": req.user_id,
            "insight_type": req.insight_type,
            "data": req.data
        }).execute()

        return {
            "status": "ok",
            "data": response.data
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
