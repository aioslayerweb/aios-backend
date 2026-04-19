from backend.services.supabase_client import supabase

# Save event (called from events route)
def process_event(event):
    try:
        data = {
            "user_id": event["user_id"],
            "event_name": event["event_name"],
            "event_data": event.get("event_data", {}),
            "user_email": event.get("user_email")
        }

        result = supabase.table("events").insert(data).execute()
        return result.data

    except Exception as e:
        print("Error inserting event:", e)
        return None


# ✅ THIS IS THE IMPORTANT PART (your error is here)
def get_user_events(user_id: str):
    try:
        response = supabase.table("events") \
            .select("*") \
            .eq("user_id", user_id) \
            .execute()

        if response.data is None:
            return []

        return response.data

    except Exception as e:
        print("Error fetching events:", e)
        return []
