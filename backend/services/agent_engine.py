from backend.services.supabase_client import supabase
from backend.services.email_service import send_email


# =========================
# 1. EVENT SCORING
# =========================

def calculate_aios_score(event_name: str) -> int:
    scores = {
        "login": 5,
        "view_pricing": 15,
        "signup": 25,
        "cancel_subscription": -30,
    }
    return scores.get(event_name, 1)


# =========================
# 2. USER INSIGHTS GENERATION
# =========================

def build_user_insights(user_id: str):
    events = supabase.table("events") \
        .select("*") \
        .eq("user_id", user_id) \
        .execute()

    data = events.data or []

    if not data:
        return {
            "score": 0,
            "insight": "No activity yet"
        }

    total_score = 0

    for e in data:
        total_score += calculate_aios_score(e.get("event_name", ""))

    insight = "Low engagement"

    if total_score > 50:
        insight = "Highly engaged user"
    elif total_score > 20:
        insight = "Active user"
    elif total_score < 0:
        insight = "At risk of churn"

    return {
        "score": total_score,
        "insight": insight
    }


# =========================
# 3. CHURN PREDICTION
# =========================

def predict_churn(user_id: str) -> float:
    data = build_user_insights(user_id)
    score = data["score"]

    if score < 0:
        return 0.9
    elif score < 20:
        return 0.6
    elif score < 50:
        return 0.3
    else:
        return 0.1


# =========================
# 4. DECISION ENGINE
# =========================

def decide_action(user_id: str):
    churn_risk = predict_churn(user_id)

    if churn_risk > 0.7:
        return "send_email_winback"
    elif churn_risk > 0.4:
        return "send_email_engagement"
    else:
        return "do_nothing"


# =========================
# 5. EXECUTION ENGINE
# =========================

def execute_action(user_id: str, user_email: str, action: str):
    if action == "send_email_winback":
        send_email(
            user_email,
            "We miss you at AIOS",
            "Come back and see what's new!"
        )

    elif action == "send_email_engagement":
        send_email(
            user_email,
            "AIOS insights for you",
            "You're becoming an active user!"
        )

    return {"status": "executed", "action": action}


# =========================
# 6. MAIN ENTRYPOINT
# =========================

def run_ai_pipeline(user_id: str, user_email: str):
    insights = build_user_insights(user_id)
    action = decide_action(user_id)
    result = execute_action(user_id, user_email, action)

    return {
        "insights": insights,
        "action": action,
        "result": result
    }
