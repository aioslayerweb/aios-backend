import logging
from dataclasses import dataclass
from enum import Enum
from typing import Annotated, Callable

from fastapi import Depends, HTTPException, Query, Request, status

from backend.routes.security import VerifiedIdentity, require_verified_identity
from backend.services.organization_memberships import (
    InvalidMembershipData,
    MembershipRepository,
    MembershipRepositoryError,
    OrganizationSelectionDenied,
    resolve_organization_memberships,
)


logger = logging.getLogger("aios.authorization")


class BusinessPermission(str, Enum):
    READ = "business.read"
    CREATE = "business.create"
    UPDATE = "business.update"
    DELETE = "business.delete"


ROLE_PERMISSIONS: dict[str, frozenset[BusinessPermission]] = {
    "org_admin": frozenset(BusinessPermission),
    "member": frozenset({BusinessPermission.READ}),
}


@dataclass(frozen=True)
class AuthorizedOrganization:
    user_id: str
    organization_id: str
    role: str
    permission: BusinessPermission


def require_organization_permission(
    permission: BusinessPermission,
) -> Callable[..., AuthorizedOrganization]:
    def dependency(
        request: Request,
        verified_identity: Annotated[
            VerifiedIdentity, Depends(require_verified_identity)
        ],
        organization_ids: Annotated[list[str] | None, Query(alias="organization_id")] = None,
    ) -> AuthorizedOrganization:
        if organization_ids is not None and len(organization_ids) != 1:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Organization selection is not authorized.",
            )

        repository: MembershipRepository | None = getattr(
            request.app.state, "organization_membership_repository", None
        )
        if repository is None:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Authorization service unavailable.",
            )

        try:
            memberships = repository.list_for_user(verified_identity.sub)
            result = resolve_organization_memberships(
                verified_identity.sub,
                memberships,
                organization_ids[0] if organization_ids else None,
            )
        except OrganizationSelectionDenied as exc:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Organization selection is not authorized.",
            ) from exc
        except (InvalidMembershipData, MembershipRepositoryError) as exc:
            logger.error("Organization authorization lookup failed.")
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Authorization service unavailable.",
            ) from exc

        if result.selection_required or result.selected_organization_id is None:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Active organization membership is required.",
            )

        membership = next(
            (
                entry
                for entry in result.memberships
                if entry.organization_id == result.selected_organization_id
            ),
            None,
        )
        if membership is None or permission not in ROLE_PERMISSIONS.get(
            membership.role, frozenset()
        ):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Organization permission is insufficient.",
            )

        return AuthorizedOrganization(
            user_id=verified_identity.sub,
            organization_id=membership.organization_id,
            role=membership.role,
            permission=permission,
        )

    return dependency
