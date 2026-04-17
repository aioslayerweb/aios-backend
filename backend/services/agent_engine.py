# backend/services/agent_engine.py

def calculate_aios_score(events):
    """
    Simple scoring logic based on number of events
    """
    count = len(events)

    if count > 10:
        return 80
    elif count > 5:
        return 60
    elif count > 2:
        return 40
    else:
        return 20


def build_user_insights(events):
    """
    Generate insight text from events
    """
    count = len(events)

    if count > 10:
        return {"score": 80, "insight": "Highly engaged user"}
    elif count > 5:
        return {"score": 60, "insight": "Moderately active user"}
    elif count > 2:
        return {"score": 40, "insight": "Active user"}
    else:
        return {"score": 20, "insight": "Low engagement"}


def predict_churn(events):
    """
    Very simple churn prediction
    """
    count = len(events)

    if count > 10:
        return 0.1
    elif count > 5:
        return 0.3
    elif count > 2:
        return 0.5
    else:
        return 0.8


def decide_action(churn_risk):
    """
    Decide what to do based on churn risk
    """
    if churn_risk > 0.7:
        return "send_discount"
    elif churn_risk > 0.4:
        return "send_reengagement_email"
    else:
        return "no_action"


def execute_action(action, user_email):
    """
    Execute the decided action
    """
    if action == "send_discount":
        print(f"Sending discount email to {user_email}")
    elif action == "send_reengagement_email":
        print(f"Sending re-engagement email to {user_email}")
    else:
        print("No action needed")
