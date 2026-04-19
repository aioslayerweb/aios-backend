from backend.services.supabase_client import supabase
from datetime import datetime


# ----------------------------
# SAVE EVENT
# ----------------------------
def process_event(user_id: str, event_name: str, event_data: dict = None, user_email: str = None):
    if event_data is None:
        event_data = {}

    event = {
        "user_id": user_id,
        "event_name": event_name,
        "event_data": event_data,
        "user_email": user_email,
        "created_at": datetime.utcnow().isoformat()
    }

    response = supabase.table("events").insert(event).execute()

    return response.data


# ----------------------------
# GET USER EVENTS (FIXED)
# ----------------------------
def get_user_events(user_id: str):
    response = supabase.table("events") \
        .select("*") \
        .eq("user_id", user_id) \
        .order("created_at", desc=True) \
        .execute()

    return response.data if response.data else []


# ----------------------------
# SIMPLE USER METRICS
# ----------------------------
def get_user_metrics(user_id: str):
    events = get_user_events(user_id)

    total_events = len(events)

    logins = len([e for e in events if e["event_name"] == "login"])
    purchases = len([e for e in events if e["event_name"] == "purchase"])

    return {
        "total_events": total_events,
        "logins": logins,
        "purchases": purchases
    }
