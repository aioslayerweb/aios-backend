from fastapi import APIRouter, Request
from backend.services.stripe_webhook import handle_stripe_webhook
from backend.services.stripe_service import create_checkout_session

router = APIRouter()


# -----------------------------
# CREATE CHECKOUT SESSION
# -----------------------------
@router.post("/upgrade-to-pro/{user_id}")
async def upgrade_to_pro(user_id: str):
    return await create_checkout_session(user_id)


# -----------------------------
# STRIPE WEBHOOK
# -----------------------------
@router.post("/stripe/webhook")
async def stripe_webhook(request: Request):
    return await handle_stripe_webhook(request)
