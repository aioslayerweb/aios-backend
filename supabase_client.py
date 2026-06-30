import os
import logging
from dotenv import load_dotenv
from supabase import Client, create_client

# ==========================================
# AIOS Configuration
# ==========================================

load_dotenv()

logger = logging.getLogger("aios.supabase")

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")


def _validate_environment() -> None:
    """
    Ensure all required environment variables exist before
    starting the backend.
    """

    missing = []

    if not SUPABASE_URL:
        missing.append("SUPABASE_URL")

    if not SUPABASE_SERVICE_ROLE_KEY:
        missing.append("SUPABASE_SERVICE_ROLE_KEY")

    if missing:
        raise RuntimeError(
            f"Missing required environment variables: {', '.join(missing)}"
        )


_validate_environment()


try:
    supabase: Client = create_client(
        SUPABASE_URL,
        SUPABASE_SERVICE_ROLE_KEY,
    )

    logger.info("Supabase client initialized successfully.")

except Exception as exc:
    logger.exception("Failed to initialize Supabase client.")
    raise RuntimeError("Unable to connect to Supabase.") from exc