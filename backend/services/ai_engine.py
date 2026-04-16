import random

def generate_insights():
    """
    AIOS core intelligence layer (MVP version).
    Later this will be replaced with LLM (OpenAI / local model).
    """

    insights = [
        {
            "title": "Revenue anomaly detected",
            "description": "Unusual 14% drop in weekly revenue trend",
            "impact_score": random.randint(70, 95),
            "category": "sales"
        },
        {
            "title": "Customer churn risk rising",
            "description": "Inactive enterprise accounts detected in last 72h",
            "impact_score": random.randint(75, 98),
            "category": "customer_success"
        },
        {
            "title": "Operational bottleneck identified",
            "description": "Support ticket resolution time increased by 22%",
            "impact_score": random.randint(60, 90),
            "category": "operations"
        }
    ]

    return insights
