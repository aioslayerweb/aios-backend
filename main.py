from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, Optional
import uuid
import os
import requests

app = FastAPI(title="AIOS Phase 2 - Action Engine")

# -------------------------
# CONFIG (Supabase)
# -------------------------
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json"
}

# -------------------------
# MODELS
# -------------------------
class ActionCreate(BaseModel):
    user_id: str
    type: str
    payload: Dict[str, Any]

class InsightToAction(BaseModel):
    insight_text: str
    user_id: str

# -------------------------
# HEALTH CHECK
# -------------------------
@app.get("/")
def root():
    return {"status": "AIOS Phase 2 backend running"}

# -------------------------
# CREATE ACTION
# -------------------------
@app.post("/actions/create")
def create_action(action: ActionCreate):
    action_id = str(uuid.uuid4())

    data = {
        "id": action_id,
        "user_id": action.user_id,
        "type": action.type,
        "payload": action.payload,
        "status": "pending"
    }

    res = requests.post(
        f"{SUPABASE_URL}/rest/v1/actions",
        headers=HEADERS,
        json=data
    )

    if res.status_code >= 300:
        raise HTTPException(status_code=400, detail=res.text)

    return {"message": "Action created", "id": action_id}

# -------------------------
# AI DECIDES ACTION FROM INSIGHT
# -------------------------
@app.post("/ai/decide-action")
def decide_action(body: InsightToAction):

    text = body.insight_text.lower()

    # VERY SIMPLE FREE LOGIC (no OpenAI cost yet)
    if "email" in text or "send" in text:
        action_type = "webhook"
        payload = {
            "url": "https://example.com/send-email",
            "message": body.insight_text
        }

    elif "remind" in text or "task" in text:
        action_type = "task"
        payload = {
            "title": body.insight_text,
            "priority": "medium"
        }

    else:
        action_type = "notification"
        payload = {
            "text": body.insight_text
        }

    action_id = str(uuid.uuid4())

    data = {
        "id": action_id,
        "user_id": body.user_id,
        "type": action_type,
        "payload": payload,
        "status": "pending"
    }

    requests.post(
        f"{SUPABASE_URL}/rest/v1/actions",
        headers=HEADERS,
        json=data
    )

    return {
        "message": "Action generated from insight",
        "action": data
    }

# -------------------------
# RUN PENDING ACTIONS
# -------------------------
@app.post("/actions/run")
def run_actions():

    res = requests.get(
        f"{SUPABASE_URL}/rest/v1/actions?status=eq.pending",
        headers=HEADERS
    )

    if res.status_code >= 300:
        raise HTTPException(status_code=400, detail=res.text)

    actions = res.json()

    results = []

    for action in actions:

        action_type = action["type"]

        # ---------------- EMAIL / WEBHOOK MOCK ----------------
        if action_type == "webhook":
            try:
                r = requests.post(
                    action["payload"]["url"],
                    json=action["payload"]
                )
                status = "done" if r.status_code < 300 else "failed"
            except:
                status = "failed"

        elif action_type == "task":
            status = "done"

        else:
            status = "done"

        # update status
        requests.patch(
            f"{SUPABASE_URL}/rest/v1/actions?id=eq.{action['id']}",
            headers=HEADERS,
            json={"status": status}
        )

        results.append({"id": action["id"], "status": status})

    return {"processed": len(results), "results": results}
