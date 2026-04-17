from backend.services.supabase_client import supabase

# Optional fallback (in case Supabase fails)
EVENT_STORE = {}


def process_event(event: dict):
    """
    Save event to Supabase
    """
    try:
        supabase.table("events").insert(event).execute()
    except Exception as e:
        print("Supabase error:", e)

    # fallback storage
    user_id = event.get("user_id")
    if user_id:
        EVENT_STORE.setdefault(user_id, []).append(event)


def get_user_events(user_id: str):
    """
    Fetch events from Supabase
    """
    try:
        response = supabase.table("events").select("*").eq("user_id", user_id).execute()
        return response.data or []
    except Exception as e:
        print("Fetch error:", e)
        return EVENT_STORE.get(user_id, [])
