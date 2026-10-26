from datetime import datetime

from fastapi import Depends, FastAPI, HTTPException, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse

from config.settings import settings
from supabase_client import supabase
from backend.routes.organizations import (
    router as organizations_router,
)
from backend.routes.security import router as security_router
from backend.security.authorization import (
    AuthorizedOrganization,
    BusinessPermission,
    require_organization_permission,
)
from backend.services.organization_memberships import (
    SupabaseMembershipRepository,
)

from services.business_memory import (
    get_company_memory,
    get_customer_memory,
    get_decision_memory,
)

from services.customer_engine import (
    get_all_customers,
    get_customer,
    get_customer_health,
)

from services.customer_ai import build_customer_insights
from services.churn_model import calculate_churn_probability

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
)
app.include_router(security_router)
app.include_router(organizations_router)
app.state.organization_membership_repository = SupabaseMembershipRepository(supabase)
read_business = require_organization_permission(BusinessPermission.READ)

# ==========================================
# Middleware
# ==========================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================
def require_event_organization_scope() -> None:
    raise HTTPException(
        status_code=503,
        detail="Event organization scope is not configured.",
    )

# ==========================================
# System
# ==========================================

@app.get("/")
def root():
    return {
        "name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "environment": settings.ENVIRONMENT,
        "status": "running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat()
    }


@app.get("/ready")
def ready():
    return {"ready": True}

# ==========================================
# Executive Intelligence
# ==========================================

@app.get("/api/v1/executive/overview")
def executive_overview(
    authorized: AuthorizedOrganization = Depends(read_business),
):
    require_event_organization_scope()

# ==========================================
# Business Memory
# ==========================================

@app.get("/api/v1/memory/company")
def company_memory(
    _authorized: AuthorizedOrganization = Depends(read_business),
):
    return get_company_memory()


@app.get("/api/v1/memory/customers")
def customer_memory(
    _authorized: AuthorizedOrganization = Depends(read_business),
):
    return get_customer_memory()


@app.get("/api/v1/memory/decisions")
def decision_memory(
    _authorized: AuthorizedOrganization = Depends(read_business),
):
    return get_decision_memory()

# ==========================================
# Customers
# ==========================================

@app.get("/api/v1/customers")
def customers(
    authorized: AuthorizedOrganization = Depends(read_business),
):
    return {"customers": get_all_customers(authorized.organization_id)}


@app.get("/api/v1/customers/{customer_id}")
def customer(
    customer_id: str,
    authorized: AuthorizedOrganization = Depends(read_business),
):
    data = get_customer(customer_id, authorized.organization_id)
    if not data:
        raise HTTPException(status_code=404, detail="Customer not found.")
    return data


@app.get("/api/v1/customers/{customer_id}/health")
def customer_health(
    customer_id: str,
    authorized: AuthorizedOrganization = Depends(read_business),
):
    data = get_customer_health(customer_id, authorized.organization_id)
    if not data:
        raise HTTPException(status_code=404, detail="Customer not found.")
    return data


@app.get("/api/v1/customers/{customer_id}/insights")
def customer_insights(
    customer_id: str,
    authorized: AuthorizedOrganization = Depends(read_business),
):
    data = build_customer_insights(customer_id, authorized.organization_id)
    if not data:
        raise HTTPException(status_code=404, detail="Customer not found.")
    return data


@app.get("/api/v1/customers/{customer_id}/churn")
def customer_churn(
    customer_id: str,
    authorized: AuthorizedOrganization = Depends(read_business),
):
    result = calculate_churn_probability(customer_id, authorized.organization_id)
    if result is None:
        raise HTTPException(status_code=404, detail="Customer not found.")
    return result

# ==========================================
# Signals
# ==========================================

def require_self_user_id(user_id: str, authorized: AuthorizedOrganization) -> None:
    if user_id != authorized.user_id:
        raise HTTPException(status_code=404, detail="Resource not found.")


@app.get("/signals/{user_id}")
def signals(
    user_id: str,
    authorized: AuthorizedOrganization = Depends(read_business),
):
    require_self_user_id(user_id, authorized)
    require_event_organization_scope()

# ==========================================
# Insights
# ==========================================

@app.get("/insights/{user_id}")
def insights(
    user_id: str,
    authorized: AuthorizedOrganization = Depends(read_business),
):
    require_self_user_id(user_id, authorized)
    require_event_organization_scope()

# ==========================================
# Autopilot
# ==========================================

@app.get("/autopilot/{user_id}")
def autopilot(
    user_id: str,
    authorized: AuthorizedOrganization = Depends(read_business),
):
    require_self_user_id(user_id, authorized)
    require_event_organization_scope()

# ==========================================
# WebSocket
# ==========================================

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.close(code=1008, reason="WebSocket access is disabled.")

# ==========================================
# Dashboard
# ==========================================

@app.get("/dashboard", response_class=HTMLResponse)
def dashboard():
    return """
    <html>
        <body style="font-family:Arial;background:#0f172a;color:white;padding:40px">
            <h1>AIOS Executive Dashboard API</h1>
            <p>Backend Status: ✅ Running</p>
            <ul>
                <li><a href="/health">Health</a></li>
                <li><a href="/ready">Ready</a></li>
                <li><a href="/api/v1/executive/overview">Executive Overview</a></li>
                <li><a href="/api/v1/memory/company">Company Memory</a></li>
                <li><a href="/api/v1/memory/customers">Customer Memory</a></li>
                <li><a href="/api/v1/memory/decisions">Decision Memory</a></li>
                <li><a href="/api/v1/customers">Customers</a></li>
            </ul>
        </body>
    </html>
    """