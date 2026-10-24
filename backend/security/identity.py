import os
from dataclasses import dataclass
from typing import Mapping, Protocol
from urllib.parse import urlsplit

import jwt
from jwt import PyJWKClient, PyJWKClientError


_ALGORITHM_KEY_TYPES = {
    "ES256": "EC",
    "RS256": "RSA",
}


class VerifierConfigurationError(ValueError):
    pass


class InvalidAccessToken(ValueError):
    pass


@dataclass(frozen=True)
class VerifierConfig:
    issuer: str
    audience: str
    algorithm: str

    def __post_init__(self) -> None:
        if not self.issuer or not self.audience:
            raise VerifierConfigurationError("Issuer and audience are required.")

        issuer_url = urlsplit(self.issuer)
        if (
            issuer_url.scheme != "https"
            or not issuer_url.hostname
            or issuer_url.username
            or issuer_url.password
            or issuer_url.query
            or issuer_url.fragment
            or issuer_url.path != "/auth/v1"
        ):
            raise VerifierConfigurationError("Issuer must be a trusted HTTPS Supabase Auth issuer.")

        if self.algorithm not in _ALGORITHM_KEY_TYPES:
            raise VerifierConfigurationError("Unsupported signing algorithm.")

    @property
    def jwks_url(self) -> str:
        return f"{self.issuer}/.well-known/jwks.json"

    @classmethod
    def from_environment(
        cls, environment: Mapping[str, str] | None = None
    ) -> "VerifierConfig":
        values = os.environ if environment is None else environment
        issuer = values.get("AIOS_SUPABASE_JWT_ISSUER", "")
        audience = values.get("AIOS_SUPABASE_JWT_AUDIENCE", "")
        algorithm = values.get("AIOS_SUPABASE_JWT_ALGORITHM", "")
        if not issuer or not audience or not algorithm:
            raise VerifierConfigurationError("JWT verification configuration is incomplete.")
        return cls(issuer=issuer, audience=audience, algorithm=algorithm)


class SigningKeyProvider(Protocol):
    def get_signing_key_from_jwt(self, token: str) -> object: ...


class IdentityTokenVerifier:
    def __init__(
        self,
        config: VerifierConfig,
        key_provider: SigningKeyProvider | None = None,
    ) -> None:
        self.config = config
        self.key_provider = key_provider or PyJWKClient(
            config.jwks_url,
            cache_jwk_set=True,
            lifespan=300,
            timeout=5,
            cooldown_duration=30,
        )

    def verify(self, token: str) -> str:
        try:
            header = jwt.get_unverified_header(token)
            if header.get("alg") != self.config.algorithm:
                raise InvalidAccessToken("Unsupported token algorithm.")

            key_id = header.get("kid")
            if not isinstance(key_id, str) or not key_id:
                raise InvalidAccessToken("Token key identifier is missing.")

            signing_key = self.key_provider.get_signing_key_from_jwt(token)
            expected_key_type = _ALGORITHM_KEY_TYPES[self.config.algorithm]
            key = getattr(signing_key, "key", None)
            if (
                getattr(signing_key, "key_type", None) != expected_key_type
                or getattr(signing_key, "algorithm_name", None) != self.config.algorithm
            ):
                raise InvalidAccessToken("Signing key does not match the configured algorithm.")
            if self.config.algorithm == "RS256" and getattr(key, "key_size", 0) < 2048:
                raise InvalidAccessToken("RSA signing key is too short.")
            if self.config.algorithm == "ES256" and getattr(
                getattr(key, "curve", None), "name", None
            ) != "secp256r1":
                raise InvalidAccessToken("EC signing key curve does not match the algorithm.")

            claims = jwt.decode(
                token,
                key,
                algorithms=[self.config.algorithm],
                issuer=self.config.issuer,
                audience=self.config.audience,
                options={"require": ["exp", "iss", "aud", "sub"], "verify_nbf": True},
            )
        except (jwt.PyJWTError, PyJWKClientError, TypeError, ValueError) as exc:
            raise InvalidAccessToken("Access token is invalid.") from exc

        subject = claims.get("sub")
        if not isinstance(subject, str) or not subject.strip():
            raise InvalidAccessToken("Access token subject is invalid.")

        if claims.get("aud") != self.config.audience:
            raise InvalidAccessToken("Access token audience is invalid.")

        return subject
