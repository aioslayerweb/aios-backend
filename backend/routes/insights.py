from fastapi import APIRouter
from backend.services.supabase_client import supabase
from backend.services.agent_engine import run_all_agents

router = APIRouter(prefix="/api")


# -----------------------------
# GLOBAL INSIGHTS (NO USER)
# -----------------------------
@router.get("/insights")
def get_global_insights():
    return run_all_agents([])


# -----------------------------
# USER INSIGHTS (REAL SYSTEM)
# -----------------------------
@router.get("/insights/{user_id}")
def get_user_insights(user_id: str):

    response = (
        supabase.table("events")
        .select("*")
        .eq("user_id", user_id)
        .execute()
    )

    events = response.data if response.data else []

    return {
        "user_id": user_id,
        "insights": run_all_agents(events, user_id)
    }
