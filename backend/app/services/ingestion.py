from __future__ import annotations

import hashlib
import re
import shutil
import subprocess
import tempfile
from collections.abc import Iterable
from dataclasses import dataclass
from datetime import UTC, datetime
from pathlib import Path

from sqlalchemy import delete, select
from sqlalchemy.orm import Session

from app.models import CodeChunk, Repository

LANGUAGE_BY_EXT = {
    ".py": "python",
    ".ts": "typescript",
    ".tsx": "tsx",
    ".js": "javascript",
    ".jsx": "jsx",
    ".go": "go",
    ".java": "java",
    ".rs": "rust",
    ".md": "markdown",
    ".json": "json",
    ".yml": "yaml",
    ".yaml": "yaml",
}

SOURCE_EXTENSIONS = set(LANGUAGE_BY_EXT)


@dataclass
class RepoSnapshot:
    path: Path
    cleanup_path: Path | None


@dataclass
class IngestionResult:
    repo: Repository
    indexed_chunks: int
    reused_chunks: int = 0
    added_chunks: int = 0
    deleted_chunks: int = 0
    is_incremental: bool = False


def ingest_repository(
    db: Session,
    workspace_id: int,
    repo_url: str,
    branch: str,
    chunk_lines: int,
    max_file_size_bytes: int,
    incremental: bool = True,
) -> IngestionResult:
    repo = db.execute(
        select(Repository).where(
            Repository.workspace_id == workspace_id,
            Repository.url == repo_url,
        )
    ).scalar_one_or_none()

    if repo is None:
        repo = Repository(
            workspace_id=workspace_id,
            provider="git",
            url=repo_url,
            default_branch=branch,
        )
        db.add(repo)
        db.flush()
    else:
        repo.default_branch = branch

    snapshot = _materialize_repository(repo_url=repo_url, branch=branch)
    try:
        new_chunks = list(_extract_chunks(snapshot.path, chunk_lines, max_file_size_bytes))

        if not incremental:
            # Full wipe and re-index
            db.execute(delete(CodeChunk).where(CodeChunk.repo_id == repo.repo_id))
            for chunk in new_chunks:
                db.add(
                    CodeChunk(
                        repo_id=repo.repo_id,
                        file_path=chunk.file_path,
                        symbol_name=chunk.symbol_name,
                        language=chunk.language,
                        content_hash=chunk.content_hash,
                        token_count=chunk.token_count,
                        chunk_text=chunk.chunk_text,
                        indexed_at=datetime.now(UTC).replace(tzinfo=None),
                    )
                )
            db.flush()
            return IngestionResult(
                repo=repo,
                indexed_chunks=len(new_chunks),
                reused_chunks=0,
                added_chunks=len(new_chunks),
                deleted_chunks=0,
                is_incremental=False,
            )

        # Incremental Delta Indexing
        existing_chunks = db.execute(
            select(CodeChunk).where(CodeChunk.repo_id == repo.repo_id)
        ).scalars().all()

        existing_map = {(c.file_path, c.content_hash): c for c in existing_chunks}
        seen_keys = set()

        reused_count = 0
        added_count = 0

        for chunk in new_chunks:
            key = (chunk.file_path, chunk.content_hash)
            seen_keys.add(key)
            if key in existing_map:
                reused_count += 1
            else:
                db.add(
                    CodeChunk(
                        repo_id=repo.repo_id,
                        file_path=chunk.file_path,
                        symbol_name=chunk.symbol_name,
                        language=chunk.language,
                        content_hash=chunk.content_hash,
                        token_count=chunk.token_count,
                        chunk_text=chunk.chunk_text,
                        indexed_at=datetime.now(UTC).replace(tzinfo=None),
                    )
                )
                added_count += 1

        # Remove stale chunks
        deleted_count = 0
        for (fpath, chash), old_chunk in existing_map.items():
            if (fpath, chash) not in seen_keys:
                db.delete(old_chunk)
                deleted_count += 1

        db.flush()
        total_chunks = len(new_chunks)
        return IngestionResult(
            repo=repo,
            indexed_chunks=total_chunks,
            reused_chunks=reused_count,
            added_chunks=added_count,
            deleted_chunks=deleted_count,
            is_incremental=True,
        )

    finally:
        if snapshot.cleanup_path is not None:
            shutil.rmtree(snapshot.cleanup_path, ignore_errors=True)


@dataclass
class ParsedChunk:
    file_path: str
    symbol_name: str
    language: str
    content_hash: str
    token_count: int
    chunk_text: str


def _materialize_repository(repo_url: str, branch: str) -> RepoSnapshot:
    repo_path = Path(repo_url)
    if repo_path.exists():
        return RepoSnapshot(path=repo_path.resolve(), cleanup_path=None)

    temp_dir = Path(tempfile.mkdtemp(prefix="synthesis_repo_"))
    clone_path = temp_dir / "repo"

    cmd = ["git", "clone", "--depth", "1", "--branch", branch, repo_url, str(clone_path)]
    process = subprocess.run(cmd, capture_output=True, text=True, check=False)
    if process.returncode != 0:
        raise ValueError(f"Failed to clone repository: {process.stderr.strip()}")

    return RepoSnapshot(path=clone_path, cleanup_path=temp_dir)


def _extract_chunks(
    root_path: Path,
    chunk_lines: int,
    max_file_size_bytes: int,
) -> Iterable[ParsedChunk]:
    for file_path in root_path.rglob("*"):
        if not file_path.is_file():
            continue
        if file_path.suffix.lower() not in SOURCE_EXTENSIONS:
            continue
        if file_path.stat().st_size > max_file_size_bytes:
            continue

        try:
            content = file_path.read_text(encoding="utf-8")
        except UnicodeDecodeError:
            continue

        rel_path = str(file_path.relative_to(root_path)).replace("\\", "/")
        language = LANGUAGE_BY_EXT.get(file_path.suffix.lower(), "text")

        lines = content.splitlines()
        if not lines:
            continue

        for chunk_start in range(0, len(lines), chunk_lines):
            chunk_body = "\n".join(lines[chunk_start : chunk_start + chunk_lines]).strip()
            if not chunk_body:
                continue

            symbol = _extract_symbol_name(chunk_body)
            content_hash = hashlib.sha256(chunk_body.encode("utf-8")).hexdigest()
            token_count = len(chunk_body.split())

            yield ParsedChunk(
                file_path=rel_path,
                symbol_name=symbol,
                language=language,
                content_hash=content_hash,
                token_count=token_count,
                chunk_text=chunk_body,
            )


def _extract_symbol_name(chunk_text: str) -> str:
    patterns = [
        r"^\s*def\s+([a-zA-Z_][a-zA-Z0-9_]*)",
        r"^\s*class\s+([a-zA-Z_][a-zA-Z0-9_]*)",
        r"^\s*function\s+([a-zA-Z_][a-zA-Z0-9_]*)",
        r"^\s*export\s+(?:default\s+)?(?:function|class|const|let)\s+([a-zA-Z_][a-zA-Z0-9_]*)",
    ]
    for pattern in patterns:
        match = re.search(pattern, chunk_text, re.MULTILINE)
        if match:
            return match.group(1)
    return "global"
