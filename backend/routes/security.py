from functools import lru_cache
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel

from backend.security.identity import (
    IdentityTokenVerifier,
    InvalidAccessToken,
    VerifierConfig,
    VerifierConfigurationError,
)


router = APIRouter()
bearer_scheme = HTTPBearer(auto_error=False)


class VerifiedIdentity(BaseModel):
    sub: str


@lru_cache(maxsize=1)
def _configured_verifier() -> IdentityTokenVerifier:
    return IdentityTokenVerifier(VerifierConfig.from_environment())


def require_verified_identity(
    request: Request,
    credentials: Annotated[
        HTTPAuthorizationCredentials | None, Depends(bearer_scheme)
    ],
) -> VerifiedIdentity:
    if credentials is None or credentials.scheme.lower() != "bearer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    verifier = getattr(request.app.state, "identity_token_verifier", None)
    try:
        verifier = verifier or _configured_verifier()
    except VerifierConfigurationError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Authentication service unavailable.",
        ) from exc

    try:
        subject = verifier.verify(credentials.credentials)
    except InvalidAccessToken as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials.",
            headers={"WWW-Authenticate": "Bearer"},
        ) from exc

    return VerifiedIdentity(sub=subject)


@router.get(
    "/api/v1/security/identity",
    response_model=VerifiedIdentity,
)
def identity(
    verified_identity: Annotated[VerifiedIdentity, Depends(require_verified_identity)],
) -> VerifiedIdentity:
    return verified_identity
