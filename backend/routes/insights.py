from fastapi import APIRouter
from backend.services.agent_engine import run_all_agents
from backend.services.supabase_client import supabase

router = APIRouter(prefix="/api")


# -----------------------------
# GLOBAL AIOS INSIGHTS
# -----------------------------
@router.get("/insights")
def get_insights():
    return run_all_agents()


# -----------------------------
# USER-SPECIFIC INSIGHTS
# -----------------------------
@router.get("/insights/{user_id}")
def get_user_insights(user_id: str):

    # Fetch events from Supabase
    response = (
        supabase
        .table("events")
        .select("*")
        .eq("user_id", user_id)
        .execute()
    )

    events = response.data or []

    total_events = len(events)

    # Event breakdown
    event_breakdown = {}
    for e in events:
        name = e.get("event_name")
        event_breakdown[name] = event_breakdown.get(name, 0) + 1

    # Last event
    last_event = events[-1]["event_name"] if events else None

    # AIOS scoring (simple MVP logic)
    aios_score = min(100, total_events * 10)

    # Churn logic
    churn_risk = "low"
    if total_events < 3:
        churn_risk = "high"
    elif total_events < 10:
        churn_risk = "medium"

    # Response
    return {
        "user_id": user_id,
        "total_events": total_events,
        "event_breakdown": event_breakdown,
        "last_event": last_event,
        "aios_score": aios_score,
        "churn_risk": churn_risk,
        "agent_insights": run_all_agents()  # ✅ FIXED (no user_id here)
    }


# -----------------------------
# SAVE INSIGHTS (OPTIONAL)
# -----------------------------
@router.post("/insights/save/{user_id}")
def save_user_insights(user_id: str):

    insights = run_all_agents()

    saved = []

    for item in insights:
        row = {
            "user_id": user_id,
            "agent": item.get("agent"),
            "insight": item.get("insight"),
            "impact_score": item.get("impact_score"),
            "severity": item.get("severity"),
        }

        result = supabase.table("user_insights").insert(row).execute()
        saved.append(result.data)

    return {
        "status": "saved",
        "count": len(saved),
        "data": saved
    }
