import os
from supabase import create_client, Client

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

print("🔍 ENV CHECK START")
print("SUPABASE_URL:", SUPABASE_URL)
print("SUPABASE_KEY:", "EXISTS" if SUPABASE_KEY else None)
print("🔍 ENV CHECK END")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise Exception("Missing Supabase environment variables")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
