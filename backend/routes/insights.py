from fastapi import APIRouter
from backend.services.ai_engine import generate_insights

router = APIRouter(prefix="/api")

@router.get("/insights")
def get_insights():
    return generate_insights()
