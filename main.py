from fastapi import FastAPI
from backend.routes import events

app = FastAPI(
    title="AIOS Backend",
    version="1.0.0"
)

# -----------------------
# ROUTES
# -----------------------
app.include_router(events.router)

# -----------------------
# HEALTH CHECK
# -----------------------
@app.get("/")
def root():
    return {
        "status": "AIOS backend running",
        "layer": "Intelligence Layer v1"
    }
