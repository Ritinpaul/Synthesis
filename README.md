# Synthesis

Synthesis is an autonomous codebase intelligence platform that indexes source repositories, answers architecture questions with citations, and supports engineering decision-making with workspace-scoped access controls.

## Highlights

- Secure multi-workspace access with JWT authentication
- Repository ingestion and code chunk persistence
- Semantic retrieval pipeline with FAISS-compatible indexing
- Multi-agent architecture query orchestration with execution trace
- FastAPI backend and Next.js dashboard foundation

## Tech Stack

- Backend: FastAPI, SQLAlchemy, PyJWT
- Retrieval: NumPy embeddings with optional FAISS support
- Frontend: Next.js 14, React, TypeScript
- Infrastructure: Docker Compose, PostgreSQL, Redis

## Repository Structure

```text
Synthesis/
  backend/
    app/
      api/
      services/
      workers/
    tests/
    pyproject.toml
  frontend/
    app/
    components/
    lib/
  docker-compose.yml
```

## Quick Start

### Backend

```bash
cd backend
pip install -e .[dev]
pytest -q
uvicorn app.main:app --reload
```

### Full Stack

```bash
docker compose up --build
```

## Core API Endpoints

- POST /auth/register
- POST /auth/token
- POST /workspaces
- POST /repos/index
- POST /query/architecture
- GET /health/ready

## Notes

- The architecture query response includes citation snippets and agent trace output.
- Workspace isolation is enforced through header-based scoping plus membership checks.
