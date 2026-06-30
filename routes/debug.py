from fastapi import APIRouter

router = APIRouter()

@router.get("/debug/users")
def users():
    return [
        "test-user-1",
        "test-user-2"
    ]
