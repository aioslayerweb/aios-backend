from fastapi import FastAPI
from pydantic import BaseModel
from typing import Dict, Any, Optional
from services.supabase_client import supabase

app = FastAPI()

# --------------------
# ROOT
# --------------------
@app.get("/")
def root():
    return {"message": "AIOS backend is running"}

# --------------------
# EVENT MODEL
# --------------------
class Event(BaseModel):
    event_name: str
    event_data: Dict[str, Any]
    user_id: Optional[str] = None

# --------------------
# CREATE EVENT (REAL)
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

# --------------------
# GET EVENTS
# --------------------
@app.get("/events")
def get_events():
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
