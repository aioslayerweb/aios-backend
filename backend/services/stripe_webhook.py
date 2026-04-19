import os
import stripe
from fastapi import Request, HTTPException
from backend.services.supabase_client import supabase

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
endpoint_secret = os.getenv("STRIPE_WEBHOOK_SECRET")


async def handle_stripe_webhook(request: Request):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, endpoint_secret
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    # PAYMENT SUCCESS EVENT
    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]

        user_id = session.get("metadata", {}).get("user_id")

        if user_id:
            supabase.table("users").update({
                "is_pro": True
            }).eq("id", user_id).execute()

    return {"status": "ok"}
