import requests
import time
import random
import uuid

BASE_URL = "http://127.0.0.1:8001"

EVENTS = [
    "login",
    "view_pricing",
    "interaction",
    "meeting_completed",
    "user_signup"
]

def send_event(user_id, event_name):
    payload = {
        "user_id": user_id,
        "event_name": event_name,
        "event_data": {
            "source": "simulator"
        }
    }

    r = requests.post(f"{BASE_URL}/debug/ingest", json=payload)
    print(r.json())

def simulate_user(user_id):
    print(f"\nSimulating user: {user_id}\n")

    for _ in range(random.randint(5, 12)):
        event = random.choice(EVENTS)
        send_event(user_id, event)
        time.sleep(1)

if __name__ == "__main__":
    users = [
        str(uuid.uuid4()),
        str(uuid.uuid4()),
        str(uuid.uuid4())
    ]

    for u in users:
        simulate_user(u)

    print("\nDONE: Simulation completed\n")

