from fastapi import APIRouter
from backend.services.stripe_service import create_checkout_session

router = APIRouter()


@router.post("/upgrade-to-pro/{user_id}")
def upgrade(user_id: str):
    result = create_checkout_session(user_id)
    return result
