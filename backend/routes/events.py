from fastapi import APIRouter, Header, HTTPException
from backend.services.supabase_client import supabase
import jwt
import os

router = APIRouter()

SUPABASE_JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET")

def get_user_id_from_token(token: str):
    try:
        decoded = jwt.decode(token, options={"verify_signature": False})
        return decoded["sub"]
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

@router.post("/events")
def create_event(payload: dict, authorization: str = Header(None)):

    if not authorization:
        raise HTTPException(status_code=401, detail="Missing token")

    token = authorization.replace("Bearer ", "")
    user_id = get_user_id_from_token(token)

    event = {
        "user_id": user_id,
        "event_name": payload.get("event_name"),
        "event_data": payload.get("event_data", {})
    }

    response = supabase.table("events").insert(event).execute()

    return {
        "status": "event received",
        "data": response.data
    }
