import threading

from backend.services.event_processor import process_event, get_user_events
from backend.services.agent_engine import (
    calculate_aios_score,
    predict_churn,
    build_user_insights,
    decide_action,
)
from backend.services.email_service import send_email


def run_ai_async(event: dict):
    thread = threading.Thread(target=process_event_pipeline, args=(event,))
    thread.start()


def process_event_pipeline(event: dict):
    """
    Full AIOS pipeline:
    event → store → analyze → decide → act
    """

    # 1. store event
    process_event(event)

    user_id = event.get("user_id")
    user_email = event.get("user_email")

    if not user_id:
        return

    # 2. fetch history
    events = get_user_events(user_id)

    # 3. AI scoring
    score = calculate_aios_score(events)
    churn = predict_churn(events)
    insights = build_user_insights(score, churn)

    # 4. decide action
    action = decide_action(score, churn)

    print("AIOS INSIGHT:", insights)
    print("AIOS ACTION:", action)

    # 5. EXECUTE ACTION (REVENUE LAYER)
    if action["action"] == "send_email" and user_email:
        send_email(
            to_email=user_email,
            subject="We miss you at AIOS 👀",
            content=f"""
                <h2>AIOS Insight</h2>
                <p>{insights['insight']}</p>
                <p><b>We noticed low activity in your account.</b></p>
                <p>Come back and explore new insights.</p>
            """
        )

    elif action["action"] == "upsell" and user_email:
        send_email(
            to_email=user_email,
            subject="Unlock Premium AI Insights 🚀",
            content=f"""
                <h2>You're power user status: {insights['score']}</h2>
                <p>Upgrade to unlock deeper analytics and automation.</p>
            """
        )
