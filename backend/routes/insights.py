from fastapi import APIRouter

router = APIRouter(prefix="/api")

@router.get("/insights")
def get_insights():
    return [
        {
            "title": "Revenue drop detected",
            "description": "Sales decreased 12% in last 7 days",
            "impact_score": 85,
            "category": "sales"
        },
        {
            "title": "Customer churn risk",
            "description": "3 enterprise users inactive",
            "impact_score": 92,
            "category": "customer_success"
        }
    ]
