from fastapi import FastAPI
from backend.services.supabase_client import supabase

app = FastAPI()

@app.get("/")
def root():
    return {"message": "AIOS backend is running"}

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
