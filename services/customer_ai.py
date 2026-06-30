from supabase_client import supabase


def build_customer_insights(customer_id: str):
    """
    AI-powered customer intelligence layer.
    Uses structured reasoning (MVP-safe AI layer).
    """

    res = (
        supabase.table("customers")
        .select("*")
        .eq("id", customer_id)
        .limit(1)
        .execute()
    )

    if not res.data:
        return None

    customer = res.data[0]

    health = customer.get("health_score", 0)
    churn_risk = customer.get("churn_risk", "low")
    revenue = customer.get("annual_revenue", 0)
    contract = customer.get("contract_value", 0)
    company = customer.get("company_name")

    # -----------------------------
    # AI-style reasoning layer
    # (deterministic but "intelligent")
    # -----------------------------

    if health >= 80:
        risk_level = "low"
        analysis = f"{company} shows strong engagement and stable usage patterns."
        actions = ["Expand account", "Introduce upsell opportunities"]
        opportunity = "high"

    elif health >= 50:
        risk_level = "medium"
        analysis = f"{company} shows mixed signals with declining engagement indicators."
        actions = ["Schedule success review", "Monitor usage trends"]
        opportunity = "medium"

    else:
        risk_level = "high"
        analysis = f"{company} shows strong churn signals and low engagement."
        actions = ["Urgent intervention", "Customer success escalation"]
        opportunity = "critical"

    # Revenue intelligence overlay
    if contract > 20000:
        actions.append("Enterprise upsell review")

    if churn_risk == "high":
        actions.append("Immediate retention workflow")

    return {
        "customer_id": customer["id"],
        "company": company,
        "health_score": health,
        "risk_level": risk_level,
        "analysis": analysis,
        "recommended_actions": actions,
        "revenue_opportunity": opportunity,
        "financial_context": {
            "annual_revenue": revenue,
            "contract_value": contract
        }
    }