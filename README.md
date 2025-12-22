# Synthesis

Synthesis is a codebase intelligence platform for engineering teams.
It ingests repositories, builds searchable code context, and answers architecture questions
with citation-backed responses and workspace-scoped access control.

## What It Does

- Authenticates users with JWT-based access tokens
- Supports multiple isolated workspaces
- Ingests repositories and persists structured code chunks
- Builds and queries a semantic index (NumPy-based with optional FAISS support)
- Returns architecture answers with citations and execution trace metadata

## Tech Stack

- Backend: FastAPI, SQLAlchemy, PyJWT
- Retrieval: NumPy embeddings, optional FAISS backend
- Frontend: Next.js 14, React, TypeScript
- Infra: Docker Compose, PostgreSQL, Redis

## Project Layout

```text
Synthesis/
  backend/
    app/
      api/
      auth/
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

## Local Development

### Backend only

```bash
cd backend
pip install -e .[dev]
pytest -q
uvicorn app.main:app --reload --port 8000
```

### Full stack with Docker

```bash
docker compose up --build
```

Services:

- Backend API: http://localhost:8010
- Frontend: http://localhost:3010
- PostgreSQL: localhost:5435
- Redis: localhost:6382

## API Surface

- `POST /auth/register` - Create a user and return an access token
- `POST /auth/token` - Login and return an access token
- `POST /workspaces` - Create a workspace
- `POST /repos/index` - Ingest and index a repository for a workspace
- `POST /query/architecture` - Ask architecture questions with citations
- `GET /health/ready` - Readiness check

## Workspace Isolation

Workspace-scoped routes require:

1. `Authorization: Bearer <token>`
2. `X-Workspace-Id: <workspace_id>`

Access is verified against workspace membership before query or repository actions are processed.
