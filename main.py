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
    return {"message": "AIOS backend is running (Realtime enabled)"}


# =========================
# 📊 EVENTS REST (fallback API)
# =========================
@app.get("/events")
def get_events():
    response = supabase.table("events").select("*").execute()
    return {"status": "success", "data": response.data}


# =========================
# 🧠 SIMPLE ALERT ENGINE
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
# 🔔 ALERTS API (REST)
# =========================
@app.get("/alerts")
def get_alerts():
    response = supabase.table("events").select("*").execute()
    events = response.data or []

    alerts = generate_alerts(events)

    return {
        "status": "success",
        "total_alerts": len(alerts),
        "alerts": alerts
    }


# =========================
# 🔌 WEBSOCKET: EVENTS STREAM
# =========================
@app.websocket("/ws/events")
async def ws_events(websocket: WebSocket):
    await websocket.accept()

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
            # 🔥 ACK RESPONSE (FIX YOU NEEDED)
            # =========================
            await websocket.send_text(json.dumps({
                "status": "received",
                "event_name": event.get("event_name"),
                "user_id": event.get("user_id")
            }))

    except WebSocketDisconnect:
        pass


# =========================
# 🔌 WEBSOCKET: LIVE ALERTS STREAM
# =========================
@app.websocket("/ws/alerts")
async def ws_alerts(websocket: WebSocket):
    await websocket.accept()

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
        pass
