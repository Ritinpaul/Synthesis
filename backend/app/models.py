from __future__ import annotations

from datetime import UTC, datetime

from sqlalchemy import DateTime, Float, ForeignKey, Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class Base(DeclarativeBase):
    pass


def utc_now_naive() -> datetime:
    return datetime.now(UTC).replace(tzinfo=None)


class User(Base):
    __tablename__ = "users"

    user_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    email: Mapped[str] = mapped_column(String(320), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(256))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now_naive)


class Workspace(Base):
    __tablename__ = "workspaces"

    workspace_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(255))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now_naive)


class WorkspaceMembership(Base):
    __tablename__ = "workspace_memberships"
    __table_args__ = (UniqueConstraint("workspace_id", "user_id", name="uq_workspace_user"),)

    membership_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    workspace_id: Mapped[int] = mapped_column(ForeignKey("workspaces.workspace_id"), index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.user_id"), index=True)
    role: Mapped[str] = mapped_column(String(32), default="owner")


class Repository(Base):
    __tablename__ = "repositories"

    repo_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    workspace_id: Mapped[int] = mapped_column(ForeignKey("workspaces.workspace_id"), index=True)
    provider: Mapped[str] = mapped_column(String(50), default="git")
    url: Mapped[str] = mapped_column(String(1024))
    default_branch: Mapped[str] = mapped_column(String(100), default="main")
    last_indexed_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)


class CodeChunk(Base):
    __tablename__ = "code_chunks"

    chunk_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    repo_id: Mapped[int] = mapped_column(ForeignKey("repositories.repo_id"), index=True)
    file_path: Mapped[str] = mapped_column(String(1024))
    symbol_name: Mapped[str] = mapped_column(String(255), default="global")
    language: Mapped[str] = mapped_column(String(30), default="text")
    content_hash: Mapped[str] = mapped_column(String(64), index=True)
    token_count: Mapped[int] = mapped_column(Integer)
    chunk_text: Mapped[str] = mapped_column(Text)
    indexed_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now_naive)


class IndexVersion(Base):
    __tablename__ = "index_versions"

    version_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    repo_id: Mapped[int] = mapped_column(ForeignKey("repositories.repo_id"), index=True)
    faiss_location: Mapped[str] = mapped_column(String(1024))
    chunk_count: Mapped[int] = mapped_column(Integer)
    embedding_model: Mapped[str] = mapped_column(String(128), default="hash-embedding-v1")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now_naive)


class PullRequest(Base):
    __tablename__ = "pull_requests"

    pr_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    repo_id: Mapped[int] = mapped_column(ForeignKey("repositories.repo_id"), index=True)
    pr_number: Mapped[int] = mapped_column(Integer)
    title: Mapped[str] = mapped_column(String(500))
    author: Mapped[str] = mapped_column(String(255))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now_naive)


class PrRiskSignal(Base):
    __tablename__ = "pr_risk_signals"

    signal_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    pr_id: Mapped[int] = mapped_column(ForeignKey("pull_requests.pr_id"), index=True)
    breaking_change_score: Mapped[float] = mapped_column(Float, default=0.0)
    debt_score: Mapped[float] = mapped_column(Float, default=0.0)
    summary_text: Mapped[str] = mapped_column(Text)
    generated_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now_naive)


class QueryLog(Base):
    __tablename__ = "query_logs"

    query_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    workspace_id: Mapped[int] = mapped_column(ForeignKey("workspaces.workspace_id"), index=True)
    prompt: Mapped[str] = mapped_column(Text)
    response_summary: Mapped[str] = mapped_column(Text)
    relevance_score: Mapped[float] = mapped_column(Float, default=0.0)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now_naive)
