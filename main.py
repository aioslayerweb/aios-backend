from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from supabase_client import supabase
from collections import defaultdict
import json

app = FastAPI()


# =========================
# 🏠 ROOT
# =========================
@app.get("/")
def root():
    return {"message": "AIOS backend is running (Realtime enabled)"}


# =========================
# 🧠 IN-MEMORY CONNECTIONS
# =========================
active_connections = []


# =========================
# 🔌 WEBSOCKET MANAGER
# =========================
async def broadcast(message: dict):
    disconnected = []
    for connection in active_connections:
        try:
            await connection.send_text(json.dumps(message))
        except:
            disconnected.append(connection)

    for d in disconnected:
        active_connections.remove(d)


# =========================
# 🔌 REAL-TIME EVENTS STREAM
# =========================
@app.websocket("/ws/events")
async def ws_events(websocket: WebSocket):
    await websocket.accept()
    active_connections.append(websocket)

    try:
        while True:
            data = await websocket.receive_text()

            event = json.loads(data)

            # Save to DB
            supabase.table("events").insert(event).execute()

            # Broadcast live event
            await broadcast({
                "type": "new_event",
                "data": event
            })

    except WebSocketDisconnect:
        active_connections.remove(websocket)


# =========================
# 🔔 ALERT ENGINE (REAL-TIME)
# =========================
def generate_alerts(events):
    user_activity = defaultdict(int)

    for e in events:
        uid = e.get("user_id")
        if uid:
            user_activity[uid] += 1

    alerts = []

    for uid, count in user_activity.items():
        if count < 3:
            alerts.append({
                "type": "churn_risk",
                "severity": "high",
                "user_id": uid,
                "message": "User at high churn risk"
            })

    return alerts


# =========================
# 🔌 REAL-TIME ALERT STREAM
# =========================
@app.websocket("/ws/alerts")
async def ws_alerts(websocket: WebSocket):
    await websocket.accept()
    active_connections.append(websocket)

    try:
        while True:
            response = supabase.table("events").select("*").execute()
            events = response.data or []

            alerts = generate_alerts(events)

            await websocket.send_text(json.dumps({
                "type": "alerts_update",
                "alerts": alerts
            }))

            # simple interval simulation
            import asyncio
            await asyncio.sleep(5)

    except WebSocketDisconnect:
        active_connections.remove(websocket)


# =========================
# 📊 REST FALLBACK (DASHBOARD SUPPORT)
# =========================
@app.get("/dashboard/overview")
def dashboard_overview():
    response = supabase.table("events").select("*").execute()
    events = response.data or []

    total = len(events)
    users = len(set(e["user_id"] for e in events if e.get("user_id")))

    return {
        "status": "success",
        "total_events": total,
        "unique_users": users
    }


@app.get("/events")
def get_events():
    response = supabase.table("events").select("*").execute()
    return {"status": "success", "data": response.data}
