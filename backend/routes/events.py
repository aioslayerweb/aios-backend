from fastapi import APIRouter
from backend.services.supabase_client import supabase

router = APIRouter()

@router.post("/api/events")
async def create_event(payload: dict):
    if not supabase:
        return {"error": "Supabase not configured"}

    data = supabase.table("events").insert(payload).execute()
    return {"status": "event received", "data": data}
