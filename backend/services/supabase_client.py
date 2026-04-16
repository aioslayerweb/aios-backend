import os

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase = None

try:
    if SUPABASE_URL and SUPABASE_KEY:
        from supabase import create_client
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    else:
        print("⚠️ Missing Supabase env vars - running without DB")
except Exception as e:
    print("⚠️ Supabase init failed:", e)
    supabase = None
