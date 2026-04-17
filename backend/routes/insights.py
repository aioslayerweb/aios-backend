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
    try:
        print(f"[INSIGHTS] Fetching events for user: {user_id}")

        events = get_user_events(user_id)
        print(f"[INSIGHTS] Events fetched: {len(events)}")

        score = calculate_aios_score(events)
        print(f"[INSIGHTS] Score: {score}")

        churn = predict_churn(events)
        print(f"[INSIGHTS] Churn: {churn}")

        insights = build_user_insights(score, churn)
        print(f"[INSIGHTS] Insights: {insights}")

        return {
            "user_id": user_id,
            "events_count": len(events),
            "insights": insights,
            "churn_risk": churn
        }

    except Exception as e:
        print(f"[ERROR] {str(e)}")
        return {"error": str(e)}
