import asyncio
import json
import sys
import types
import unittest
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from unittest.mock import patch

import httpx
import jwt
from cryptography.hazmat.primitives.asymmetric import rsa


ISSUER = "https://synthetic-project.supabase.co/auth/v1"
AUDIENCE = "synthetic-api"
USER_A = "00000000-0000-4000-8000-000000000001"
USER_B = "00000000-0000-4000-8000-000000000002"
ORG_A = "10000000-0000-4000-8000-000000000001"
ORG_B = "10000000-0000-4000-8000-000000000002"
CUSTOMER_A = "20000000-0000-4000-8000-000000000001"
CUSTOMER_B = "20000000-0000-4000-8000-000000000002"
CUSTOMER_UNMAPPED = "20000000-0000-4000-8000-000000000003"


@dataclass
class LocalSigningKey:
    key: object
    key_type: str = "RSA"
    algorithm_name: str = "RS256"


class LocalKeyProvider:
    def __init__(self, signing_key: LocalSigningKey) -> None:
        self.signing_key = signing_key

    def get_signing_key_from_jwt(self, token: str) -> LocalSigningKey:
        if jwt.get_unverified_header(token).get("kid") != "protected-api-test-key":
            raise jwt.PyJWKClientError("Unknown test signing key.")
        return self.signing_key


class FakeMembershipRepository:
    def __init__(
        self,
        records: list[dict[str, object]],
        operations: list[str] | None = None,
    ) -> None:
        self.records = records
        self.requested_users: list[str] = []
        self.calls: list[str] = []
        self.operations = operations

    def list_for_user(self, user_id: str) -> list[dict[str, object]]:
        self.calls.append("membership")
        if self.operations is not None:
            self.operations.append("membership")
        self.requested_users.append(user_id)
        return [
            record for record in self.records
            if record["user_id"] == user_id
        ]


class FakeQuery:
    def __init__(self, client: "FakeSupabase", table: str) -> None:
        self.client = client
        self.table = table
        self.filters: list[tuple[str, str]] = []

    def select(self, _columns: str) -> "FakeQuery":
        return self

    def eq(self, column: str, value: str) -> "FakeQuery":
        self.filters.append((column, value))
        return self

    def order(self, _column: str) -> "FakeQuery":
        return self

    def limit(self, _count: int) -> "FakeQuery":
        return self

    def execute(self) -> object:
        self.client.calls.append("data")
        self.client.operations.append("data")
        self.client.queries.append((self.table, tuple(self.filters)))
        rows = self.client.rows.get(self.table, [])
        for column, value in self.filters:
            rows = [row for row in rows if str(row.get(column)) == value]
        return types.SimpleNamespace(data=rows)


class FakeSupabase:
    def __init__(self) -> None:
        self.calls: list[str] = []
        self.operations: list[str] = []
        self.queries: list[tuple[str, tuple[tuple[str, str], ...]]] = []
        self.rows: dict[str, list[dict[str, object]]] = {
            "customers": [
                {
                    "id": CUSTOMER_A,
                    "organization_id": ORG_A,
                    "company_name": "Synthetic Tenant A",
                    "health_score": 90,
                    "churn_risk": "low",
                    "annual_revenue": 1000000,
                    "contract_value": 25000,
                    "lifecycle_stage": "customer",
                },
                {
                    "id": CUSTOMER_B,
                    "organization_id": ORG_B,
                    "company_name": "Synthetic Tenant B Private",
                    "health_score": 40,
                    "churn_risk": "high",
                    "annual_revenue": 2000000,
                    "contract_value": 50000,
                    "lifecycle_stage": "customer",
                },
                {
                    "id": CUSTOMER_UNMAPPED,
                    "organization_id": None,
                    "company_name": "Unmapped Synthetic Record",
                    "health_score": 50,
                    "churn_risk": "medium",
                    "annual_revenue": 100000,
                    "contract_value": 1000,
                    "lifecycle_stage": "prospect",
                },
            ],
            "events": [
                {"id": "event-a", "user_id": USER_A, "event_name": "synthetic-a"},
                {"id": "event-b", "user_id": USER_B, "event_name": "synthetic-b"},
            ],
        }

    def table(self, table: str) -> FakeQuery:
        return FakeQuery(self, table)


