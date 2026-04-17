from fastapi import APIRouter
from backend.services.supabase_client import supabase

router = APIRouter()


@router.post("/events")
def create_event(payload: dict):

    try:
        # -----------------------------
        # 1. Extract payload safely
        # -----------------------------
        user_id = payload.get("user_id")
        event_name = payload.get("event_name")
        event_data = payload.get("event_data", {})
        user_email = payload.get("user_email")

        if not user_id or not event_name:
            return {
                "status": "error",
                "message": "missing user_id or event_name"
            }

        # -----------------------------
        # 2. Store event in Supabase
        # -----------------------------
        db_response = supabase.table("events").insert({
            "user_id": user_id,
            "event_name": event_name,
            "event_data": event_data,
            "user_email": user_email
        }).execute()

        # -----------------------------
        # 3. Try AI processing safely (NO CRASH)
        # -----------------------------
        ai_result = None

        try:
            from backend.services.event_processor import process_event

            events_response = supabase.table("events") \
                .select("*") \
                .eq("user_id", user_id) \
                .order("created_at", desc=False) \
                .execute()

            events = events_response.data or []

            ai_result = process_event(user_id, events, user_email)

        except Exception as ai_error:
            ai_result = {
                "status": "ai_layer_error",
                "message": str(ai_error)
            }

        # -----------------------------
        # 4. Return safe response
        # -----------------------------
        return {
            "status": "event_saved",
            "inserted": db_response.data,
            "aios": ai_result
        }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }
