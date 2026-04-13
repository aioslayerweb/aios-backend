from fastapi import FastAPI
from pydantic import BaseModel
from supabase import create_client
import os

app = FastAPI(title="AIOS Backend", version="0.5.0")

# =========================
# ENV VARIABLES
# =========================
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

# =========================
# DATA MODEL
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
# GENERATE INSIGHT
# =========================
@app.post("/generate-insight")
def generate_insight(event: Event):

    print("\n🚀 NEW EVENT RECEIVED")
    print(event)

    # -------------------------
    # 1. STORE EVENT
    # -------------------------
    try:
        supabase.table("events").insert({
            "user_id": event.user_id,
            "event_name": event.event_name,
            "event_data": event.event_data
        }).execute()

        print("✅ Event stored")

    except Exception as e:
        print("❌ Event insert error:", e)

    # -------------------------
    # 2. FETCH USER HISTORY
    # -------------------------
    try:
        response = supabase.table("events") \
            .select("*") \
            .eq("user_id", event.user_id) \
            .eq("event_name", "lesson_completed") \
            .order("created_at", desc=True) \
            .limit(5) \
            .execute()

        history = response.data

    except Exception as e:
        print("❌ Fetch error:", e)
        history = []

    # -------------------------
    # 3. EXTRACT SCORES
    # -------------------------
    scores = []

    for item in history:
        data = item.get("event_data", {})
        if isinstance(data, dict) and "score" in data:
            scores.append(data["score"])

    scores.reverse()

    print("📊 Scores:", scores)

    # -------------------------
    # 4. GENERATE INSIGHT
    # -------------------------
    insight = None
    insight_type = "performance"

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

    if insight is None:
        insight = "Not enough data yet."

    print("💡 Insight:", insight)

    # -------------------------
    # 5. STORE INSIGHT (SAFE)
    # -------------------------
    try:
        if insight:

            supabase.table("insights").insert({
                "user_id": event.user_id,
                "insight_text": insight,
                "insight_type": insight_type
            }).execute()

            print("✅ Insight stored")

        else:
            print("⚠️ Insight empty — not stored")

    except Exception as e:
        print("
