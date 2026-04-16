from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.routes import insights
from backend.routes import events

app = FastAPI(
    title="AIOS Backend",
    version="1.0.0"
)

# ----------------------------
# CORS (IMPORTANT for frontend)
# ----------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # in production you should restrict this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------------------
# ROUTES
# ----------------------------
app.include_router(insights.router)
app.include_router(events.router)


# ----------------------------
# HEALTH CHECK
# ----------------------------
@app.get("/")
def root():
    return {
        "status": "AIOS backend running",
        "version": "1.0.0",
        "modules": [
            "insights",
            "events"
        ]
    }


@app.get("/health")
def health():
    return {"status": "ok"}
