from fastapi import FastAPI
from pydantic import BaseModel
from typing import Dict, Any, Optional
from services.supabase_client import supabase

app = FastAPI()

# --------------------
# ROOT
# --------------------
@app.get("/")
def root():
    return {"message": "AIOS backend is running"}

# --------------------
# EVENT MODEL
# --------------------
class Event(BaseModel):
    event_name: str
    event_data: Dict[str, Any]
    user_id: Optional[str] = None

# --------------------
# CREATE EVENT
# --------------------
@app.post("/events")
def create_event(event: Event):
    try:
        response = supabase.table("events").insert(event.dict()).execute()
        return {"status": "success", "data": response.data}
    except Exception as e:
        return {"status": "error", "message": str(e)}

# --------------------
# GET EVENTS
# --------------------
@app.get("/events")
def get_events():
    try:
        response = supabase.table("events").select("*").execute()
        return {"status": "success", "data": response.data}
    except Exception as e:
        return {"status": "error", "message": str(e)}

# --------------------
# 🔥 INSIGHTS ENDPOINT (NEW)
# --------------------
@app.get("/insights/{user_id}")
def get_insights(user_id: str):
    try:
        response = supabase.table("events").select("*").eq("user_id", user_id).execute()
        events = response.data

        if not events:
            return {
                "status": "success",
                "insights": "No data for this user",
                "total_events": 0
            }

        # Count events
        total_events = len(events)

        # Count event types
        event_counts = {}
        for event in events:
            name = event["event_name"]
            event_counts[name] = event_counts.get(name, 0) + 1

        # Find most common event
        top_event = max(event_counts, key=event_counts.get)

        # Simple insight logic
        if total_events > 10:
            activity_level = "highly active"
        elif total_events > 5:
            activity_level = "moderately active"
        else:
            activity_level = "low activity"

        insight_text = f"User is {activity_level}. Most common action: {top_event}"

        return {
            "status": "success",
            "user_id": user_id,
            "total_events": total_events,
            "event_breakdown": event_counts,
            "insight": insight_text
        }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }
