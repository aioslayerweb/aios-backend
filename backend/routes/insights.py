from fastapi import APIRouter
from backend.services.event_processor import get_user_events
from backend.services.insights_engine import build_user_insights

router = APIRouter()

@router.get("/insights/{user_id}")
def get_insights(user_id: str):
    events = get_user_events(user_id)

    if not events:
        return {
            "user_id": user_id,
            "events_count": 0,
            "churn_risk": 0.0,
            "insight": "No activity yet"
        }

    return build_user_insights(events)
