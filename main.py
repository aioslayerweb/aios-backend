from fastapi import FastAPI
from services.supabase_client import supabase

app = FastAPI()

@app.get("/")
def root():
    return {"message": "AIOS backend is running"}

@app.get("/create-test-event")
def create_test_event():
    try:
        data = {
            "event_name": "browser_test",
            "event_data": {
                "source": "mobile_browser",
                "action": "auto_test"
            },
            # FIX: valid UUID format
            "user_id": "550e8400-e29b-41d4-a716-446655440000"
        }

        response = supabase.table("events").insert(data).execute()

        return {
            "status": "success",
            "message": "Test event created",
            "data": response.data
        }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }

@app.get("/test-db")
def test_db():
    try:
        response = supabase.table("events").select("*").execute()
        return {
            "status": "success",
            "data": response.data
        }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }
