from fastapi import APIRouter
from backend.services.event_processor import get_user_events
from backend.services.agent_engine import build_user_insights, predict_churn

router = APIRouter()


@router.get("/api/insights/{user_id}")
def get_insights(user_id: str):
    try:
        # 1. fetch events
        events = get_user_events(user_id)

        # 2. compute insights
        insights = build_user_insights(user_id)

        # 3. compute churn risk
        churn = predict_churn(user_id)

        return {
            "user_id": user_id,
            "events_count": len(events or []),
            "insights": insights,
            "churn_risk": churn
        }

    except Exception as e:
        # IMPORTANT: this prevents silent 500 crashes
        return {
            "status": "error",
            "message": str(e)
        }
