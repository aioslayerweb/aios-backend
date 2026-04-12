from fastapi import FastAPI
from pydantic import BaseModel
from openai import OpenAI
from supabase import create_client
import os

app = FastAPI()

# ----------------------------
# OpenAI
# ----------------------------
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# ----------------------------
# Supabase (PUT IT HERE)
# ----------------------------
supabase = None

supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_ANON_KEY")

if supabase_url and supabase_key:
    supabase = create_client(supabase_url, supabase_key)
