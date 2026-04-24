from fastapi import FastAPI
from services.supabase_client import supabase

app = FastAPI()

@app.get("/")
def root():
    return {"message": "AIOS backend is running"}

# SIMPLE BROWSER TEST (NO POST TOOL NEEDED)
@app.get("/create-test-event")
def create_test_event():
    try:
        data = {
            "event_name": "browser_test",
            "event_data": {
                "source": "mobile_browser",
                "action": "auto_test"
            },
            "user_id": "123"
        }

        response = supabase.table("events").insert(data).execute()

        return {
            "status": "success",
            "message": "Test event created from browser",
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
