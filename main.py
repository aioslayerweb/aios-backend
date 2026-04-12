from fastapi import FastAPI
from pydantic import BaseModel
from supabase import create_client
import os

app = FastAPI(title="AIOS Backend", version="0.3.1")

# =========================
# ENV
# =========================
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

# =========================
# MODEL
# =========================
class Event(BaseModel):
    user_id: str
    event_name: str
    event_data: dict

# =========================
# ROOT
# =========================
@app.get("/")
def root():
    return {"message": "AIOS backend running"}

# =========================
# MAIN ENDPOINT
# =========================
@app.post("/generate-insight")
def generate_insight(event: Event):

    print("🚀 EVENT:", event)

    # -------------------------
    # 1. STORE EVENT
    # -------------------------
    try:
        supabase.table("events").insert({
            "user_id": None,  # keep NULL for now
            "event_name": event.event_name,
            "event_data": event.event_data
        }).execute()

        print("✅ Event stored")

    except Exception as e:
        print("❌ Event insert error:", e)

    # -------------------------
    # 2. FETCH HISTORY
    # -------------------------
    try:
        history = supabase.table("events") \
            .select("*") \
            .eq("event_name", "lesson_completed") \
            .order("created_at", desc=True) \
            .limit(5) \
            .execute()

        events_history = history.data

    except Exception as e:
        print("❌ Fetch error:", e)
        events_history = []

    # -------------------------
    # 3. EXTRACT SCORES
    # -------------------------
    scores = []

    for e in events_history:
        data = e.get("event_data", {})
        if isinstance(data, dict) and "score" in data:
            scores.append(data["score"])

    scores.reverse()  # oldest → newest

    print("📊 Scores:", scores)

    # -------------------------
    # 4. RULE-BASED INTELLIGENCE
    # -------------------------
    insight = "Not enough data yet."

    if len(scores) >= 2:

        if scores[-1] > scores[0]:
            insight = "User is improving — consider increasing difficulty."

        elif scores[-1] < scores[0]:
            insight = "User performance is dropping — review previous lessons."

        else:
            insight = "User progress is stagnant — introduce variation."

    if scores:
        if scores[-1] < 60:
            insight = "User is struggling — suggest easier content."

        elif scores[-1] > 80:
            insight = "User is performing well — increase difficulty."

    print("💡 Insight:", insight)

    # -------------------------
    # 5. STORE INSIGHT (FIXED)
    # -------------------------
    try:
        supabase.table("insights").insert({
            "insight_text": insight   # 👈 ONLY THIS FIELD
        }).execute()

        print("✅ Insight stored")

    except Exception as e:
        print("❌ Insight insert error:", e)

    # -------------------------
    # RESPONSE
    # -------------------------
    return {
        "insight": insight,
        "mode": "rule-based"
    }
