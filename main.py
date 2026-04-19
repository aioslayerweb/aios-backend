from fastapi import FastAPI
from backend.routes import events, insights, billing

app = FastAPI()

app.include_router(events.router)
app.include_router(insights.router, prefix="/api")
app.include_router(billing.router)


@app.get("/")
def root():
    return {"message": "AIOS backend running"}
