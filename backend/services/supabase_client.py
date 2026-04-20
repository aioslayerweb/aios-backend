import os
from supabase import create_client, Client

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("❌ SUPABASE ENV DEBUG")
    print("SUPABASE_URL:", SUPABASE_URL)
    print("SUPABASE_KEY:", "SET" if SUPABASE_KEY else None)
    raise Exception("Missing Supabase environment variables")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
