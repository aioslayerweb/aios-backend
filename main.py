from fastapi import FastAPI
from pydantic import BaseModel
import openai
import os

app = FastAPI()

# Load your OpenAI API key from environment variables
openai.api_key = os.getenv("OPENAI_API_KEY")

# Define the data structure for incoming events
class Event(BaseModel):
    event_name: str
    event_data: dict

# Simple test route (so you can check if your API is running)
@app.get("/")
def root():
    return {"message": "AIOS backend is running"}

# AI endpoint
@app.post("/generate-insight")
def generate_insight(event: Event):
    prompt = f"""
You are an AI business analyst.

Event:
{event.event_name}

Data:
{event.event_data}

Generate a short insight with:
1. A short title
2. A short description
"""

    response = openai.ChatCompletion.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "user", "content": prompt}
        ]
    )

    text = response.choices[0].message["content"]

    return {"insight": text}
