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
    return {
        "ready": True
    }

# ==========================================
# Debug
# ==========================================

@app.get("/debug/users")
def users():

    res = supabase.table("events").select("user_id").execute()

    if not res.data:
        return []

    return list(
        set(
            e.get("user_id")
            for e in res.data
            if e.get("user_id")
        )
    )

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
                json.dumps(
                    {
                        "type": "ack",
                        "received": payload
                    }
                )
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
            </ul>
        </body>
    </html>
    """