from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, Field


class RegisterRequest(BaseModel):
    email: str
    password: str = Field(min_length=8)


class TokenRequest(BaseModel):
    email: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class WorkspaceCreateRequest(BaseModel):
    name: str


class WorkspaceResponse(BaseModel):
    workspace_id: int
    name: str
    created_at: datetime


class RepoIndexRequest(BaseModel):
    workspace_id: int
    repo_url: str
    branch: str = "main"


class RepoIndexResponse(BaseModel):
    job_id: str
    status: str
    repo_id: int
    indexed_chunks: int
    index_version_id: int


class Citation(BaseModel):
    repo_id: int
    file_path: str
    chunk_id: int
    snippet: str


class ArchitectureQueryRequest(BaseModel):
    workspace_id: int
    question: str


class ArchitectureQueryResponse(BaseModel):
    answer: str
    citations: list[Citation]
    relevance_estimate: float
    trace: list[dict[str, str]]


class HealthReadyResponse(BaseModel):
    db: str
    index_worker: str
    status: str
