from fastapi import APIRouter
from backend.services.supabase_client import supabase
from backend.services.ai_worker import run_ai_async

router = APIRouter()


@router.post("/events")
def create_event(payload: dict):

    try:
        user_id = payload.get("user_id")
        event_name = payload.get("event_name")
        event_data = payload.get("event_data", {})
        user_email = payload.get("user_email")

        if not user_id or not event_name:
            return {
                "status": "error",
                "message": "missing user_id or event_name"
            }

        # 1. Store event
        db_response = supabase.table("events").insert({
            "user_id": user_id,
            "event_name": event_name,
            "event_data": event_data
        }).execute()

        # 2. FIRE AND FORGET AI (NO WAIT)
        run_ai_async(user_id, user_email)

        # 3. instant response
        return {
            "status": "event_saved",
            "inserted": db_response.data,
            "ai": "processing_async"
        }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }
