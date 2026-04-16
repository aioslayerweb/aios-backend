@router.post("/events")
def create_event(payload: dict):
    result = supabase.table("events").insert({
        "user_id": payload["user_id"],
        "event_name": payload["event_name"],
        "event_data": payload["event_data"]
    }).execute()

    return {
        "status": "event received",
        "data": result.data
    }
