from fastapi import FastAPI
from backend.routes import events, insights

app = FastAPI()

# -----------------------------
# ROUTES
# -----------------------------
app.include_router(events.router)
app.include_router(insights.router)


# -----------------------------
# HEALTH CHECK
# -----------------------------
@app.get("/")
def root():
    return {
        "status": "AIOS backend running",
        "layer": "AIOS Intelligence Layer v2.1"
    }
