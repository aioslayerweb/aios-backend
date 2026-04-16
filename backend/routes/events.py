from fastapi import APIRouter
from backend.services.supabase_client import supabase

router = APIRouter()

@router.post("/events")
def create_event(payload: dict):
    response = supabase.table("events").insert(payload).execute()
    return {"status": "event received", "data": response.data}
