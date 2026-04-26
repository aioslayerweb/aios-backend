def generate_ai_insight(events):
    try:
        headers = {
            "Authorization": f"Bearer {MISTRAL_API_KEY}",
            "Content-Type": "application/json"
        }

        summary = {}
        for e in events:
            name = e["event_name"]
            summary[name] = summary.get(name, 0) + 1

        prompt = f"""
        Analyze this user behavior data:

        {summary}

        Give a short insight about user behavior.
        """

        response = requests.post(
            "https://api.mistral.ai/v1/chat/completions",
            headers=headers,
            json={
                "model": "mistral-small",
                "messages": [
                    {"role": "user", "content": prompt}
                ]
            }
        )

        data = response.json()

        # 🔥 SAFE EXTRACTION (FIX)
        if "choices" in data:
            return data["choices"][0]["message"]["content"]

        # fallback debug output
        return f"Unexpected AI response: {data}"

    except Exception as e:
        return f"AI error: {str(e)}"
