from fastapi import APIRouter
from fastapi.responses import HTMLResponse
from backend.services.supabase_client import supabase
from datetime import datetime

router = APIRouter()

# ----------------------------
# EVENT INGESTION (AIOS CORE)
# ----------------------------
@router.post("/events")
def create_event(payload: dict):

    user_id = payload.get("user_id")
    event_name = payload.get("event_name")
    event_data = payload.get("event_data", {})

    # 1. Insert raw event (EVENT LAYER)
    event_response = supabase.table("events").insert({
        "user_id": user_id,
        "event_name": event_name,
        "event_data": event_data
    }).execute()

    # 2. Update AIOS intelligence layer (USER INSIGHTS)
    supabase.table("user_insights").upsert({
        "user_id": user_id,
        "engagement_score": 1,  # (simple v1 scoring)
        "churn_risk": "low",
        "last_activity": datetime.utcnow().isoformat(),
        "insights": {
            "last_event": event_name,
            "event_data": event_data
        }
    }).execute()

    return {
        "status": "event received",
        "data": event_response.data
    }


# ----------------------------
# AIOS DASHBOARD (v1)
# ----------------------------
@router.get("/insights", response_class=HTMLResponse)
def get_insights():

    response = supabase.table("user_insights").select("*").execute()
    data = response.data

    html = """
    <html>
    <head>
        <title>AIOS Intelligence Dashboard</title>
        <style>
            body { font-family: Arial; background: #0f172a; color: white; padding: 20px; }
            .card { background: #1e293b; padding: 15px; margin: 10px 0; border-radius: 10px; }
            .low { color: #22c55e; }
            .medium { color: #f59e0b; }
            .high { color: #ef4444; }
        </style>
    </head>
    <body>
        <h1>🧠 AIOS Intelligence Dashboard</h1>
    """

    for row in data:
        html += f"""
        <div class="card">
            <p><b>User:</b> {row.get('user_id')}</p>
            <p><b>Engagement Score:</b> {row.get('engagement_score')}</p>
            <p><b>Churn Risk:</b> <span class="{row.get('churn_risk')}">{row.get('churn_risk')}</span></p>
            <p><b>Last Activity:</b> {row.get('last_activity')}</p>
            <p><b>Insights:</b> {row.get('insights')}</p>
        </div>
        """

    html += "</body></html>"
    return HTMLResponse(content=html)
