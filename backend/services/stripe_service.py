import stripe
import os

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")


def create_checkout_session(user_id):
    """
    Safe Stripe checkout (prevents 500 crashes)
    """

    if not stripe.api_key:
        return {
            "error": "Missing STRIPE_SECRET_KEY in environment"
        }

    price_id = os.getenv("STRIPE_PRICE_ID")

    if not price_id:
        return {
            "error": "Missing STRIPE_PRICE_ID in environment"
        }

    try:
        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            mode="subscription",
            line_items=[
                {
                    "price": price_id,
                    "quantity": 1,
                }
            ],
            success_url="https://aios-backend-4.onrender.com/success",
            cancel_url="https://aios-backend-4.onrender.com/cancel",
            metadata={
                "user_id": user_id
            }
        )

        return {
            "checkout_url": session.url
        }

    except Exception as e:
        return {
            "error": str(e)
        }
