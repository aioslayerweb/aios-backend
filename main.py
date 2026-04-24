from fastapi import FastAPI
from pydantic import BaseModel
from typing import Dict, Any
from services.supabase_client import supabase

app = FastAPI()

# --------------------
# ROOT TEST
# --------------------
@app.get("/")
def root():
    return {"message": "AIOS backend is running"}

# --------------------
# TEST DB READ
# --------------------
@app.get("/test-db")
def test_db():
    try:
        response = supabase.table("events").select("*").execute()
        return {
            "status": "success",
            "data": response.data
        }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }

# --------------------
# EVENT MODEL (IMPORTANT FIX)
# --------------------
class Event(BaseModel):
    event_name: str
    event_data: Dict[str, Any]
    user_id: str | None = None

# --------------------
# CREATE EVENT (WRITE)
# --------------------
@app.post("/events")
def create_event(event: Event):
    try:
        response = supabase.table("events").insert(event.dict()).execute()
        return {
            "status": "success",
            "data": response.data
        }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }
