from fastapi import APIRouter
from pydantic import BaseModel
from backend.services.supabase_client import supabase

router = APIRouter(prefix="/api")

class Event(BaseModel):
    organization_id: str
    event_type: str
    payload: dict

@router.post("/events")
def create_event(event: Event):
    data = {
        "organization_id": event.organization_id,
        "event_type": event.event_type,
        "payload": event.payload
    }

    response = supabase.table("insights_events").insert(data).execute()

    return {
        "status": "success",
        "inserted": response.data
    }
