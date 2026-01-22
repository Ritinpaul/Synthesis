from __future__ import annotations

import json
import re
from dataclasses import dataclass
from datetime import UTC, datetime
from pathlib import Path

import numpy as np
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import CodeChunk, IndexVersion

try:
    import faiss  # type: ignore
except Exception:  # pragma: no cover - optional dependency
    faiss = None


@dataclass
class SearchResult:
    chunk_id: int
    score: float


def embed_text(text: str, dimensions: int) -> np.ndarray:
    vector = np.zeros(dimensions, dtype=np.float32)
    for token in re.findall(r"[a-zA-Z0-9_]+", text.lower()):
        index = hash(token) % dimensions
        vector[index] += 1.0

    norm = np.linalg.norm(vector)
    if norm == 0:
        return vector
    return vector / norm


def build_index_for_repo(
    db: Session,
    repo_id: int,
    dimensions: int,
    index_dir: str,
) -> IndexVersion:
    chunks = db.execute(
        select(CodeChunk).where(CodeChunk.repo_id == repo_id).order_by(CodeChunk.chunk_id)
    ).scalars().all()

    if not chunks:
        raise ValueError("Repository has no chunks to index")

    vectors = np.vstack([embed_text(chunk.chunk_text, dimensions) for chunk in chunks]).astype(np.float32)
    chunk_ids = [chunk.chunk_id for chunk in chunks]

    target_dir = Path(index_dir)
    target_dir.mkdir(parents=True, exist_ok=True)
    timestamp = datetime.now(UTC).strftime("%Y%m%d%H%M%S")

    if faiss is not None:
        index = faiss.IndexFlatIP(dimensions)
        index.add(vectors)
        index_file = target_dir / f"repo_{repo_id}_{timestamp}.faiss"
        mapping_file = target_dir / f"repo_{repo_id}_{timestamp}.mapping.json"
        faiss.write_index(index, str(index_file))
        mapping_file.write_text(json.dumps(chunk_ids), encoding="utf-8")
        location = str(index_file)
    else:
        index_file = target_dir / f"repo_{repo_id}_{timestamp}.npz"
        np.savez_compressed(index_file, vectors=vectors, chunk_ids=np.array(chunk_ids, dtype=np.int64))
        location = str(index_file)

    version = IndexVersion(
        repo_id=repo_id,
        faiss_location=location,
        chunk_count=len(chunk_ids),
        embedding_model="hash-embedding-v1",
    )
    db.add(version)
    db.flush()
    return version


def get_latest_index_version(db: Session, repo_id: int) -> IndexVersion | None:
    return db.execute(
        select(IndexVersion)
        .where(IndexVersion.repo_id == repo_id)
        .order_by(IndexVersion.created_at.desc())
    ).scalar_one_or_none()


def search_index(index_version: IndexVersion, query: str, dimensions: int, top_k: int) -> list[SearchResult]:
    query_vector = embed_text(query, dimensions).reshape(1, -1).astype(np.float32)
    location = Path(index_version.faiss_location)

    if location.suffix == ".faiss" and faiss is not None:
        index = faiss.read_index(str(location))
        mapping_file = location.with_suffix(".mapping.json")
        chunk_ids = json.loads(mapping_file.read_text(encoding="utf-8"))
        distances, indices = index.search(query_vector, top_k)

        results: list[SearchResult] = []
        for score, idx in zip(distances[0], indices[0], strict=False):
            if idx < 0:
                continue
            results.append(SearchResult(chunk_id=int(chunk_ids[idx]), score=float(score)))
        return results

    payload = np.load(location)
    vectors = payload["vectors"]
    chunk_ids = payload["chunk_ids"]

    similarities = np.dot(vectors, query_vector[0])
    sorted_idx = np.argsort(similarities)[::-1][:top_k]

    return [
        SearchResult(chunk_id=int(chunk_ids[idx]), score=float(similarities[idx]))
        for idx in sorted_idx
        if similarities[idx] > 0
    ]
