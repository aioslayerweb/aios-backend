from fastapi import APIRouter
from backend.services.agent_engine import run_all_agents
from backend.services.supabase_client import supabase

router = APIRouter(prefix="/api")


# GLOBAL AIOS INTELLIGENCE (no user needed)
@router.get("/insights")
def get_insights():
    return run_all_agents()


# USER-SPECIFIC INTELLIGENCE LAYER
@router.get("/insights/{user_id}")
def get_user_insights(user_id: str):
    # Fetch events for this user
    response = (
        supabase
        .table("events")
        .select("*")
        .eq("user_id", user_id)
        .execute()
    )

    events = response.data or []

    if not events:
        return {
            "user_id": user_id,
            "total_events": 0,
            "event_breakdown": {},
            "last_event": None,
            "aios_score": 0,
            "churn_risk": "unknown",
            "agent_insights": []
        }

    # Build breakdown
    breakdown = {}
    for e in events:
        name = e.get("event_name")
        breakdown[name] = breakdown.get(name, 0) + 1

    last_event = events[-1].get("event_name")

    # Simple AIOS scoring logic (replace later with real model)
    total_events = len(events)
    aios_score = min(100, total_events * 10)

    churn_risk = "low"
    if total_events < 3:
        churn_risk = "high"
    elif total_events < 10:
        churn_risk = "medium"

    # reuse agent engine
    agent_insights = run_all_agents()

    return {
        "user_id": user_id,
        "total_events": total_events,
        "event_breakdown": breakdown,
        "last_event": last_event,
        "aios_score": aios_score,
        "churn_risk": churn_risk,
        "agent_insights": agent_insights
    }
