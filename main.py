from fastapi import FastAPI
from backend.routes import events, insights

app = FastAPI()

# Events routes
app.include_router(events.router)

# Insights routes (IMPORTANT FIX)
app.include_router(insights.router)

@app.get("/")
def root():
    return {"status": "AIOS running"}
