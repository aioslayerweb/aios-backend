from fastapi import APIRouter
from pydantic import BaseModel
from backend.services.supabase_client import supabase
from backend.services.ai_worker import run_ai_async

router = APIRouter()


class Event(BaseModel):
    user_id: str
    user_email: str
    event_name: str


@router.post("/events")
def create_event(event: Event):
    """
    Create event and trigger AI processing
    """

    # ✅ FIX: include user_email in insert
    data = {
        "user_id": event.user_id,
        "event_name": event.event_name,
        "user_email": event.user_email,
        "event_data": {}
    }

    result = supabase.table("events").insert(data).execute()

    # trigger async AI
    run_ai_async(data)

    return {
        "status": "event_saved",
        "inserted": result.data,
        "ai": "processing_async"
    }
