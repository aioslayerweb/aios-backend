from fastapi import APIRouter
from backend.services.agent_engine import run_all_agents
from backend.services.supabase_client import supabase
from datetime import datetime, timezone

router = APIRouter(prefix="/api")


# -----------------------------
# GLOBAL AIOS INSIGHTS (AGENTS)
# -----------------------------
@router.get("/insights")
def get_insights():
    return run_all_agents()


# -----------------------------
# USER INTELLIGENCE (AIOS v2)
# -----------------------------
@router.get("/insights/{user_id}")
def get_user_insights(user_id: str):

    # Fetch user events
    events = supabase.table("events") \
        .select("*") \
        .eq("user_id", user_id) \
        .execute()

    data = events.data or []

    now = datetime.now(timezone.utc)

    event_count = len(data)

    # ----------------------------
    # TIME-DECAY SCORING MODEL
    # ----------------------------
    score = 0

    for e in data:
        created_at = e.get("created_at")

        if created_at:
            try:
                event_time = datetime.fromisoformat(created_at.replace("Z", "+00:00"))
                hours_ago = (now - event_time).total_seconds() / 3600

                # 30-day decay window
                decay = max(0.1, 1 - (hours_ago / 720))
                score += 10 * decay

            except Exception:
                score += 5
        else:
            score += 5

    score = min(100, int(score))

    # ----------------------------
    # EVENT BREAKDOWN
    # ----------------------------
    event_breakdown = {}
    last_event_time = None

    for e in data:
        name = e.get("event_name")
        event_breakdown[name] = event_breakdown.get(name, 0) + 1

        if e.get("created_at"):
            last_event_time = e.get("created_at")

    # ----------------------------
    # USER SEGMENTATION ENGINE
    # ----------------------------
    if score >= 80:
        segment = "power_user"
    elif score >= 50:
        segment = "active_user"
    elif score >= 20:
        segment = "at_risk"
    else:
        segment = "inactive"

    # ----------------------------
    # CHURN RISK MODEL
    # ----------------------------
    if segment == "inactive":
        churn_risk = "high"
    elif segment == "at_risk":
        churn_risk = "medium"
    else:
        churn_risk = "low"

    # ----------------------------
    # AIOS ACTION ENGINE
    # ----------------------------
    recommended_actions = []

    if churn_risk == "high":
        recommended_actions.append({
            "action_type": "re_engagement_email",
            "priority": "high",
            "message": "User is inactive - trigger winback campaign"
        })

    if segment == "power_user":
        recommended_actions.append({
            "action_type": "upsell_offer",
            "priority": "medium",
            "message": "Offer premium upgrade or advanced features"
        })

    if segment == "active_user":
        recommended_actions.append({
            "action_type": "engagement_boost",
            "priority": "low",
            "message": "Encourage continued usage with feature highlights"
        })

    # ----------------------------
    # RESPONSE
    # ----------------------------
    return {
        "user_id": user_id,
        "segment": segment,
        "aios_score": score,
        "churn_risk": churn_risk,
        "total_events": event_count,
        "event_breakdown": event_breakdown,
        "last_event_time": last_event_time,
        "recommended_actions": recommended_actions,
        "agent_insights": run_all_agents()
    }
