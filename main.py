import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

# IMPORTANT: do NOT initialize Supabase here
supabase = None

app = FastAPI()


# ----------------------------
# ENV VARIABLES
# ----------------------------
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")


# ----------------------------
# LAZY SUPABASE INIT (SAFE)
# ----------------------------
def get_supabase():
    global supabase

    if supabase is not None:
        return supabase

    if not SUPABASE_URL or not SUPABASE_KEY:
        return None

    try:
        from supabase import create_client
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
        return supabase
    except Exception as e:
        print("Supabase init failed:", e)
        return None


# ----------------------------
# REQUEST MODEL
# ----------------------------
class InsightRequest(BaseModel):
    user_id: str
    insight_type: str = "behavior"
    data: dict = {}


# ----------------------------
# HEALTH CHECK
# ----------------------------
@app.get("/")
def root():
    return {"message": "AIOS backend is running"}


# ----------------------------
# MAIN ENDPOINT
# ----------------------------
@app.post("/generate-insight")
def generate_insight(req: InsightRequest):
    supabase_client = get_supabase()

    # If Supabase is broken, still return something (DON'T crash server)
    if supabase_client is None:
        return {
            "status": "ok",
            "warning": "Supabase not available",
            "insight_type": req.insight_type,
            "insight_text": "Fallback insight generated (Supabase unavailable).",
        }

    try:
        # Example DB insert (adjust table name if needed)
        response = supabase_client.table("insights").insert({
            "user_id": req.user_id,
            "insight_type": req.insight_type,
            "data": req.data,
        }).execute()

        return {
            "status": "ok",
            "data": response.data
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
