from __future__ import annotations

from datetime import UTC, datetime
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.auth import create_access_token, hash_password, verify_password
from app.db import get_db_session
from app.dependencies import AuthenticatedUser, get_current_user, require_workspace_access
from app.models import CodeChunk, QueryLog, Repository, User, Workspace, WorkspaceMembership
from app.schemas import (
    ArchitectureQueryRequest,
    ArchitectureQueryResponse,
    Citation,
    HealthReadyResponse,
    RegisterRequest,
    RepoIndexRequest,
    RepoIndexResponse,
    TokenRequest,
    TokenResponse,
    WorkspaceCreateRequest,
    WorkspaceResponse,
)
from app.services.graph_orchestrator import run_graph
from app.services.indexing import build_index_for_repo, get_latest_index_version, search_index
from app.services.ingestion import ingest_repository

router = APIRouter()


@router.post("/auth/register", response_model=TokenResponse)
def register(payload: RegisterRequest, db: Session = Depends(get_db_session)) -> TokenResponse:
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing is not None:
        raise HTTPException(status_code=409, detail="Email already exists")

    user = User(email=payload.email, password_hash=hash_password(payload.password))
    db.add(user)
    db.commit()
    db.refresh(user)

    return TokenResponse(access_token=create_access_token(user.user_id))


@router.post("/auth/token", response_model=TokenResponse)
def login(payload: TokenRequest, db: Session = Depends(get_db_session)) -> TokenResponse:
    user = db.query(User).filter(User.email == payload.email).first()
    if user is None or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return TokenResponse(access_token=create_access_token(user.user_id))


@router.post("/workspaces", response_model=WorkspaceResponse)
def create_workspace(
    payload: WorkspaceCreateRequest,
    user: AuthenticatedUser = Depends(get_current_user),
    db: Session = Depends(get_db_session),
) -> WorkspaceResponse:
    workspace = Workspace(name=payload.name)
    db.add(workspace)
    db.flush()

    db.add(
        WorkspaceMembership(
            workspace_id=workspace.workspace_id,
            user_id=user.user_id,
            role="owner",
        )
    )
    db.commit()
    db.refresh(workspace)

    return WorkspaceResponse(
        workspace_id=workspace.workspace_id,
        name=workspace.name,
        created_at=workspace.created_at,
    )


@router.post("/repos/index", response_model=RepoIndexResponse)
def index_repository(
    payload: RepoIndexRequest,
    workspace_id: int = Depends(require_workspace_access),
    db: Session = Depends(get_db_session),
) -> RepoIndexResponse:
    if payload.workspace_id != workspace_id:
        raise HTTPException(status_code=400, detail="workspace_id body must match X-Workspace-Id")

    from app.config import get_settings

    settings = get_settings()

    ingestion_result = ingest_repository(
        db=db,
        workspace_id=workspace_id,
        repo_url=payload.repo_url,
        branch=payload.branch,
        chunk_lines=settings.chunk_lines,
        max_file_size_bytes=settings.max_file_size_bytes,
    )

    if ingestion_result.indexed_chunks == 0:
        db.rollback()
        raise HTTPException(status_code=400, detail="No source chunks found in repository")

    index_version = build_index_for_repo(
        db=db,
        repo_id=ingestion_result.repo.repo_id,
        dimensions=settings.embedding_dimensions,
        index_dir=settings.index_dir,
    )

    ingestion_result.repo.last_indexed_at = datetime.now(UTC).replace(tzinfo=None)
    db.commit()

    return RepoIndexResponse(
        job_id=f"index-{uuid4().hex[:12]}",
        status="completed",
        repo_id=ingestion_result.repo.repo_id,
        indexed_chunks=ingestion_result.indexed_chunks,
        index_version_id=index_version.version_id,
    )


@router.post("/query/architecture", response_model=ArchitectureQueryResponse)
def query_architecture(
    payload: ArchitectureQueryRequest,
    workspace_id: int = Depends(require_workspace_access),
    db: Session = Depends(get_db_session),
) -> ArchitectureQueryResponse:
    if payload.workspace_id != workspace_id:
        raise HTTPException(status_code=400, detail="workspace_id body must match X-Workspace-Id")

    from app.config import get_settings

    settings = get_settings()
    repos = db.query(Repository).filter(Repository.workspace_id == workspace_id).all()
    if not repos:
        raise HTTPException(status_code=404, detail="No repositories found for workspace")

    scored_hits: list[tuple[int, float]] = []
    for repo in repos:
        latest_index = get_latest_index_version(db, repo.repo_id)
        if latest_index is None:
            continue
        for hit in search_index(
            index_version=latest_index,
            query=payload.question,
            dimensions=settings.embedding_dimensions,
            top_k=5,
        ):
            scored_hits.append((hit.chunk_id, hit.score))

    scored_hits.sort(key=lambda entry: entry[1], reverse=True)
    top_chunk_ids = [chunk_id for chunk_id, _score in scored_hits[:8]]

    retrieved_chunks = []
    if top_chunk_ids:
        retrieved_chunks = db.query(CodeChunk).filter(CodeChunk.chunk_id.in_(top_chunk_ids)).all()

    graph_result = run_graph(payload.question, retrieved_chunks)

    citations = [
        Citation(
            repo_id=chunk.repo_id,
            file_path=chunk.file_path,
            chunk_id=chunk.chunk_id,
            snippet=chunk.chunk_text[:180],
        )
        for chunk in retrieved_chunks[:5]
    ]

    db.add(
        QueryLog(
            workspace_id=workspace_id,
            prompt=payload.question,
            response_summary=graph_result.answer[:500],
            relevance_score=graph_result.relevance,
        )
    )
    db.commit()

    return ArchitectureQueryResponse(
        answer=graph_result.answer,
        citations=citations,
        relevance_estimate=graph_result.relevance,
        trace=graph_result.trace,
    )


@router.get("/health/ready", response_model=HealthReadyResponse)
def health_ready(db: Session = Depends(get_db_session)) -> HealthReadyResponse:
    try:
        db.execute(text("SELECT 1"))
        db_status = "ok"
    except Exception:  # pragma: no cover - defensive branch
        db_status = "down"

    worker_status = "ok"
    status = "ok" if db_status == "ok" else "degraded"
    return HealthReadyResponse(db=db_status, index_worker=worker_status, status=status)
