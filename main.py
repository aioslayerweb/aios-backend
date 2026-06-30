from datetime import datetime
import json

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse

from config.settings import settings
from supabase_client import supabase

from services.signals import extract_signals
from services.executive_engine import build_executive_overview

from services.business_memory import (
    get_company_memory,
    get_customer_memory,
    get_decision_memory,
)

from services.customer_engine import (
    get_all_customers,
    get_customer,
    get_customer_health,
)

from services.customer_ai import build_customer_insights
from services.churn_model import calculate_churn_probability

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
)

# ==========================================
# Middleware
# ==========================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================
# State
# ==========================================

active_connections = set()

# ==========================================
# Helpers
# ==========================================

def get_user_events(user_id: str):
    res = (
        supabase.table("events")
        .select("*")
        .eq("user_id", user_id)
        .execute()
    )
    return res.data or []

# ==========================================
# System
# ==========================================

@app.get("/")
def root():
    return {
        "name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "environment": settings.ENVIRONMENT,
        "status": "running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat()
    }


@app.get("/ready")
def ready():
    return {"ready": True}

# ==========================================
# Executive Intelligence
# ==========================================

@app.get("/api/v1/executive/overview")
def executive_overview():
    res = supabase.table("events").select("*").execute()
    events = res.data or []
    return build_executive_overview(events)

# ==========================================
# Business Memory
# ==========================================

@app.get("/api/v1/memory/company")
def company_memory():
    return get_company_memory()


@app.get("/api/v1/memory/customers")
def customer_memory():
    return get_customer_memory()


@app.get("/api/v1/memory/decisions")
def decision_memory():
    return get_decision_memory()

# ==========================================
# Customers
# ==========================================

@app.get("/api/v1/customers")
def customers():
    return {"customers": get_all_customers()}


@app.get("/api/v1/customers/{customer_id}")
def customer(customer_id: str):
    data = get_customer(customer_id)
    if not data:
        return {"error": "Customer not found"}
    return data


@app.get("/api/v1/customers/{customer_id}/health")
def customer_health(customer_id: str):
    data = get_customer_health(customer_id)
    if not data:
        return {"error": "Customer not found"}
    return data


@app.get("/api/v1/customers/{customer_id}/insights")
def customer_insights(customer_id: str):
    data = build_customer_insights(customer_id)
    if not data:
        return {"error": "Customer not found"}
    return data


@app.get("/api/v1/customers/{customer_id}/churn")
def customer_churn(customer_id: str):
    return calculate_churn_probability(customer_id)

# ==========================================
# Signals
# ==========================================

@app.get("/signals/{user_id}")
def signals(user_id: str):
    events = get_user_events(user_id)
    return extract_signals(events)

# ==========================================
# Insights
# ==========================================

@app.get("/insights/{user_id}")
def insights(user_id: str):
    events = get_user_events(user_id)
    return {
        "user_id": user_id,
        "event_count": len(events),
        "insights": [
            {
                "title": "Supabase Connected",
                "description": f"{len(events)} events loaded",
                "type": "system"
            }
        ]
    }

# ==========================================
# Autopilot
# ==========================================

@app.get("/autopilot/{user_id}")
def autopilot(user_id: str):
    events = get_user_events(user_id)
    return {
        "user_id": user_id,
        "event_count": len(events),
        "score": 42,
        "segment": "mid_value",
        "status": "supabase_mode"
    }

# ==========================================
# WebSocket
# ==========================================

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    active_connections.add(websocket)

    try:
        while True:
            raw = await websocket.receive_text()
            payload = json.loads(raw)

            await websocket.send_text(
                json.dumps({"type": "ack", "received": payload})
            )

    except WebSocketDisconnect:
        active_connections.remove(websocket)

# ==========================================
# Dashboard
# ==========================================

@app.get("/dashboard", response_class=HTMLResponse)
def dashboard():
    return """
    <html>
        <body style="font-family:Arial;background:#0f172a;color:white;padding:40px">
            <h1>AIOS Executive Dashboard API</h1>
            <p>Backend Status: ✅ Running</p>
            <ul>
                <li><a href="/health">Health</a></li>
                <li><a href="/ready">Ready</a></li>
                <li><a href="/api/v1/executive/overview">Executive Overview</a></li>
                <li><a href="/api/v1/memory/company">Company Memory</a></li>
                <li><a href="/api/v1/memory/customers">Customer Memory</a></li>
                <li><a href="/api/v1/memory/decisions">Decision Memory</a></li>
                <li><a href="/api/v1/customers">Customers</a></li>
            </ul>
        </body>
    </html>
    """