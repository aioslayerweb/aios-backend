from fastapi import APIRouter
from backend.services.supabase_client import supabase
from backend.services.event_processor import process_event

router = APIRouter()


@router.post("/events")
def create_event(payload: dict):

    user_id = payload.get("user_id")
    event_name = payload.get("event_name")
    event_data = payload.get("event_data", {})
    user_email = payload.get("user_email")

    # store event
    supabase.table("events").insert({
        "user_id": user_id,
        "event_name": event_name,
        "event_data": event_data,
        "user_email": user_email
    }).execute()

    # fetch all user events
    response = supabase.table("events") \
        .select("*") \
        .eq("user_id", user_id) \
        .execute()

    events = response.data or []

    # REAL-TIME PROCESSING
    result = process_event(user_id, events, user_email)

    return {
        "status": "event_received",
        "aios": result
    }
