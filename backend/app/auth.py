from __future__ import annotations

import hmac
from typing import Optional

from fastapi import HTTPException, Request, Response, status

from app.config import ADMIN_PASSWORD, ADMIN_USERNAME, COOKIE_NAME, COOKIE_SECURE, SESSION_SECRET
import hashlib
import secrets


def _digest(value: str) -> str:
    return hmac.new(SESSION_SECRET.encode(), value.encode(), hashlib.sha256).hexdigest()[:24]


def sign(session_id: str) -> str:
    return f"{session_id}.{_digest(session_id)}"


def read_session(cookie: Optional[str]) -> Optional[str]:
    if not cookie or "." not in cookie:
        return None
    session_id, digest = cookie.rsplit(".", 1)
    if not hmac.compare_digest(digest, _digest(session_id)):
        return None
    return session_id


def _fixed(value: str) -> bytes:
    return value.encode("utf-8")[:64].ljust(64, b"\0")


def check_credentials(username: str, password: str) -> bool:
    user_ok = hmac.compare_digest(_fixed(username), _fixed(ADMIN_USERNAME))
    pass_ok = hmac.compare_digest(_fixed(password), _fixed(ADMIN_PASSWORD))
    return user_ok and pass_ok


def set_session(response: Response) -> None:
    response.set_cookie(
        COOKIE_NAME,
        sign(secrets.token_urlsafe(16)),
        httponly=True,
        samesite="lax",
        secure=COOKIE_SECURE,
        max_age=60 * 60 * 24 * 14,
        path="/",
    )


def clear_session(response: Response) -> None:
    response.delete_cookie(COOKIE_NAME, path="/", secure=COOKIE_SECURE)


def require_admin(request: Request) -> str:
    session_id = read_session(request.cookies.get(COOKIE_NAME))
    if not session_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Sign in required")
    return session_id
