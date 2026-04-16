from fastapi import APIRouter

router = APIRouter(prefix="/api")

@router.post("/events")
def create_event():
    return {"status": "event received"}
