from fastapi import APIRouter
from pydantic import BaseModel
from backend.services.supabase_client import supabase

router = APIRouter(prefix="/api")

class Event(BaseModel):
    user_id: str
    event_name: str
    event_data: dict

@router.post("/events")
def create_event(event: Event):
    if supabase is None:
        return {"error": "Supabase not configured"}

    data = {
        "user_id": event.user_id,
        "event_name": event.event_name,
        "event_data": event.event_data
    }

    response = supabase.table("events").insert(data).execute()

    return {
        "status": "stored",
        "inserted": response.data
    }
