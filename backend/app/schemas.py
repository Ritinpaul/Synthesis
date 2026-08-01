from __future__ import annotations

from datetime import datetime
from typing import Any

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
    incremental: bool = True


class RepoIndexResponse(BaseModel):
    job_id: str
    status: str
    repo_id: int
    indexed_chunks: int
    index_version_id: int
    reused_chunks: int = 0
    added_chunks: int = 0
    deleted_chunks: int = 0
    is_incremental: bool = False


class Citation(BaseModel):
    repo_id: int
    file_path: str
    chunk_id: int
    snippet: str
    symbol_name: str = "global"
    confidence_score: float = 0.85
    confidence_tier: str = "high"


class ArchitectureQueryRequest(BaseModel):
    workspace_id: int
    question: str


class ArchitectureQueryResponse(BaseModel):
    answer: str
    citations: list[Citation]
    relevance_estimate: float
    trace: list[dict[str, str]]


class PRAnalyzeRequest(BaseModel):
    workspace_id: int
    repo_id: int
    pr_number: int
    title: str = "Update pull request"
    author: str = "developer"
    diff_text: str | None = None


class PRAnalyzeResponse(BaseModel):
    pr_id: int
    repo_id: int
    pr_number: int
    title: str
    author: str
    breaking_change_score: float
    debt_score: float
    summary_text: str
    risk_level: str
    blast_radius_count: int
    impacted_files: list[str]
    debt_markers: list[str]
    generated_at: datetime


class PRDetailResponse(BaseModel):
    pr_id: int
    repo_id: int
    pr_number: int
    title: str
    author: str
    created_at: datetime
    latest_signal: PRAnalyzeResponse | None = None
    historical_signals_count: int = 1


class WorkspaceAnalyticsResponse(BaseModel):
    workspace_id: int
    total_queries: int
    avg_relevance_score: float
    top_queried_files: list[dict[str, Any]]
    top_search_keywords: list[str]
    query_history_count: int


class GitHubWebhookResponse(BaseModel):
    status: str
    event: str
    pr_number: int | None = None
    analysis: PRAnalyzeResponse | None = None


class HealthReadyResponse(BaseModel):
    db: str
    index_worker: str
    status: str
