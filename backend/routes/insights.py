from fastapi import APIRouter
from backend.services.agent_engine import run_all_agents
from backend.services.supabase_client import supabase

router = APIRouter(prefix="/api")


# 🔵 GLOBAL INSIGHTS (all agents)
@router.get("/insights")
def get_insights():
    return run_all_agents()


# 🟢 USER-SPECIFIC INSIGHTS
@router.get("/insights/{user_id}")
def get_user_insights(user_id: str):
    return run_all_agents(user_id)


# 🔥 OPTIONAL STEP (PERSIST INSIGHTS INTO SUPABASE)
@router.post("/insights/save/{user_id}")
def save_user_insights(user_id: str):

    insights = run_all_agents(user_id)

    saved = []

    for item in insights.get("agent_insights", []):
        row = {
            "user_id": user_id,
            "agent": item["agent"],
            "insight": item["insight"],
            "impact_score": item["impact_score"],
            "severity": item["severity"],
        }

        result = supabase.table("user_insights").insert(row).execute()
        saved.append(result.data)

    return {
        "status": "saved",
        "count": len(saved),
        "data": saved
    }
