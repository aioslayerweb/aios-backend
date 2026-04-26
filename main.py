from fastapi import FastAPI
from pydantic import BaseModel
from typing import Dict, Any, Optional
from services.supabase_client import supabase

app = FastAPI()

# --------------------
# ROOT
# --------------------
@app.get("/")
def root():
    return {"message": "AIOS backend is running"}

# --------------------
# HEALTH CHECK
# --------------------
@app.get("/health")
def health():
    return {"status": "ok"}

# --------------------
# EVENT MODEL
# --------------------
class Event(BaseModel):
    event_name: str
    event_data: Dict[str, Any]
    user_id: Optional[str] = None
