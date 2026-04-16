from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.routes import insights

# =========================
# AIOS Backend App
# =========================

app = FastAPI(
    title="AIOS Backend",
    description="Autonomous Business Optimization System API",
    version="1.0.0"
)

# =========================
# CORS (important for Next.js frontend)
# =========================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # in production, replace with your Vercel domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# Routes
# =========================

app.include_router(insights.router)

# =========================
# Health Check
# =========================

@app.get("/")
def root():
    return {
        "status": "AIOS backend running",
        "message": "Welcome to AIOS API"
    }
