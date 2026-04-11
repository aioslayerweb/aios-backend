from fastapi import FastAPI
from pydantic import BaseModel
from openai import OpenAI
import os

app = FastAPI()

# ✅ API key is loaded from Render environment variables
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

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "user", "content": prompt}
        ]
    )

    text = response.choices[0].message.content

    return {"insight": text}
