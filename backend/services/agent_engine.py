from backend.services.email_service import send_email


# =========================
# 1. AIOS SCORE ENGINE
# =========================
def calculate_aios_score(events: list) -> int:
    """
    Simple but stable scoring system
    (we will upgrade later to ML)
    """

    if not events:
        return 0

    score = 0

    for event in events:
        event_name = event.get("event_name", "")

        if event_name == "login":
            score += 10

        elif event_name == "view_pricing":
            score += 20

        elif event_name == "upgrade":
            score += 40

        elif event_name == "cancel_subscription":
            score -= 30

        else:
            score += 5

    return max(0, score)


# =========================
# 2. CHURN RISK ENGINE
# =========================
def calculate_churn_risk(score: int) -> str:
    if score >= 70:
        return "low"
    elif score >= 40:
        return "medium"
    else:
        return "high"


# =========================
# 3. AGENT INSIGHTS ENGINE
# =========================
def run_all_agents(user_id: str, events: list):
    """
    Core AIOS multi-agent system
    """

    score = calculate_aios_score(events)
    churn = calculate_churn_risk(score)

    insights = []

    # SALES AGENT
    insights.append({
        "agent": "sales",
        "insight": "Revenue opportunity detected based on engagement pattern",
        "impact_score": min(100, score + 20),
        "recommended_action": "send_discount_offer" if score < 50 else None,
        "severity": "high" if score < 40 else "medium"
    })

    # CUSTOMER SUCCESS AGENT
    insights.append({
        "agent": "customer_success",
        "insight": "User engagement trend analyzed for churn prediction",
        "impact_score": min(100, score + 10),
        "recommended_action": "send_email_reengagement" if churn == "high" else None,
        "severity": "high" if churn == "high" else "low"
    })

    # OPERATIONS AGENT
    insights.append({
        "agent": "operations",
        "insight": "System usage patterns indicate support demand",
        "impact_score": min(100, score),
        "recommended_action": "upsell_premium" if score > 60 else None,
        "severity": "medium"
    })

    return {
        "user_id": user_id,
        "aios_score": score,
        "churn_risk": churn,
        "agent_insights": insights
    }


# =========================
# 4. ACTION EXECUTION ENGINE
# =========================
def execute_action(action: str, user_email: str):

    if not action or not user_email:
        return {"status": "no_action"}

    if action == "send_email_reengagement":
        return send_email(
            user_email,
            "We miss you at AIOS 🚀",
            "<h1>Come back!</h1><p>Your insights are waiting.</p>"
        )

    if action == "send_discount_offer":
        return send_email(
            user_email,
            "Special offer just for you 💡",
            "<h1>20% OFF</h1><p>Return and save today.</p>"
        )

    if action == "upsell_premium":
        return send_email(
            user_email,
            "Upgrade to AIOS Pro 🚀",
            "<h1>Unlock power</h1><p>Upgrade now.</p>"
        )

    return {"status": "no_matching_action"}


# =========================
# 5. USER INSIGHT WRAPPER
# =========================
def build_user_insights(user_id: str, events: list, user_email: str = None):
    """
    Main entry point used by API layer
    """

    result = run_all_agents(user_id, events)

    # optional: execute first action if exists
    first_action = None

    for agent in result["agent_insights"]:
        if agent.get("recommended_action"):
            first_action = agent["recommended_action"]
            break

    action_result = None

    if first_action and user_email:
        action_result = execute_action(first_action, user_email)

    result["action_result"] = action_result

    return result
