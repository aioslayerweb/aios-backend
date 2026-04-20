import os
from supabase import create_client, Client

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

print("==== SUPABASE DEBUG ====")
print("URL:", SUPABASE_URL)
print("KEY EXISTS:", bool(SUPABASE_KEY))
print("========================")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("⚠️ Supabase env missing — running without DB")
    supabase = None
else:
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
