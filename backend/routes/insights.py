from fastapi import APIRouter, HTTPException
from backend.services.event_processor import get_user_events
from backend.services.agent_engine import build_user_insights

router = APIRouter()


@router.get("/api/insights/{user_id}")
def get_insights(user_id: str):
    try:
        # 1. Get user events (from DB or mock layer)
        events = get_user_events(user_id)

        # 2. Generate AIOS insights (single source of truth)
        result = build_user_insights(user_id=user_id, events=events)

        return result

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Insights generation failed: {str(e)}"
        )
