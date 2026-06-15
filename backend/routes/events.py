from fastapi import APIRouter
from pydantic import BaseModel
from backend.services.supabase_client import supabase
from backend.services.ai_worker import run_ai_async
from backend.services.business_memory import build_memory

router = APIRouter()


class Event(BaseModel):
    user_id: str
    user_email: str
    event_name: str


@router.post("/events")
def create_event(event: Event):

    data = {
        "user_id": event.user_id,
        "event_name": event.event_name,
        "user_email": event.user_email,
        "event_data": {}
    }

    # store event
    result = supabase.table("events").insert(data).execute()

    # build memory (NEW)
    memory = build_memory(data)

    # async AI processing stays
    run_ai_async(data)

    return {
        "status": "event_saved",
        "inserted": result.data,
        "memory": memory,
        "ai": "processing_async"
    }