from datetime import datetime


def classify_memory(event_name: str):
    """
    Converts raw events into memory types
    """

    mapping = {
        "login": "activity_signal",
        "view_pricing": "intent_signal",
        "interaction": "engagement_signal",
        "signup": "conversion_signal",
        "logout": "activity_signal"
    }

    return mapping.get(event_name, "unknown_signal")


def calculate_intent_score(event_name: str):
    """
    Simple intent scoring for now (will evolve into AI model later)
    """

    scores = {
        "view_pricing": 0.8,
        "interaction": 0.5,
        "signup": 0.9,
        "login": 0.2,
        "logout": 0.1
    }

    return scores.get(event_name, 0.0)


def build_memory(event: dict):
    """
    Converts raw event → Business Memory object
    """

    event_name = event.get("event_name")

    memory = {
        "user_id": event.get("user_id"),
        "user_email": event.get("user_email"),
        "event_name": event_name,

        "memory_type": classify_memory(event_name),
        "intent_score": calculate_intent_score(event_name),

        "timestamp": datetime.utcnow().isoformat(),

        "raw_event": event
    }

    return memory