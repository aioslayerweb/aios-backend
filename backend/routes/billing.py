from fastapi import APIRouter
from backend.services.stripe_service import create_checkout_session

router = APIRouter()


@router.post("/upgrade-to-pro/{user_id}")
def upgrade(user_id: str):
    """
    Redirect user to Stripe checkout
    """

    checkout_url = create_checkout_session(user_id)

    return {
        "checkout_url": checkout_url
    }
