import os
from dataclasses import dataclass
from dotenv import load_dotenv

load_dotenv()


@dataclass(frozen=True)
class AIOSSettings:

    # -------------------------
    # Application
    # -------------------------

    APP_NAME: str = "AIOS"
    APP_VERSION: str = "0.2.0"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    DEBUG: bool = os.getenv("DEBUG", "false").lower() == "true"

    # -------------------------
    # Server
    # -------------------------

    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))

    # -------------------------
    # Supabase
    # -------------------------

    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_SERVICE_ROLE_KEY: str = os.getenv(
        "SUPABASE_SERVICE_ROLE_KEY",
        ""
    )

    # -------------------------
    # AI Providers
    # -------------------------

    # Primary (European)
    MISTRAL_API_KEY: str = os.getenv("MISTRAL_API_KEY", "")

    # Optional fallback
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")

    # -------------------------
    # Security
    # -------------------------

    JWT_SECRET: str = os.getenv(
        "JWT_SECRET",
        "CHANGE_ME_IN_PRODUCTION"
    )

    JWT_ALGORITHM: str = "HS256"

    # -------------------------
    # Logging
    # -------------------------

    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")


settings = AIOSSettings()