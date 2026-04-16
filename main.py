from fastapi import FastAPI
from backend.routes import events

app = FastAPI()

app.include_router(events.router)

@app.get("/")
def root():
    return {"status": "working"}
