from __future__ import annotations

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from sqlalchemy import select

from app.api.routes import router as api_router
from app.auth import decode_access_token
from app.db import SessionLocal, init_db
from app.models import WorkspaceMembership

SCOPED_PATH_PREFIXES = ("/repos", "/query", "/pr")


def create_app() -> FastAPI:
    init_db()

    app = FastAPI(title="Synthesis API", version="0.1.0")

    @app.middleware("http")
    async def workspace_scope_middleware(request: Request, call_next):
        if request.url.path.startswith(SCOPED_PATH_PREFIXES):
            workspace_id_header = request.headers.get("X-Workspace-Id")
            if workspace_id_header is None:
                return JSONResponse(
                    status_code=400,
                    content={"detail": "X-Workspace-Id header is required"},
                )

            authorization = request.headers.get("Authorization", "")
            if not authorization.startswith("Bearer "):
                return JSONResponse(
                    status_code=401,
                    content={"detail": "Missing bearer token"},
                )

            try:
                token = authorization.split(" ", maxsplit=1)[1]
                payload = decode_access_token(token)
                user_id = int(payload["sub"])
                workspace_id = int(workspace_id_header)
            except Exception:
                return JSONResponse(status_code=401, content={"detail": "Invalid token"})

            with SessionLocal() as db:
                membership = db.execute(
                    select(WorkspaceMembership).where(
                        WorkspaceMembership.workspace_id == workspace_id,
                        WorkspaceMembership.user_id == user_id,
                    )
                ).scalar_one_or_none()

            if membership is None:
                return JSONResponse(status_code=403, content={"detail": "Workspace access denied"})

            request.state.workspace_id = workspace_id

        return await call_next(request)

    app.include_router(api_router)
    return app


app = create_app()
