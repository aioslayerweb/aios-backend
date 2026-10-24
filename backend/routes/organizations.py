import logging
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, Request, status
from pydantic import BaseModel

from backend.routes.security import VerifiedIdentity, require_verified_identity
from backend.services.organization_memberships import (
    InvalidMembershipData,
    MembershipRepository,
    MembershipRepositoryError,
    OrganizationSelectionDenied,
    resolve_organization_memberships,
)


logger = logging.getLogger("aios.organization_memberships")
router = APIRouter()


class OrganizationMembershipResponse(BaseModel):
    organization_id: str
    organization_name: str
    role: str


class MyOrganizationsResponse(BaseModel):
    memberships: list[OrganizationMembershipResponse]
    selected_organization_id: str | None
    selection_required: bool


def _membership_repository(request: Request) -> MembershipRepository:
    repository = getattr(
        request.app.state, "organization_membership_repository", None
    )
    if repository is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Membership service unavailable.",
        )
    return repository


@router.get(
    "/api/v1/me/organizations",
    response_model=MyOrganizationsResponse,
)
def my_organizations(
    request: Request,
    verified_identity: Annotated[
        VerifiedIdentity, Depends(require_verified_identity)
    ],
    organization_id: Annotated[str | None, Query()] = None,
) -> MyOrganizationsResponse:
    repository = _membership_repository(request)
    try:
        records = repository.list_for_user(verified_identity.sub)
        result = resolve_organization_memberships(
            verified_identity.sub,
            records,
            organization_id,
        )
    except OrganizationSelectionDenied as exc:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Organization selection is not authorized.",
        ) from exc
    except (InvalidMembershipData, MembershipRepositoryError) as exc:
        logger.error("Organization membership lookup failed.")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Membership service unavailable.",
        ) from exc

    return MyOrganizationsResponse(
        memberships=[
            OrganizationMembershipResponse(
                organization_id=membership.organization_id,
                organization_name=membership.organization_name,
                role=membership.role,
            )
            for membership in result.memberships
        ],
        selected_organization_id=result.selected_organization_id,
        selection_required=result.selection_required,
    )
