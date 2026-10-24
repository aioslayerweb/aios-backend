import asyncio
import socket
import unittest
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from unittest.mock import patch

import httpx
import jwt
from cryptography.hazmat.primitives.asymmetric import rsa
from fastapi import FastAPI
from jwt import PyJWKClientError

from backend.routes.organizations import router as organizations_router
from backend.routes.security import VerifiedIdentity, require_verified_identity, router as security_router
from backend.security.identity import IdentityTokenVerifier, VerifierConfig
from backend.services.organization_memberships import (
    MembershipRepositoryError,
    SupabaseMembershipRepository,
)


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
        if jwt.get_unverified_header(token).get("kid") != "membership-test-key":
            raise PyJWKClientError("Unknown local test key.")
        return self.signing_key


class FakeMembershipRepository:
    def __init__(self, records: list[dict[str, object]] | None = None, error: Exception | None = None) -> None:
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
    name: str,
    status: str = "active",
    role: str = "member",
) -> dict[str, object]:
    return {
        "user_id": user_id,
        "organization_id": organization_id,
        "status": status,
        "role": role,
        "organization": {"id": organization_id, "name": name},
    }


class OrganizationMembershipTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.private_key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
        key_provider = LocalKeyProvider(
            LocalSigningKey(cls.private_key.public_key(), "RSA", "RS256")
        )
        cls.verifier = IdentityTokenVerifier(
            VerifierConfig(ISSUER, AUDIENCE, "RS256"),
            key_provider=key_provider,
        )
        cls.network_guard = patch.object(
            socket.socket,
            "connect",
            side_effect=AssertionError("Network access is disabled in membership tests."),
        )
        cls.network_guard.start()

    @classmethod
    def tearDownClass(cls) -> None:
        cls.network_guard.stop()

    def make_app(self, repository: FakeMembershipRepository | None) -> FastAPI:
        app = FastAPI()
        app.state.identity_token_verifier = self.verifier
        if repository is not None:
            app.state.organization_membership_repository = repository
        app.include_router(security_router)
        app.include_router(organizations_router)
        return app

    def token(self, subject: str = USER_ID, *, key: object | None = None) -> str:
        payload = {
            "iss": ISSUER,
            "aud": AUDIENCE,
            "sub": subject,
            "iat": int(NOW.timestamp()),
            "exp": int((NOW + timedelta(minutes=5)).timestamp()),
            "nbf": int((NOW - timedelta(seconds=1)).timestamp()),
        }
        return jwt.encode(
            payload,
            self.private_key if key is None else key,
            algorithm="RS256",
            headers={"kid": "membership-test-key"},
        )

    async def request(
        self,
        repository: FakeMembershipRepository | None,
        *,
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
            transport=httpx.ASGITransport(app=self.make_app(repository)),
            base_url="http://membership.test",
        ) as client:
            return await client.get(f"/api/v1/me/organizations{query}", headers=headers)

    def get(self, repository: FakeMembershipRepository | None, **kwargs: object) -> httpx.Response:
        return asyncio.run(self.request(repository, **kwargs))

    def test_demo_auth_cookie_without_supabase_bearer_is_denied(self) -> None:
        repository = FakeMembershipRepository([membership(USER_ID, ORG_ONE_ID, "Northwind")])
        response = self.get(
            repository,
            cookie="authjs.session-token=synthetic-demo-session",
        )
        self.assertEqual(response.status_code, 401)
        self.assertEqual(repository.requested_users, [])
        self.assertNotIn("memberships", response.json())

    def test_missing_and_invalid_real_user_tokens_are_denied(self) -> None:
        repository = FakeMembershipRepository([membership(USER_ID, ORG_ONE_ID, "Northwind")])
        missing = self.get(repository)
        invalid = self.get(repository, authorization="Bearer not-a-valid-token")
        self.assertEqual(missing.status_code, 401)
        self.assertEqual(invalid.status_code, 401)
        self.assertEqual(repository.requested_users, [])

    def test_lookup_is_scoped_to_verified_subject_not_client_user_email_or_role(self) -> None:
        repository = FakeMembershipRepository([membership(USER_ID, ORG_ONE_ID, "Northwind")])
        response = self.get(
            repository,
            authorization=f"Bearer {self.token()}",
            query=f"?user_id={OTHER_USER_ID}&email=other%40example.test&role=org_admin",
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(repository.requested_users, [USER_ID])
        self.assertEqual(response.json()["memberships"][0]["organization_id"], ORG_ONE_ID)

    def test_pending_suspended_and_revoked_memberships_are_not_authorized(self) -> None:
        repository = FakeMembershipRepository(
            [
                membership(USER_ID, ORG_ONE_ID, "Pending", status="pending"),
                membership(USER_ID, ORG_TWO_ID, "Suspended", status="suspended"),
                membership(USER_ID, "10000000-0000-4000-8000-000000000003", "Revoked", status="revoked"),
            ]
        )
        response = self.get(repository, authorization=f"Bearer {self.token()}")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.json(),
            {
                "memberships": [],
                "selected_organization_id": None,
                "selection_required": False,
            },
        )

    def test_no_membership_returns_no_selected_organization(self) -> None:
        response = self.get(
            FakeMembershipRepository(),
            authorization=f"Bearer {self.token()}",
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["memberships"], [])
        self.assertIsNone(response.json()["selected_organization_id"])

    def test_one_active_membership_is_selected_only_after_server_verification(self) -> None:
        response = self.get(
            FakeMembershipRepository([membership(USER_ID, ORG_ONE_ID, "Northwind", role="org_admin")]),
            authorization=f"Bearer {self.token()}",
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["selected_organization_id"], ORG_ONE_ID)
        self.assertFalse(response.json()["selection_required"])
        self.assertEqual(response.json()["memberships"][0]["role"], "org_admin")

    def test_multiple_active_memberships_require_explicit_selection(self) -> None:
        repository = FakeMembershipRepository(
            [
                membership(USER_ID, ORG_ONE_ID, "Northwind"),
                membership(USER_ID, ORG_TWO_ID, "Helios"),
            ]
        )
        response = self.get(repository, authorization=f"Bearer {self.token()}")
        self.assertEqual(response.status_code, 200)
        self.assertIsNone(response.json()["selected_organization_id"])
        self.assertTrue(response.json()["selection_required"])
        selected = self.get(
            repository,
            authorization=f"Bearer {self.token()}",
            query=f"?organization_id={ORG_TWO_ID}",
        )
        self.assertEqual(selected.status_code, 200)
        self.assertEqual(selected.json()["selected_organization_id"], ORG_TWO_ID)
        self.assertFalse(selected.json()["selection_required"])

    def test_forged_nonexistent_and_inactive_organization_selections_are_denied(self) -> None:
        repository = FakeMembershipRepository(
            [
                membership(USER_ID, ORG_ONE_ID, "Northwind"),
                membership(USER_ID, ORG_TWO_ID, "Suspended", status="suspended"),
            ]
        )
        for organization_id in (
            "10000000-0000-4000-8000-000000000099",
            ORG_TWO_ID,
            "not-a-uuid",
        ):
            with self.subTest(organization_id=organization_id):
                response = self.get(
                    repository,
                    authorization=f"Bearer {self.token()}",
                    query=f"?organization_id={organization_id}",
                )
                self.assertEqual(response.status_code, 403)
                self.assertNotIn("selected_organization_id", response.json())

    def test_unknown_role_or_status_fails_closed(self) -> None:
        for record in (
            membership(USER_ID, ORG_ONE_ID, "Northwind", role="owner"),
            membership(USER_ID, ORG_ONE_ID, "Northwind", status="enabled"),
        ):
            with self.subTest(record=record):
                response = self.get(
                    FakeMembershipRepository([record]),
                    authorization=f"Bearer {self.token()}",
                )
                self.assertEqual(response.status_code, 503)
                self.assertNotIn("memberships", response.json())

    def test_repository_response_for_another_user_fails_closed(self) -> None:
        response = self.get(
            FakeMembershipRepository([membership(OTHER_USER_ID, ORG_ONE_ID, "Other")]),
            authorization=f"Bearer {self.token()}",
        )
        self.assertEqual(response.status_code, 503)
        self.assertNotIn("memberships", response.json())

    def test_membership_query_and_missing_repository_fail_closed(self) -> None:
        query_failure = self.get(
            FakeMembershipRepository(error=MembershipRepositoryError("synthetic query failure")),
            authorization=f"Bearer {self.token()}",
        )
        missing_repository = self.get(
            None,
            authorization=f"Bearer {self.token()}",
        )
        self.assertEqual(query_failure.status_code, 503)
        self.assertEqual(missing_repository.status_code, 503)
        self.assertNotIn("memberships", query_failure.json())

    def test_supabase_repository_filters_by_verified_user_id(self) -> None:
        class Query:
            def __init__(self) -> None:
                self.filter: tuple[str, str] | None = None

            def select(self, columns: str) -> "Query":
                self.columns = columns
                return self

            def eq(self, column: str, value: str) -> "Query":
                self.filter = (column, value)
                return self

            def execute(self) -> object:
                return type("Result", (), {"data": []})()

        query = Query()
        client = type("Client", (), {"table": lambda _self, name: query})()
        result = SupabaseMembershipRepository(client).list_for_user(USER_ID)
        self.assertEqual(result, [])
        self.assertEqual(query.filter, ("user_id", USER_ID))
        self.assertIn("organization_memberships", query.columns)


if __name__ == "__main__":
    unittest.main()
