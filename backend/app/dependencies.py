from __future__ import annotations

from fastapi import Depends, Header, HTTPException, Request
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.auth import decode_access_token
from app.db import get_db_session
from app.models import User, WorkspaceMembership


class AuthenticatedUser:
    def __init__(self, user_id: int, email: str):
        self.user_id = user_id
        self.email = email


def get_current_user(
    authorization: str | None = Header(default=None),
    db: Session = Depends(get_db_session),
) -> AuthenticatedUser:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing bearer token")

    token = authorization.split(" ", maxsplit=1)[1]
    try:
        payload = decode_access_token(token)
        user_id = int(payload["sub"])
    except Exception as exc:  # pragma: no cover - defensive branch
        raise HTTPException(status_code=401, detail="Invalid token") from exc

    user = db.get(User, user_id)
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")

    return AuthenticatedUser(user_id=user.user_id, email=user.email)


def require_workspace_access(
    request: Request,
    x_workspace_id: int | None = Header(default=None),
    user: AuthenticatedUser = Depends(get_current_user),
    db: Session = Depends(get_db_session),
) -> int:
    workspace_id = x_workspace_id or getattr(request.state, "workspace_id", None)
    if workspace_id is None:
        raise HTTPException(status_code=400, detail="X-Workspace-Id header is required")

    membership = db.execute(
        select(WorkspaceMembership).where(
            WorkspaceMembership.workspace_id == workspace_id,
            WorkspaceMembership.user_id == user.user_id,
        )
    ).scalar_one_or_none()

    if membership is None:
        raise HTTPException(status_code=403, detail="Workspace access denied")

    return int(workspace_id)
