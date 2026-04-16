from backend.services.supabase_client import supabase


@router.get("/insights/{user_id}")
def get_user_insights(user_id: str):

    events = supabase.table("events") \
        .select("*") \
        .eq("user_id", user_id) \
        .execute()

    data = events.data or []

    event_count = len(data)

    event_types = {}
    for e in data:
        name = e.get("event_name")
        event_types[name] = event_types.get(name, 0) + 1

    score = min(100, event_count * 10)

    return {
        "user_id": user_id,
        "total_events": event_count,
        "event_breakdown": event_types,
        "aios_score": score,
        "agent_insights": run_all_agents()
    }
