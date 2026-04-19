import os
import stripe
from fastapi import Request, HTTPException

from backend.services.supabase_client import supabase_client

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET")


async def handle_stripe_webhook(request: Request):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")

    if not sig_header:
        raise HTTPException(status_code=400, detail="Missing Stripe signature")

    try:
        event = stripe.Webhook.construct_event(
            payload=payload,
            sig_header=sig_header,
            secret=WEBHOOK_SECRET
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Webhook error: {str(e)}")

    # -------------------------------
    # PAYMENT SUCCESS EVENT
    # -------------------------------
    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]

        user_id = session.get("metadata", {}).get("user_id")

        if user_id:
            # Upgrade user in Supabase
            supabase_client.table("users") \
                .update({"is_pro": True}) \
                .eq("id", user_id) \
                .execute()

            print(f"User upgraded to PRO: {user_id}")

    return {"status": "ok"}
