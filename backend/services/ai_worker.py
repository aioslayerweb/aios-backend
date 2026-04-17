import threading
from backend.services.event_processor import process_event
from backend.services.supabase_client import supabase


def run_ai_async(user_id, user_email):
    """
    Runs AIOS intelligence in background thread
    """

    def worker():
        try:
            # fetch all events
            response = supabase.table("events") \
                .select("*") \
                .eq("user_id", user_id) \
                .order("created_at", desc=False) \
                .execute()

            events = response.data or []

            # process AI
            process_event(user_id, events, user_email)

        except Exception as e:
            print("AI Worker Error:", str(e))

    thread = threading.Thread(target=worker)
    thread.start()
