from services.customer_engine import get_customer


def calculate_churn_probability(customer_id: str):
    """
    Probabilistic churn model (MVP version).

    Produces a 0–1 score based on weighted signals.
    """

    customer = get_customer(customer_id)

    if not customer:
        return None

    score = 0.0
    drivers = []

    health = customer.get("health_score", 0)
    churn_flag = customer.get("churn_risk", "low")
    contract_value = customer.get("contract_value", 0)
    revenue = customer.get("annual_revenue", 0)
    lifecycle = customer.get("lifecycle_stage", "")

    # -----------------------------
    # Health score contribution
    # -----------------------------
    if health < 50:
        score += 0.35
        drivers.append("low health score")
    elif health < 70:
        score += 0.2
        drivers.append("moderate health score decline")

    # -----------------------------
    # Churn flag contribution
    # -----------------------------
    if churn_flag == "high":
        score += 0.4
        drivers.append("explicit high churn risk flag")
    elif churn_flag == "medium":
        score += 0.25
        drivers.append("medium churn risk flag")

    # -----------------------------
    # Contract value signal
    # -----------------------------
    if contract_value < 10000:
        score += 0.15
        drivers.append("low contract value")

    # -----------------------------
    # Revenue stability signal
    # -----------------------------
    if revenue < 1000000:
        score += 0.1
        drivers.append("low annual revenue base")

    # -----------------------------
    # Lifecycle signal
    # -----------------------------
    if lifecycle in ["prospect", "trial"]:
        score += 0.1
        drivers.append("early lifecycle stage")

    # Clamp probability between 0 and 1
    churn_probability = min(max(score, 0.0), 1.0)

    # Risk level classification
    if churn_probability >= 0.7:
        risk_level = "high"
    elif churn_probability >= 0.4:
        risk_level = "medium"
    else:
        risk_level = "low"

    # Recommended actions
    actions = []

    if risk_level == "high":
        actions = [
            "Immediate customer intervention",
            "Executive outreach required",
            "Usage and value audit",
        ]
    elif risk_level == "medium":
        actions = [
            "Schedule success check-in",
            "Monitor usage trends",
        ]
    else:
        actions = [
            "Expand account",
            "Upsell opportunity review",
        ]

    return {
        "customer_id": customer_id,
        "churn_probability": round(churn_probability, 2),
        "risk_level": risk_level,
        "drivers": drivers,
        "recommended_actions": actions
    }