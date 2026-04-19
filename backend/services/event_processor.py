from backend.services.supabase_client import supabase


# =========================
# SAVE EVENT (optional helper)
# =========================
def save_event(user_id: str, event_name: str, user_email: str = None, event_data: dict = {}):
    try:
        data = {
            "user_id": user_id,
            "event_name": event_name,
            "event_data": event_data,
            "user_email": user_email
        }

        response = supabase.table("events").insert(data).execute()
        return response.data

    except Exception as e:
        print("Error saving event:", str(e))
        return None


# =========================
# GET USER EVENTS (THIS FIXES YOUR ERROR)
# =========================
def get_user_events(user_id: str):
    try:
        response = (
            supabase
            .table("events")
            .select("*")
            .eq("user_id", user_id)
            .execute()
        )

        return response.data if response.data else []

    except Exception as e:
        print("Error fetching user events:", str(e))
        return []


# =========================
# PROCESS EVENT (AI LOGIC ENTRY)
# =========================
def process_event(user_id: str):
    try:
        events = get_user_events(user_id)

        if not events:
            return {
                "events_count": 0,
                "insight": "No data yet",
                "score": 0,
                "churn_risk": 1.0
            }

        events_count = len(events)

        # ===== SIMPLE MVP LOGIC =====
        if events_count >= 10:
            insight = "Power user — very low churn risk"
            score = 90
            churn_risk = 0.1
        elif events_count >= 5:
            insight = "Active user — low churn risk"
            score = 60
            churn_risk = 0.3
        elif events_count >= 2:
            insight = "New user — medium churn risk"
            score = 40
            churn_risk = 0.6
        else:
            insight = "At risk user — high churn risk"
            score = 20
            churn_risk = 0.9

        return {
            "events_count": events_count,
            "insight": insight,
            "score": score,
            "churn_risk": churn_risk
        }

    except Exception as e:
        print("Error processing event:", str(e))
        return None
