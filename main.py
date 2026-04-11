from fastapi import FastAPI
from pydantic import BaseModel
from openai import OpenAI
import os

app = FastAPI()

# OpenAI client (will fail if no billing, so we handle it safely)
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

class Event(BaseModel):
    event_name: str
    event_data: dict

@app.get("/")
def root():
    return {"message": "AIOS backend is running"}

@app.post("/generate-insight")
def generate_insight(event: Event):
    prompt = f"""
You are an AI business analyst.

Event:
{event.event_name}

Data:
{event.event_data}

Generate:
1. A short title
2. A short description
"""

    try:
        # Try real OpenAI call
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "user", "content": prompt}
            ]
        )

        return {
            "insight": response.choices[0].message.content,
            "mode": "ai"
        }

    except Exception as e:
        # Fallback mode (NO billing required)
        return {
            "insight": f"[MOCK INSIGHT] Event '{event.event_name}' from {event.event_data} detected. This is a high-value user interaction.",
            "mode": "mock",
            "error": str(e)
        }
