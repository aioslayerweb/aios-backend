from backend.services.supabase_client import supabase
from backend.services.business_memory import build_memory


def process_event(event):
    try:
        # Step 1: build memory object
        memory = build_memory(event)

        # Step 2: store raw event
        supabase.table("events").insert({
            "user_id": event["user_id"],
            "event_name": event["event_name"],
            "event_data": event.get("event_data", {}),
            "user_email": event.get("user_email")
        }).execute()

        # Step 3: store business memory (NEW LAYER)
        supabase.table("user_insights").insert({
            "user_id": event["user_id"],
            "insight_type": memory["memory_type"],
            "content": memory,
            "created_at": memory["timestamp"]
        }).execute()

        return memory

    except Exception as e:
        print("Event processing error:", e)
        return None


def get_user_events(user_id: str):
    try:
        response = supabase.table("events") \
            .select("*") \
            .eq("user_id", user_id) \
            .execute()

        return response.data or []

    except Exception as e:
        print("Error fetching events:", e)
        return []