from fastapi import APIRouter
from backend.services.event_processor import get_user_events
from backend.services.agent_engine import (
    calculate_aios_score,
    predict_churn,
    build_user_insights
)

router = APIRouter()


@router.get("/api/insights/{user_id}")
def get_insights(user_id: str):
    events = get_user_events(user_id)

    score = calculate_aios_score(events)
    churn = predict_churn(events)
    insights = build_user_insights(score, churn)

    return {
        "user_id": user_id,
        "events_count": len(events),
        "insights": insights,
        "churn_risk": churn
    }