_supabase_stub = types.ModuleType("supabase_client")
_supabase_stub.supabase = None
with patch.dict(sys.modules, {"supabase_client": _supabase_stub}):
    import main
    import main_backup
    import services.customer_ai as customer_ai
    import services.customer_engine as customer_engine

from backend.security.identity import IdentityTokenVerifier, VerifierConfig
from backend.services.organization_memberships import SupabaseMembershipRepository


class ProtectedApiTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.private_key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
        cls.verifier = IdentityTokenVerifier(
            VerifierConfig(ISSUER, AUDIENCE, "RS256"),
            key_provider=LocalKeyProvider(
                LocalSigningKey(cls.private_key.public_key())
            ),
        )
        main.app.state.identity_token_verifier = cls.verifier

    def setUp(self) -> None:
        self.database = FakeSupabase()
        self.repository = FakeMembershipRepository(
            [
                {
                    "user_id": USER_A,
                    "organization_id": ORG_A,
                    "status": "active",
                    "role": "member",
                    "organization": {"id": ORG_A, "name": "Synthetic Tenant A"},
                },
                {
                    "user_id": USER_B,
                    "organization_id": ORG_B,
                    "status": "active",
                    "role": "org_admin",
                    "organization": {"id": ORG_B, "name": "Synthetic Tenant B"},
                },
            ],
            operations=self.database.operations,
        )
        main.app.state.organization_membership_repository = self.repository
        main.supabase = self.database
        main_backup.supabase = self.database
        customer_engine.supabase = self.database
        customer_ai.supabase = self.database

    async def request_legacy(self, path: str) -> httpx.Response:
        async with httpx.AsyncClient(
            transport=httpx.ASGITransport(app=main_backup.app),
            base_url="http://synthetic-legacy-api.test",
        ) as client:
            return await client.get(path)

    def token(
        self,
        subject: str = USER_A,
        *,
        expires_at: datetime | None = None,
    ) -> str:
        now = datetime.now(timezone.utc)
        payload = {
            "iss": ISSUER,
            "aud": AUDIENCE,
            "sub": subject,
            "iat": int(now.timestamp()),
            "exp": int((expires_at or now + timedelta(minutes=5)).timestamp()),
            "nbf": int((now - timedelta(seconds=1)).timestamp()),
        }
        return jwt.encode(
            payload,
            self.private_key,
            algorithm="RS256",
            headers={"kid": "protected-api-test-key"},
        )

    async def request(
        self,
        path: str,
        *,
        token: str | None = None,
        cookie: str | None = None,
        method: str = "GET",
    ) -> httpx.Response:
        headers: dict[str, str] = {}
        if token is not None:
            headers["Authorization"] = f"Bearer {token}"
        if cookie is not None:
            headers["Cookie"] = cookie
        async with httpx.AsyncClient(
            transport=httpx.ASGITransport(app=main.app),
            base_url="http://synthetic-api.test",
        ) as client:
            return await client.request(method, path, headers=headers)

    def get(self, path: str, **kwargs: object) -> httpx.Response:
        return asyncio.run(self.request(path, **kwargs))

    def test_unauthenticated_and_demo_cookie_requests_cannot_read_customers(self) -> None:
        protected_paths = (
            "/api/v1/executive/overview",
            "/api/v1/memory/company",
            "/api/v1/memory/customers",
            "/api/v1/memory/decisions",
            "/api/v1/customers",
            f"/api/v1/customers/{CUSTOMER_A}",
            f"/api/v1/customers/{CUSTOMER_A}/health",
            f"/api/v1/customers/{CUSTOMER_A}/insights",
            f"/api/v1/customers/{CUSTOMER_A}/churn",
            f"/signals/{USER_A}",
            f"/insights/{USER_A}",
            f"/autopilot/{USER_A}",
        )
        for path in protected_paths:
            with self.subTest(path=path):
                response = self.get(path)
                self.assertEqual(response.status_code, 401)
                self.assertNotIn("customers", response.json())
                self.assertNotIn("events", response.json())

        demo_cookie = self.get(
            "/api/v1/customers",
            cookie="authjs.session-token=synthetic-demo-session",
        )
        self.assertEqual(demo_cookie.status_code, 401)
        self.assertNotIn("customers", demo_cookie.json())
        self.assertEqual(self.repository.requested_users, [])
        self.assertEqual(self.database.queries, [])

    def test_membership_is_resolved_from_verified_subject_and_missing_membership_is_denied(self) -> None:
        unauthorized_subject = "00000000-0000-4000-8000-000000000099"
        no_membership = self.get(
            "/api/v1/customers",
            token=self.token(unauthorized_subject),
        )
        attempted_tenant_switch = self.get(
            f"/api/v1/customers?organization_id={ORG_B}",
            token=self.token(USER_A),
        )
        self.assertEqual(no_membership.status_code, 403)
        self.assertEqual(attempted_tenant_switch.status_code, 403)
        self.assertNotIn("customers", no_membership.json())
        self.assertNotIn("customers", attempted_tenant_switch.json())
        self.assertEqual(self.repository.requested_users, [unauthorized_subject, USER_A])
        self.assertEqual(self.database.queries, [])

    def test_customer_list_and_detail_queries_are_tenant_scoped(self) -> None:
        listed = self.get("/api/v1/customers", token=self.token(USER_A))
        self.assertEqual(listed.status_code, 200)
        self.assertEqual(
            [customer["id"] for customer in listed.json()["customers"]],
            [CUSTOMER_A],
        )
        self.assertIn(("organization_id", ORG_A), self.database.queries[-1][1])

        cross_tenant_detail = self.get(
            f"/api/v1/customers/{CUSTOMER_B}",
            token=self.token(USER_A),
        )
        self.assertEqual(cross_tenant_detail.status_code, 404)
        self.assertEqual(cross_tenant_detail.json(), {"detail": "Customer not found."})
        self.assertIn(("id", CUSTOMER_B), self.database.queries[-1][1])
        self.assertIn(("organization_id", ORG_A), self.database.queries[-1][1])
        self.assertNotIn("Synthetic Tenant B Private", cross_tenant_detail.text)

    def test_unmapped_customer_records_are_not_exposed(self) -> None:
        response = self.get(
            f"/api/v1/customers/{CUSTOMER_UNMAPPED}",
            token=self.token(USER_A),
        )
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json(), {"detail": "Customer not found."})
        self.assertIn(("organization_id", ORG_A), self.database.queries[-1][1])
        self.assertNotIn("Unmapped Synthetic Record", response.text)

    def test_customer_detail_and_derived_endpoints_scope_every_database_lookup(self) -> None:
        paths = (
            f"/api/v1/customers/{CUSTOMER_B}/health",
            f"/api/v1/customers/{CUSTOMER_B}/insights",
            f"/api/v1/customers/{CUSTOMER_B}/churn",
        )
        for path in paths:
            with self.subTest(path=path):
                response = self.get(path, token=self.token(USER_A))
                self.assertEqual(response.status_code, 404)
                self.assertEqual(response.json(), {"detail": "Customer not found."})
                self.assertIn(("organization_id", ORG_A), self.database.queries[-1][1])
                self.assertNotIn("Synthetic Tenant B Private", response.text)

    def test_user_path_ids_cannot_read_another_users_events(self) -> None:
        response = self.get(f"/insights/{USER_B}", token=self.token(USER_A))
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json(), {"detail": "Resource not found."})
        self.assertNotIn("event-b", response.text)
        self.assertNotIn("data", self.database.calls)

        own_events = self.get(f"/insights/{USER_A}", token=self.token(USER_A))
        self.assertEqual(own_events.status_code, 503)
        self.assertEqual(
            own_events.json(),
            {"detail": "Event organization scope is not configured."},
        )
        self.assertNotIn("data", self.database.calls)

    def test_event_summary_routes_fail_closed_without_organization_ownership(self) -> None:
        paths = (
            "/api/v1/executive/overview",
            f"/signals/{USER_A}",
            f"/insights/{USER_A}",
            f"/autopilot/{USER_A}",
        )
        for path in paths:
            with self.subTest(path=path):
                response = self.get(path, token=self.token(USER_A))
                self.assertEqual(response.status_code, 503)
                self.assertEqual(
                    response.json(),
                    {"detail": "Event organization scope is not configured."},
                )
                self.assertNotIn("event-a", response.text)
                self.assertNotIn("event-b", response.text)
        self.assertEqual(self.database.queries, [])

    def test_primary_websocket_is_disabled_before_accept_or_message_processing(self) -> None:
        async def connect(headers: list[tuple[bytes, bytes]], query: bytes) -> tuple[list[dict[str, object]], int]:
            messages: list[dict[str, object]] = []
            received_count = 0

            async def receive() -> dict[str, object]:
                nonlocal received_count
                received_count += 1
                if received_count == 1:
                    return {"type": "websocket.connect"}
                return {
                    "type": "websocket.receive",
                    "text": json.dumps({"organization_id": ORG_B, "message": "synthetic"}),
                }

            async def send(message: dict[str, object]) -> None:
                messages.append(message)

            scope: dict[str, object] = {
                "type": "websocket",
                "asgi": {"version": "3.0", "spec_version": "2.3"},
                "http_version": "1.1",
                "scheme": "ws",
                "server": ("synthetic-api.test", 80),
                "client": ("synthetic-client", 1234),
                "root_path": "",
                "path": "/ws",
                "raw_path": b"/ws",
                "query_string": query,
                "headers": headers,
                "subprotocols": [],
                "state": {},
            }
            await main.app(scope, receive, send)
            return messages, received_count

        unauthenticated, unauthenticated_reads = asyncio.run(connect([], b""))
        authenticated, authenticated_reads = asyncio.run(
            connect(
                [(b"authorization", f"Bearer {self.token(USER_A)}".encode())],
                f"organization_id={ORG_A}".encode(),
            )
        )
        forged_tenant, forged_tenant_reads = asyncio.run(
            connect([], f"organization_id={ORG_B}".encode())
        )

        expected_close = [{
            "type": "websocket.close",
            "code": 1008,
            "reason": "WebSocket access is disabled.",
        }]
        self.assertEqual(unauthenticated, expected_close)
        self.assertEqual(authenticated, expected_close)
        self.assertEqual(forged_tenant, expected_close)
        self.assertEqual(
            (unauthenticated_reads, authenticated_reads, forged_tenant_reads),
            (0, 0, 0),
        )
        self.assertEqual(self.repository.calls, [])
        self.assertEqual(self.database.queries, [])

    def test_legacy_service_role_routes_and_websocket_fail_closed(self) -> None:
        for path in (
            f"/timeline/{USER_A}",
            f"/autopilot/{USER_A}",
            "/autopilot/global",
        ):
            with self.subTest(path=path):
                response = asyncio.run(self.request_legacy(path))
                self.assertEqual(response.status_code, 503)
                self.assertEqual(
                    response.json(),
                    {"detail": "Organization scope is not configured."},
                )

        sent_messages: list[dict[str, object]] = []

        async def receive() -> dict[str, object]:
            return {"type": "websocket.connect"}

        async def send(message: dict[str, object]) -> None:
            sent_messages.append(message)

        scope: dict[str, object] = {
            "type": "websocket",
            "asgi": {"version": "3.0", "spec_version": "2.3"},
            "http_version": "1.1",
            "scheme": "ws",
            "server": ("synthetic-legacy-api.test", 80),
            "client": ("synthetic-client", 1234),
            "root_path": "",
            "path": "/ws/autopilot",
            "raw_path": b"/ws/autopilot",
            "query_string": b"",
            "headers": [],
            "subprotocols": [],
            "state": {},
        }
        asyncio.run(main_backup.app(scope, receive, send))
        self.assertEqual(
            sent_messages,
            [{
                "type": "websocket.close",
                "code": 1013,
                "reason": "Organization-scoped event ingestion is not configured.",
            }],
        )
        self.assertEqual(self.database.queries, [])

    def test_member_can_read_but_no_customer_write_endpoint_is_exposed(self) -> None:
        read_response = self.get("/api/v1/customers", token=self.token(USER_A))
        write_response = self.get(
            f"/api/v1/customers/{CUSTOMER_A}",
            token=self.token(USER_A),
            method="DELETE",
        )
        self.assertEqual(read_response.status_code, 200)
        self.assertEqual(write_response.status_code, 405)
        self.assertNotIn("data", self.database.calls[1:])

    def test_privileged_customer_reads_follow_auth_membership_and_tenant_filters(self) -> None:
        response = self.get("/api/v1/customers", token=self.token(USER_A))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(self.database.calls, ["data"])
        self.assertEqual(self.repository.calls, ["membership"])
        self.assertEqual(self.repository.requested_users, [USER_A])
        self.assertEqual(self.database.operations, ["membership", "data"])
        self.assertIn(("organization_id", ORG_A), self.database.queries[0][1])

if __name__ == "__main__":
    unittest.main()
