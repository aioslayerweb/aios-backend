import asyncio
import socket
import unittest
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from unittest.mock import patch

import httpx
import jwt
from cryptography.hazmat.primitives.asymmetric import rsa
from fastapi import Depends, FastAPI
from jwt import PyJWKClientError

from backend.routes.security import router as security_router
from backend.security.authorization import (
    AuthorizedOrganization,
    BusinessPermission,
    require_organization_permission,
)
from backend.security.identity import IdentityTokenVerifier, VerifierConfig
from backend.services.organization_memberships import MembershipRepositoryError


ISSUER = "https://synthetic-project.supabase.co/auth/v1"
AUDIENCE = "synthetic-api"
USER_ID = "00000000-0000-4000-8000-000000000001"
OTHER_USER_ID = "00000000-0000-4000-8000-000000000002"
ORG_ONE_ID = "10000000-0000-4000-8000-000000000001"
ORG_TWO_ID = "10000000-0000-4000-8000-000000000002"
NOW = datetime.now(timezone.utc)


@dataclass
class LocalSigningKey:
    key: object
    key_type: str
    algorithm_name: str


class LocalKeyProvider:
    def __init__(self, signing_key: LocalSigningKey) -> None:
        self.signing_key = signing_key

    def get_signing_key_from_jwt(self, token: str) -> LocalSigningKey:
        if jwt.get_unverified_header(token).get("kid") != "authorization-test-key":
            raise PyJWKClientError("Unknown local test key.")
        return self.signing_key


class FakeMembershipRepository:
    def __init__(
        self,
        records: list[dict[str, object]] | None = None,
        error: Exception | None = None,
    ) -> None:
        self.records = records or []
        self.error = error
        self.requested_users: list[str] = []

    def list_for_user(self, user_id: str) -> list[dict[str, object]]:
        self.requested_users.append(user_id)
        if self.error:
            raise self.error
        return self.records


def membership(
    user_id: str,
    organization_id: str,
    *,
    status: str = "active",
    role: str = "member",
) -> dict[str, object]:
    return {
        "user_id": user_id,
        "organization_id": organization_id,
        "status": status,
        "role": role,
        "organization": {
            "id": organization_id,
            "name": f"Organization {organization_id[-1]}",
        },
    }


class OrganizationAuthorizationTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.private_key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
        provider = LocalKeyProvider(
            LocalSigningKey(cls.private_key.public_key(), "RSA", "RS256")
        )
        cls.verifier = IdentityTokenVerifier(
            VerifierConfig(ISSUER, AUDIENCE, "RS256"),
            key_provider=provider,
        )
        cls.network_guard = patch.object(
            socket.socket,
            "connect",
            side_effect=AssertionError("Network access is disabled in authorization tests."),
        )
        cls.network_guard.start()

    @classmethod
    def tearDownClass(cls) -> None:
        cls.network_guard.stop()

    def make_app(
        self,
        repository: FakeMembershipRepository | None,
        permission: BusinessPermission = BusinessPermission.READ,
    ) -> FastAPI:
        app = FastAPI()
        app.state.identity_token_verifier = self.verifier
        if repository is not None:
            app.state.organization_membership_repository = repository
        app.include_router(security_router)

        @app.get("/protected")
        def protected(
            authorized: AuthorizedOrganization = Depends(
                require_organization_permission(permission)
            ),
        ) -> dict[str, str]:
            return {"organization_id": authorized.organization_id}

        return app

    def token(self, subject: str = USER_ID, *, valid: bool = True) -> str:
        payload = {
            "iss": ISSUER,
            "aud": AUDIENCE,
            "sub": subject,
            "iat": int(NOW.timestamp()),
            "exp": int((NOW + timedelta(minutes=5)).timestamp()),
            "nbf": int((NOW - timedelta(seconds=1)).timestamp()),
        }
        signing_key = self.private_key
        if not valid:
            signing_key = rsa.generate_private_key(
                public_exponent=65537, key_size=2048
            )
        return jwt.encode(
            payload,
            signing_key,
            algorithm="RS256",
            headers={"kid": "authorization-test-key"},
        )

    async def request(
        self,
        repository: FakeMembershipRepository | None,
        *,
        permission: BusinessPermission = BusinessPermission.READ,
        authorization: str | None = None,
        query: str = "",
        cookie: str | None = None,
    ) -> httpx.Response:
        headers: dict[str, str] = {}
        if authorization is not None:
            headers["Authorization"] = authorization
        if cookie is not None:
            headers["Cookie"] = cookie
        async with httpx.AsyncClient(
            transport=httpx.ASGITransport(
                app=self.make_app(repository, permission)
            ),
            base_url="http://authorization.test",
        ) as client:
            return await client.get(f"/protected{query}", headers=headers)

    def get(
        self,
        repository: FakeMembershipRepository | None,
        **kwargs: object,
    ) -> httpx.Response:
        return asyncio.run(self.request(repository, **kwargs))

    def test_missing_and_invalid_verified_identity_are_denied_before_lookup(self) -> None:
        repository = FakeMembershipRepository(
            [membership(USER_ID, ORG_ONE_ID)]
        )
        missing = self.get(repository)
        invalid = self.get(repository, authorization=f"Bearer {self.token(valid=False)}")
        self.assertEqual(missing.status_code, 401)
        self.assertEqual(invalid.status_code, 401)
        self.assertEqual(repository.requested_users, [])

    def test_demo_auth_cookie_cannot_establish_protected_identity(self) -> None:
        repository = FakeMembershipRepository(
            [membership(USER_ID, ORG_ONE_ID)]
        )
        response = self.get(
            repository,
            cookie="authjs.session-token=synthetic-demo-session",
        )
        self.assertEqual(response.status_code, 401)
        self.assertEqual(repository.requested_users, [])

    def test_membership_lookup_uses_only_the_verified_subject(self) -> None:
        repository = FakeMembershipRepository(
            [membership(USER_ID, ORG_ONE_ID)]
        )
        response = self.get(
            repository,
            authorization=f"Bearer {self.token()}",
            query=f"?user_id={OTHER_USER_ID}&organization_id={ORG_ONE_ID}",
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(repository.requested_users, [USER_ID])
        self.assertEqual(response.json(), {"organization_id": ORG_ONE_ID})

    def test_no_active_suspended_and_revoked_memberships_are_denied(self) -> None:
        cases = (
            [],
            [membership(USER_ID, ORG_ONE_ID, status="suspended")],
            [membership(USER_ID, ORG_ONE_ID, status="revoked")],
        )
        for records in cases:
            with self.subTest(records=records):
                response = self.get(
                    FakeMembershipRepository(records),
                    authorization=f"Bearer {self.token()}",
                )
                self.assertEqual(response.status_code, 403)

    def test_single_active_membership_is_server_selected(self) -> None:
        response = self.get(
            FakeMembershipRepository([membership(USER_ID, ORG_ONE_ID)]),
            authorization=f"Bearer {self.token()}",
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"organization_id": ORG_ONE_ID})

    def test_multiple_memberships_require_explicit_active_membership_selection(self) -> None:
        repository = FakeMembershipRepository(
            [
                membership(USER_ID, ORG_ONE_ID),
                membership(USER_ID, ORG_TWO_ID),
            ]
        )
        missing_selection = self.get(
            repository,
            authorization=f"Bearer {self.token()}",
        )
        invalid_selection = self.get(
            repository,
            authorization=f"Bearer {self.token()}",
            query="?organization_id=10000000-0000-4000-8000-000000000099",
        )
        inactive_selection = self.get(
            FakeMembershipRepository(
                [
                    membership(USER_ID, ORG_ONE_ID),
                    membership(USER_ID, ORG_TWO_ID, status="revoked"),
                ]
            ),
            authorization=f"Bearer {self.token()}",
            query=f"?organization_id={ORG_TWO_ID}",
        )
        repeated_selection = self.get(
            repository,
            authorization=f"Bearer {self.token()}",
            query=f"?organization_id={ORG_ONE_ID}&organization_id={ORG_TWO_ID}",
        )
        self.assertEqual(missing_selection.status_code, 403)
        self.assertEqual(invalid_selection.status_code, 403)
        self.assertEqual(inactive_selection.status_code, 403)
        self.assertEqual(repeated_selection.status_code, 403)

    def test_member_is_read_only_and_admin_has_approved_business_permissions(self) -> None:
        member_repository = FakeMembershipRepository(
            [membership(USER_ID, ORG_ONE_ID, role="member")]
        )
        for permission in (
            BusinessPermission.CREATE,
            BusinessPermission.UPDATE,
            BusinessPermission.DELETE,
        ):
            with self.subTest(permission=permission):
                response = self.get(
                    member_repository,
                    permission=permission,
                    authorization=f"Bearer {self.token()}",
                )
                self.assertEqual(response.status_code, 403)

        admin_repository = FakeMembershipRepository(
            [membership(USER_ID, ORG_ONE_ID, role="org_admin")]
        )
        for permission in BusinessPermission:
            with self.subTest(permission=permission):
                response = self.get(
                    admin_repository,
                    permission=permission,
                    authorization=f"Bearer {self.token()}",
                )
                self.assertEqual(response.status_code, 200)

    def test_unknown_roles_malformed_data_and_query_failures_deny(self) -> None:
        unknown_role = self.get(
            FakeMembershipRepository(
                [membership(USER_ID, ORG_ONE_ID, role="owner")]
            ),
            authorization=f"Bearer {self.token()}",
        )
        mismatched_user = self.get(
            FakeMembershipRepository(
                [membership(OTHER_USER_ID, ORG_ONE_ID)]
            ),
            authorization=f"Bearer {self.token()}",
        )
        query_failure = self.get(
            FakeMembershipRepository(
                error=MembershipRepositoryError("synthetic database failure")
            ),
            authorization=f"Bearer {self.token()}",
        )
        missing_repository = self.get(
            None,
            authorization=f"Bearer {self.token()}",
        )
        self.assertEqual(unknown_role.status_code, 503)
        self.assertEqual(mismatched_user.status_code, 503)
        self.assertEqual(query_failure.status_code, 503)
        self.assertEqual(missing_repository.status_code, 503)
        self.assertNotIn("database failure", query_failure.text)


if __name__ == "__main__":
    unittest.main()
