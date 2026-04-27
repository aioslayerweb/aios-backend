from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from supabase_client import supabase
import json
from collections import defaultdict

app = FastAPI()


# =========================
# 🏠 ROOT
# =========================
@app.get("/")
def root():
    return {"message": "AIOS Real-Time Engine v1.2 running"}


# =========================
# 📊 EVENTS REST API
# =========================
@app.get("/events")
def get_events():
    response = supabase.table("events").select("*").execute()
    return {"status": "success", "data": response.data}


# =========================
# 🔔 ALERT ENGINE
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
                "type": "low_engagement",
                "severity": "medium",
                "user_id": uid,
                "message": f"User {uid} is barely active ({count} events)"
            })

    return alerts


# =========================
# 🌐 GLOBAL CONNECTIONS (IMPORTANT UPGRADE)
# =========================
active_connections = set()


# =========================
# 📡 BROADCAST ENGINE
# =========================
async def broadcast(message: dict):
    disconnected = set()

    for connection in active_connections:
        try:
            await connection.send_text(json.dumps(message))
        except:
            disconnected.add(connection)

    for conn in disconnected:
        active_connections.discard(conn)


# =========================
# 🔌 WS: EVENTS (REAL-TIME FANOUT)
# =========================
@app.websocket("/ws/events")
async def ws_events(websocket: WebSocket):
    await websocket.accept()
    active_connections.add(websocket)

    try:
        while True:
            data = await websocket.receive_text()

            try:
                event = json.loads(data)
            except:
                await websocket.send_text(json.dumps({
                    "status": "error",
                    "message": "Invalid JSON"
                }))
                continue

            # =========================
            # 💾 SAVE EVENT
            # =========================
            supabase.table("events").insert(event).execute()

            # =========================
            # 🔥 ACK (SENDER ONLY)
            # =========================
            await websocket.send_text(json.dumps({
                "status": "received",
                "event_name": event.get("event_name"),
                "user_id": event.get("user_id")
            }))

            # =========================
            # 📡 BROADCAST (ALL CLIENTS)
            # =========================
            await broadcast({
                "type": "new_event",
                "data": event
            })

            # =========================
            # 🔔 LIVE ALERT GENERATION
            # =========================
            response = supabase.table("events").select("*").execute()
            events = response.data or []

            alerts = generate_alerts(events)

            await broadcast({
                "type": "alerts_update",
                "alerts": alerts
            })

    except WebSocketDisconnect:
        active_connections.discard(websocket)


# =========================
# 🔌 WS: ALERT STREAM (OPTIONAL LIVE FEED)
# =========================
@app.websocket("/ws/alerts")
async def ws_alerts(websocket: WebSocket):
    await websocket.accept()
    active_connections.add(websocket)

    try:
        while True:
            response = supabase.table("events").select("*").execute()
            events = response.data or []

            alerts = generate_alerts(events)

            await websocket.send_text(json.dumps({
                "type": "alerts_update",
                "alerts": alerts
            }))

            import asyncio
            await asyncio.sleep(5)

    except WebSocketDisconnect:
        active_connections.discard(websocket)
