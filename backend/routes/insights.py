from fastapi import APIRouter
from backend.services.agent_engine import run_all_agents
from backend.services.supabase_client import supabase
from collections import Counter
import random

router = APIRouter(prefix="/api")

# ========================================
# GLOBAL INSIGHTS (ALL USERS)
# ========================================
@router.get("/insights")
def get_insights():
    return run_all_agents()


# ========================================
# USER INTELLIGENCE (COMPUTED)
# ========================================
@router.get("/insights/{user_id}")
def get_user_insights(user_id: str):
    response = supabase.table("events").select("*").eq("user_id", user_id).execute()
    events = response.data

    if not events:
        return {
            "user_id": user_id,
            "message": "No data available"
        }

    event_names = [e["event_name"] for e in events]
    event_count = len(events)
    breakdown = Counter(event_names)

    last_event = events[-1]["event_name"]

    # AIOS scoring logic (simple v1)
    aios_score = event_count * 10

    churn_risk = "low"
    if event_count < 3:
        churn_risk = "high"
    elif event_count < 6:
        churn_risk = "medium"

    # Run agents dynamically
    agent_insights = run_all_agents()

    return {
        "user_id": user_id,
        "total_events": event_count,
        "event_breakdown": dict(breakdown),
        "last_event": last_event,
        "aios_score": aios_score,
        "churn_risk": churn_risk,
        "agent_insights": agent_insights
    }


# ========================================
# STORE AI INSIGHTS (NEW)
# ========================================
@router.post("/insights/store")
def store_user_insight(payload: dict):
    """
    Expected payload:
    {
        "user_id": "...",
        "insight": "...",
        "agent": "sales",
        "impact_score": 85,
        "recommended_action": "...",
        "severity": "high"
    }
    """

    response = supabase.table("user_insights").insert(payload).execute()

    return {
        "status": "insight stored",
        "data": response.data
    }
