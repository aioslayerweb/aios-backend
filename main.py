from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os

app = FastAPI()

# =========================
# Models
# =========================

class InsightRequest(BaseModel):
    user_id: str
    insight_type: str = "behavior"
    data: dict | None = None


class InsightResponse(BaseModel):
    success: bool
    insight_text: str | None = None
    message: str | None = None


# =========================
# Health check
# =========================

@app.get("/")
def root():
    return {"message": "AIOS backend is running"}


@app.get("/health")
def health():
    return {"status": "ok"}


# =========================
# Core endpoint
# =========================

@app.post("/generate-insight", response_model=InsightResponse)
def generate_insight(request: InsightRequest):

    try:
        # Placeholder logic (replace with AI / Supabase later)
        user_id = request.user_id
        insight_type = request.insight_type
        data = request.data or {}

        # Simple mock insight generator
        insight_text = (
            f"Generated {insight_type} insight for user {user_id}. "
            f"Data points received: {len(data)}"
        )

        return InsightResponse(
            success=True,
            insight_text=insight_text
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =========================
# Startup log (SAFE VERSION)
# =========================

@app.on_event("startup")
def startup_event():
    print("AIOS backend started successfully")
