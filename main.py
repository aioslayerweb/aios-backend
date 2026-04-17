from fastapi import FastAPI
from backend.routes import events, insights

app = FastAPI()


# Include routers
app.include_router(events.router)
app.include_router(insights.router)


@app.get("/")
def root():
    return {"status": "AIOS backend running"}
