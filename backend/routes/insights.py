from fastapi import APIRouter
from backend.services.supabase_client import supabase
from backend.services.agent_engine import build_user_insights

router = APIRouter(prefix="/api")


@router.get("/insights")
def get_global_insights():
    return [
        {"agent": "sales", "insight": "Revenue anomaly detected", "impact_score": 85, "severity": "high"},
        {"agent": "customer_success", "insight": "Churn risk rising", "impact_score": 90, "severity": "high"},
        {"agent": "operations", "insight": "Support delays increasing", "impact_score": 78, "severity": "medium"}
    ]


@router.get("/insights/{user_id}")
def get_user_insights(user_id: str):

    response = supabase.table("events").select("*").eq("user_id", user_id).execute()

    events = response.data if response.data else []

    return build_user_insights(user_id, events)
