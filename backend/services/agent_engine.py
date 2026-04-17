from backend.services.email_service import send_email


def execute_action(action, user_email):

    try:
        if not action or not user_email:
            return {"status": "no_action"}

        if action == "send_email_reengagement":
            return send_email(
                to_email=user_email,
                subject="We miss you at AIOS 🚀",
                html="<h1>Come back!</h1><p>Your AI insights are waiting.</p>"
            )

        if action == "send_discount_offer":
            return send_email(
                to_email=user_email,
                subject="Special Offer Just for You 💡",
                html="<h1>20% OFF</h1><p>Come back and save.</p>"
            )

        if action == "upsell_premium":
            return send_email(
                to_email=user_email,
                subject="Upgrade to AIOS Pro 🚀",
                html="<h1>Unlock Full Power</h1><p>Upgrade to Pro now.</p>"
            )

        return {"status": "no_matching_action"}

    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }
