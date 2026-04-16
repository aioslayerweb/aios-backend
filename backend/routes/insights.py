from fastapi import APIRouter
from backend.services.agent_engine import run_all_agents
from backend.services.supabase_client import supabase

router = APIRouter(prefix="/api")


# -----------------------------
# GLOBAL AIOS INSIGHTS (AGENTS)
# -----------------------------
@router.get("/insights")
def get_insights():
    return run_all_agents()


# -----------------------------
# USER-LEVEL INTELLIGENCE
# -----------------------------
@router.get("/insights/{user_id}")
def get_user_insights(user_id: str):

    # Fetch events for this user
    events = supabase.table("events") \
        .select("*") \
        .eq("user_id", user_id) \
        .execute()

    data = events.data or []

    # Basic analytics
    event_count = len(data)

    event_breakdown = {}
    last_event = None

    for e in data:
        name = e.get("event_name")

        event_breakdown[name] = event_breakdown.get(name, 0) + 1
        last_event = name

    # Simple AIOS scoring model (v1)
    score = min(100, event_count * 10)

    # Lightweight intelligence layer
    churn_risk = "low"
    if score < 30:
        churn_risk = "high"
    elif score < 70:
        churn_risk = "medium"

    return {
        "user_id": user_id,
        "total_events": event_count,
        "event_breakdown": event_breakdown,
        "last_event": last_event,
        "aios_score": score,
        "churn_risk": churn_risk,
        "agent_insights": run_all_agents()
    }
