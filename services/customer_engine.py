from supabase_client import supabase


def get_all_customers():
    """
    Returns all customers ordered by company name.
    """

    res = (
        supabase.table("customers")
        .select("*")
        .order("company_name")
        .execute()
    )

    return res.data or []


def get_customer(customer_id: str):
    """
    Returns one customer by UUID.
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

    return res.data[0]


def get_customer_health(customer_id: str):
    """
    Returns AIOS customer health summary.
    """

    customer = get_customer(customer_id)

    if customer is None:
        return None

    return {
        "customer_id": customer["id"],
        "company_name": customer["company_name"],
        "health_score": customer["health_score"],
        "churn_risk": customer["churn_risk"],
        "lifecycle_stage": customer["lifecycle_stage"],
        "ai_summary": customer["ai_summary"]
    }