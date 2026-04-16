from fastapi import APIRouter
from backend.services.supabase_client import supabase
from backend.services.intelligence import update_user_insights

router = APIRouter()


@router.post("/events")
def create_event(payload: dict):
    # 1. store raw event
    response = supabase.table("events").insert(payload).execute()

    # 2. run AIOS intelligence layer
    update_user_insights(
        user_id=payload.get("user_id"),
        event_name=payload.get("event_name"),
        event_data=payload.get("event_data", {})
    )

    return {
        "status": "event received",
        "data": response.data
    }
