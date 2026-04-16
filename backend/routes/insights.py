from fastapi import APIRouter
from backend.services.supabase_client import supabase
from backend.services.agent_engine import run_all_agents

router = APIRouter(prefix="/api")

# =========================
# GLOBAL INSIGHTS (ALL USERS)
# =========================
@router.get("/insights")
def get_global_insights():
    return run_all_agents()


# =========================
# USER-SPECIFIC INSIGHTS
# =========================
@router.get("/insights/{user_id}")
def get_user_insights(user_id: str):
    try:
        # Fetch events from Supabase
        response = supabase.table("events") \
            .select("*") \
            .eq("user_id", user_id) \
            .execute()

        events = response.data or []

        total_events = len(events)

        # =========================
        # EVENT BREAKDOWN
        # =========================
        event_breakdown = {}
        for event in events:
            name = event.get("event_name")
            if name:
                event_breakdown[name] = event_breakdown.get(name, 0) + 1

        last_event = events[-1]["event_name"] if events else None

        # =========================
        # ✅ BETTER AIOS SCORE (REAL LOGIC)
        # =========================
        score = 0

        # Engagement volume
        if total_events > 5:
            score += 30
        elif total_events > 2:
            score += 15
        elif total_events > 0:
            score += 5

        # Behavior signals
        if "login" in event_breakdown:
            score += 20

        if "purchase" in event_breakdown:
            score += 50

        if "signup" in event_breakdown:
            score += 10

        aios_score = score

        # =========================
        # CHURN RISK (BASIC LOGIC)
        # =========================
        if total_events == 0:
            churn_risk = "high"
        elif total_events < 3:
            churn_risk = "medium"
        else:
            churn_risk = "low"

        # =========================
        # AGENT INSIGHTS (BASIC RULES)
        # =========================
        agent_insights = []

        if total_events < 3:
            agent_insights.append({
                "agent": "customer_success",
                "insight": "User engagement is low",
                "impact_score": 85,
                "recommended_action": "Send onboarding or reactivation email",
                "severity": "high"
            })

        if "login" in event_breakdown and event_breakdown["login"] > 3:
            agent_insights.append({
                "agent": "sales",
                "insight": "Highly active user detected",
                "impact_score": 70,
                "recommended_action": "Upsell premium features",
                "severity": "medium"
            })

        if "purchase" in event_breakdown:
            agent_insights.append({
                "agent": "sales",
                "insight": "User has high purchase intent",
                "impact_score": 90,
                "recommended_action": "Offer premium plan or upsell",
                "severity": "high"
            })

        return {
            "user_id": user_id,
            "total_events": total_events,
            "event_breakdown": event_breakdown,
            "last_event": last_event,
            "aios_score": aios_score,
            "churn_risk": churn_risk,
            "agent_insights": agent_insights
        }

    except Exception as e:
        return {"error": str(e)}
