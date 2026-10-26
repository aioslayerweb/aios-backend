import asyncio
import socket
import unittest
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from unittest.mock import patch

import httpx
import jwt
from cryptography.hazmat.primitives.asymmetric import ec, rsa
from fastapi import FastAPI
from jwt import PyJWKClientError

from backend.routes.security import router
from backend.security.identity import (
    IdentityTokenVerifier,
    InvalidAccessToken,
    VerifierConfig,
    VerifierConfigurationError,
)


ISSUER = "https://synthetic-project.supabase.co/auth/v1"
AUDIENCE = "synthetic-api"
SUBJECT = "00000000-0000-4000-8000-000000000001"
NOW = datetime.now(timezone.utc)


@dataclass
class LocalSigningKey:
    key: object
    key_type: str
    algorithm_name: str


class LocalKeyProvider:
    def __init__(self, signing_key: LocalSigningKey) -> None:
        self.signing_key = signing_key
        self.calls = 0

    def get_signing_key_from_jwt(self, token: str) -> LocalSigningKey:
        self.calls += 1
        if jwt.get_unverified_header(token).get("kid") != "local-test-key":
            raise PyJWKClientError("Unknown local test key.")
        return self.signing_key


def claims(**overrides: object) -> dict[str, object]:
    payload: dict[str, object] = {
        "iss": ISSUER,
        "aud": AUDIENCE,
        "sub": SUBJECT,
        "iat": int(NOW.timestamp()),
        "exp": int((NOW + timedelta(minutes=5)).timestamp()),
        "nbf": int((NOW - timedelta(seconds=1)).timestamp()),
    }
    payload.update(overrides)
    return payload


class IdentityAuthTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.private_key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
        cls.other_private_key = rsa.generate_private_key(
            public_exponent=65537, key_size=2048
        )
        cls.ec_private_key = ec.generate_private_key(ec.SECP256R1())
        cls.valid_key = LocalSigningKey(
            key=cls.private_key.public_key(),
            key_type="RSA",
            algorithm_name="RS256",
        )
        cls.local_provider = LocalKeyProvider(cls.valid_key)
        cls.verifier = IdentityTokenVerifier(
            VerifierConfig(ISSUER, AUDIENCE, "RS256"),
            key_provider=cls.local_provider,
        )
        cls.app = FastAPI()
        cls.app.state.identity_token_verifier = cls.verifier
        cls.app.include_router(router)
        cls.transport = httpx.ASGITransport(app=cls.app)
        cls.network_guard = patch.object(
            socket.socket,
            "connect",
            side_effect=AssertionError("Network access is disabled in identity tests."),
        )
        cls.network_guard.start()

    @classmethod
    def tearDownClass(cls) -> None:
        cls.network_guard.stop()

    def setUp(self) -> None:
        self.local_provider.calls = 0

    def encode(
        self,
        payload: dict[str, object] | None = None,
        key: object | None = None,
        algorithm: str = "RS256",
    ) -> str:
        signing_key = (
            "synthetic-hs256-test-secret-long-enough-for-local-test"
            if algorithm == "HS256"
            else self.private_key if key is None else key
        )
        return jwt.encode(
            claims() if payload is None else payload,
            signing_key,
            algorithm=algorithm,
            headers={"kid": "local-test-key"},
        )

    async def request(self, authorization: str | None) -> httpx.Response:
        headers = {} if authorization is None else {"Authorization": authorization}
        async with httpx.AsyncClient(
            transport=self.transport, base_url="http://identity.test"
        ) as client:
            return await client.get("/api/v1/security/identity", headers=headers)

    def get(self, authorization: str | None) -> httpx.Response:
        return asyncio.run(self.request(authorization))

    def assert_denied_without_identity(self, response: httpx.Response) -> None:
        self.assertIn(response.status_code, (401, 503))
        self.assertNotIn("sub", response.json())
        self.assertNotIn("identity", response.json())
        self.assertNotIn("business_data", response.json())

    def test_valid_token_returns_only_verified_subject(self) -> None:
        response = self.get(f"Bearer {self.encode()}")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"sub": SUBJECT})
        self.assertEqual(set(response.json()), {"sub"})

    def test_missing_authorization_header_is_denied(self) -> None:
        self.assert_denied_without_identity(self.get(None))

    def test_malformed_bearer_headers_are_denied(self) -> None:
        for header in ("Basic abc", "Bearer", "Bearer one two"):
            with self.subTest(header=header):
                self.assert_denied_without_identity(self.get(header))

    def test_malformed_token_is_denied(self) -> None:
        self.assert_denied_without_identity(self.get("Bearer not-a-jwt"))

    def test_invalid_signature_is_denied(self) -> None:
        token = self.encode(key=self.other_private_key)
        response = self.get(f"Bearer {token}")
        self.assertEqual(response.status_code, 401)
        self.assert_denied_without_identity(response)

    def test_expired_token_is_denied(self) -> None:
        token = self.encode(
            claims(exp=int((NOW - timedelta(seconds=1)).timestamp()))
        )
        response = self.get(f"Bearer {token}")
        self.assertEqual(response.status_code, 401)
        self.assert_denied_without_identity(response)

    def test_not_yet_valid_token_is_denied(self) -> None:
        token = self.encode(
            claims(nbf=int((NOW + timedelta(minutes=5)).timestamp()))
        )
        self.assert_denied_without_identity(self.get(f"Bearer {token}"))

    def test_wrong_issuer_is_denied(self) -> None:
        token = self.encode(claims(iss="https://wrong.example/auth/v1"))
        self.assert_denied_without_identity(self.get(f"Bearer {token}"))

    def test_wrong_audience_is_denied(self) -> None:
        token = self.encode(claims(aud="another-api"))
        self.assert_denied_without_identity(self.get(f"Bearer {token}"))

    def test_missing_subject_is_denied(self) -> None:
        payload = claims()
        payload.pop("sub")
        self.assert_denied_without_identity(self.get(f"Bearer {self.encode(payload)}"))

    def test_empty_or_non_string_subject_is_denied(self) -> None:
        for subject in ("", "   ", 123):
            with self.subTest(subject=subject):
                token = self.encode(claims(sub=subject))
                self.assert_denied_without_identity(self.get(f"Bearer {token}"))

    def test_unsupported_algorithm_is_denied_before_key_lookup(self) -> None:
        token = self.encode(algorithm="HS256")
        self.assert_denied_without_identity(self.get(f"Bearer {token}"))
        self.assertEqual(self.local_provider.calls, 0)

    def test_incompatible_signing_key_type_is_denied(self) -> None:
        provider = LocalKeyProvider(
            LocalSigningKey(self.ec_private_key.public_key(), "EC", "ES256")
        )
        verifier = IdentityTokenVerifier(
            VerifierConfig(ISSUER, AUDIENCE, "RS256"), key_provider=provider
        )
        with self.assertRaises(InvalidAccessToken):
            verifier.verify(self.encode())

    def test_weak_rsa_signing_key_is_denied(self) -> None:
        weak_private_key = rsa.generate_private_key(
            public_exponent=65537, key_size=1024
        )
        provider = LocalKeyProvider(
            LocalSigningKey(weak_private_key.public_key(), "RSA", "RS256")
        )
        verifier = IdentityTokenVerifier(
            VerifierConfig(ISSUER, AUDIENCE, "RS256"), key_provider=provider
        )
        with self.assertRaises(InvalidAccessToken):
            verifier.verify(self.encode())

    def test_unknown_key_identifier_is_denied(self) -> None:
        token = jwt.encode(
            claims(),
            self.private_key,
            algorithm="RS256",
            headers={"kid": "unknown-test-key"},
        )
        self.assert_denied_without_identity(self.get(f"Bearer {token}"))

    def test_missing_configuration_fails_closed(self) -> None:
        with self.assertRaises(VerifierConfigurationError):
            VerifierConfig.from_environment({})

    def test_invalid_configuration_fails_closed(self) -> None:
        invalid_configs = (
            {"issuer": "http://synthetic-project.supabase.co/auth/v1"},
            {"issuer": "https://synthetic-project.supabase.co/auth/v1/"},
            {"audience": ""},
            {"algorithm": "HS256"},
        )
        for override in invalid_configs:
            values = {
                "AIOS_SUPABASE_JWT_ISSUER": ISSUER,
                "AIOS_SUPABASE_JWT_AUDIENCE": AUDIENCE,
                "AIOS_SUPABASE_JWT_ALGORITHM": "RS256",
            }
            values.update(
                {
                    {
                        "issuer": "AIOS_SUPABASE_JWT_ISSUER",
                        "audience": "AIOS_SUPABASE_JWT_AUDIENCE",
                        "algorithm": "AIOS_SUPABASE_JWT_ALGORITHM",
                    }[name]: value
                    for name, value in override.items()
                }
            )
            with self.subTest(override=override):
                with self.assertRaises(VerifierConfigurationError):
                    VerifierConfig.from_environment(values)

    def test_missing_runtime_configuration_returns_service_error(self) -> None:
        app = FastAPI()
        app.include_router(router)
        transport = httpx.ASGITransport(app=app)

        async def make_request() -> httpx.Response:
            async with httpx.AsyncClient(
                transport=transport, base_url="http://identity.test"
            ) as client:
                with patch.dict(
                    "os.environ",
                    {
                        "AIOS_SUPABASE_JWT_ISSUER": "",
                        "AIOS_SUPABASE_JWT_AUDIENCE": "",
                        "AIOS_SUPABASE_JWT_ALGORITHM": "",
                    },
                    clear=False,
                ):
                    return await client.get(
                        "/api/v1/security/identity",
                        headers={"Authorization": f"Bearer {self.encode()}"},
                    )

        self.assert_denied_without_identity(asyncio.run(make_request()))


if __name__ == "__main__":
    unittest.main()
