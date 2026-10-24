from dataclasses import dataclass
from typing import Any, Protocol
from uuid import UUID

import httpx
from postgrest.exceptions import APIError


ACTIVE_STATUS = "active"
KNOWN_STATUSES = frozenset({"pending", "active", "suspended", "revoked"})
KNOWN_ROLES = frozenset({"org_admin", "member"})


class MembershipRepository(Protocol):
    def list_for_user(self, user_id: str) -> list[dict[str, Any]]: ...


class InvalidMembershipData(ValueError):
    pass


class OrganizationSelectionDenied(ValueError):
    pass


class MembershipRepositoryError(RuntimeError):
    pass

@dataclass(frozen=True)
class OrganizationMembership:
    organization_id: str
    organization_name: str
    role: str


@dataclass(frozen=True)
class OrganizationMembershipResult:
    memberships: tuple[OrganizationMembership, ...]
    selected_organization_id: str | None
    selection_required: bool


class SupabaseMembershipRepository:
    def __init__(self, client: Any) -> None:
        self._client = client

    def list_for_user(self, user_id: str) -> list[dict[str, Any]]:
        try:
            response = (
                self._client.table("organization_memberships")
                .select(
                    "user_id,organization_id,status,role,"
                    "organization:organizations!organization_memberships_organization_id_fkey(id,name)"
                )
                .eq("user_id", user_id)
                .execute()
            )
        except (APIError, httpx.HTTPError) as exc:
            raise MembershipRepositoryError("Membership query failed.") from exc
        return response.data or []


def resolve_organization_memberships(
    verified_subject: str,
    records: list[dict[str, Any]],
    requested_organization_id: str | None,
) -> OrganizationMembershipResult:
    try:
        verified_user_id = str(UUID(verified_subject))
    except (TypeError, ValueError) as exc:
        raise InvalidMembershipData("Verified subject is not a UUID.") from exc

    memberships: list[OrganizationMembership] = []
    seen_organization_ids: set[str] = set()

    for record in records:
        if not isinstance(record, dict):
            raise InvalidMembershipData("Membership record is malformed.")

        try:
            record_user_id = str(UUID(record["user_id"]))
            organization_id = str(UUID(record["organization_id"]))
        except (KeyError, TypeError, ValueError) as exc:
            raise InvalidMembershipData("Membership identity is malformed.") from exc

        if record_user_id != verified_user_id:
            raise InvalidMembershipData("Membership query returned another user.")

        status = record.get("status")
        role = record.get("role")
        if (
            not isinstance(status, str)
            or status not in KNOWN_STATUSES
            or not isinstance(role, str)
            or role not in KNOWN_ROLES
        ):
            raise InvalidMembershipData("Membership status or role is unsupported.")

        organization = record.get("organization")
        if isinstance(organization, list):
            if len(organization) != 1:
                raise InvalidMembershipData("Organization relation is ambiguous.")
            organization = organization[0]
        if not isinstance(organization, dict):
            raise InvalidMembershipData("Organization relation is missing.")

        try:
            related_organization_id = str(UUID(organization["id"]))
        except (KeyError, TypeError, ValueError) as exc:
            raise InvalidMembershipData("Organization identity is malformed.") from exc

        organization_name = organization.get("name")
        if related_organization_id != organization_id:
            raise InvalidMembershipData("Organization relation does not match membership.")
        if not isinstance(organization_name, str) or not organization_name.strip():
            raise InvalidMembershipData("Organization name is invalid.")

        if status != ACTIVE_STATUS:
            continue
        if organization_id in seen_organization_ids:
            raise InvalidMembershipData("Duplicate organization memberships were returned.")

        seen_organization_ids.add(organization_id)
        memberships.append(
            OrganizationMembership(
                organization_id=organization_id,
                organization_name=organization_name,
                role=role,
            )
        )

    memberships.sort(key=lambda membership: (membership.organization_name.casefold(), membership.organization_id))

    if requested_organization_id is None:
        if len(memberships) == 1:
            selected_organization_id = memberships[0].organization_id
            selection_required = False
        else:
            selected_organization_id = None
            selection_required = len(memberships) > 1
    else:
        try:
            requested_id = str(UUID(requested_organization_id))
        except (TypeError, ValueError) as exc:
            raise OrganizationSelectionDenied("Organization selection is invalid.") from exc

        if requested_id not in seen_organization_ids:
            raise OrganizationSelectionDenied("Organization selection is not authorized.")
        selected_organization_id = requested_id
        selection_required = False

    return OrganizationMembershipResult(
        memberships=tuple(memberships),
        selected_organization_id=selected_organization_id,
        selection_required=selection_required,
    )
