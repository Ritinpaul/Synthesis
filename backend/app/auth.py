from __future__ import annotations

import hashlib
import hmac
import os
from datetime import UTC, datetime, timedelta

import jwt

from app.config import get_settings


def hash_password(password: str, salt: str | None = None) -> str:
    salt_value = salt or os.urandom(16).hex()
    digest = hashlib.sha256(f"{salt_value}:{password}".encode("utf-8")).hexdigest()
    return f"{salt_value}${digest}"


def verify_password(password: str, stored_hash: str) -> bool:
    salt, _ = stored_hash.split("$", maxsplit=1)
    candidate = hash_password(password, salt=salt)
    return hmac.compare_digest(candidate, stored_hash)


def create_access_token(user_id: int) -> str:
    settings = get_settings()
    expire_at = datetime.now(UTC) + timedelta(minutes=settings.token_expiry_minutes)
    payload = {"sub": str(user_id), "exp": expire_at}
    return jwt.encode(payload, settings.jwt_secret, algorithm=settings.jwt_algorithm)


def decode_access_token(token: str) -> dict[str, str]:
    settings = get_settings()
    return jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algorithm])
