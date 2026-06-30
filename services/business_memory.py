from datetime import datetime
from typing import Dict, Any


def get_company_memory() -> Dict[str, Any]:
    """
    AIOS Business Memory v2

    Central memory layer for company-level context.

    Future versions will persist:
    - Executive decisions
    - Company goals
    - Strategic initiatives
    - AI observations
    - Revenue history
    - Customer intelligence
    """

    return {
        "company": {
            "name": "AIOS Demo Company",
            "industry": "Technology",
            "employees": 25
        },

        "executive_context": {
            "current_priority":
                "Increase pipeline conversion",

            "last_decision":
                "Focus outbound efforts on enterprise accounts",

            "decision_date":
                datetime.utcnow().isoformat()
        },

        "memory_stats": {
            "customers_tracked": 128,
            "events_processed": 58,
            "recommendations_generated": 17
        }
    }


def get_customer_memory() -> Dict[str, Any]:

    return {
        "customers": [
            {
                "id": "cust_001",
                "name": "Acme Corp",
                "health": "healthy",
                "value": 25000
            },
            {
                "id": "cust_002",
                "name": "Globex",
                "health": "at_risk",
                "value": 12000
            }
        ]
    }


def get_decision_memory() -> Dict[str, Any]:

    return {
        "decisions": [
            {
                "id": "dec_001",
                "title":
                    "Prioritise enterprise segment",

                "impact":
                    "high",

                "timestamp":
                    datetime.utcnow().isoformat()
            }
        ]
    }