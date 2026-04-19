from backend.services.supabase_client import supabase
from backend.services.insights_engine import build_user_insights


def get_user_events(user_id: str):
    """
    Fetch all events for a given user from Supabase
    """
    try:
        response = (
            supabase
            .table("events")
            .select("*")
            .eq("user_id", user_id)
            .order("created_at", desc=False)
            .execute()
        )

        return response.data if response.data else []

    except Exception as e:
        print("ERROR fetching events:", str(e))
        return []


def process_event(user_id: str):
    """
    Core pipeline:
    1. Get user events
    2. Build insights
    3. Return structured result
    """

    try:
        events = get_user_events(user_id)

        if not events:
            return {
                "user_id": user_id,
                "events_count": 0,
                "churn_risk": 1.0,
                "insight": "No activity detected"
            }

        insights = build_user_insights(events)

        return insights

    except Exception as e:
        print("ERROR processing event:", str(e))

        return {
            "user_id": user_id,
            "events_count": 0,
            "churn_risk": 1.0,
            "insight": "Processing error"
        }
