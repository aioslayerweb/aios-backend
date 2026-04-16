import random

def run_sales_agent():
    return {
        "agent": "sales",
        "insight": "Revenue anomaly detected in mid-tier customers",
        "impact_score": random.randint(70, 95),
        "recommended_action": "Review pricing conversion funnel",
        "severity": "high"
    }


def run_customer_success_agent():
    return {
        "agent": "customer_success",
        "insight": "Churn risk increased for inactive accounts",
        "impact_score": random.randint(60, 98),
        "recommended_action": "Trigger re-engagement campaign",
        "severity": "high"
    }


def run_operations_agent():
    return {
        "agent": "operations",
        "insight": "Support ticket resolution time is increasing",
        "impact_score": random.randint(50, 90),
        "recommended_action": "Optimize support workflow routing",
        "severity": "medium"
    }


def run_all_agents():
    return [
        run_sales_agent(),
        run_customer_success_agent(),
        run_operations_agent()
    ]
