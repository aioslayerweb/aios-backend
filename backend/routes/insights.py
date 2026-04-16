from fastapi import APIRouter
from backend.services.supabase_client import supabase
from backend.services.agent_engine import build_user_insights

router = APIRouter(prefix="/api")


@router.get("/insights")
def get_global_insights():
    """
    Static system-wide insights (no user context)
    """
    return [
        {
            "agent": "sales",
            "insight": "Revenue anomaly detected in mid-tier customers",
            "impact_score": 85,
            "recommended_action": "Review pricing conversion funnel",
            "severity": "high"
        },
        {
            "agent": "customer_success",
            "insight": "Churn risk increased for inactive accounts",
            "impact_score": 90,
            "recommended_action": "Trigger re-engagement campaign",
            "severity": "high"
        },
        {
            "agent": "operations",
            "insight": "Support ticket resolution time is increasing",
            "impact_score": 78,
            "recommended_action": "Optimize support workflow routing",
            "severity": "medium"
        }
    ]


@router.get("/insights/{user_id}")
def get_user_insights(user_id: str):
    """
    Dynamic AIOS intelligence per user
    """

    # fetch events from Supabase
    response = supabase.table("events") \
        .select("*") \
        .eq("user_id", user_id) \
        .execute()

    events = response.data if response.data else []

    # AIOS engine
    result = build_user_insights(user_id, events)

    return result
