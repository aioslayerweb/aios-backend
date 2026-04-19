from backend.services.insights_engine import build_user_insights
from backend.services.email_service import send_email


def process_event(event: dict):
    """
    Process incoming event and trigger AI + actions
    """

    user_id = event.get("user_id")
    user_email = event.get("user_email")

    # 1. Build insights
    insights = build_user_insights(user_id)

    # 2. Decide action (simple MVP logic)
    action = None

    if insights["churn_risk"] > 0.5:
        action = "send_reengagement_email"
    else:
        action = "none"

    # 3. Execute action
    if action == "send_reengagement_email" and user_email:
        send_email(
            to_email=user_email,
            subject="AIOS Insight",
            content=insights["insights"]["insight"]
        )

    return {
        "insights": insights,
        "action": action
    }
