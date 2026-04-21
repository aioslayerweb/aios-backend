from supabase import create_client
import os

# Load environment variables
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

# Safety check (prevents silent crashes)
if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
    raise Exception("Missing Supabase environment variables")

# Create Supabase client
supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
