from fastapi import APIRouter
from backend.services.agent_engine import run_all_agents

router = APIRouter(prefix="/api")

@router.get("/insights")
def get_insights():
    return run_all_agents()
