# Synthesis Backend

FastAPI service for Phase 1 and Phase 2 of Synthesis.

## What is implemented

- JWT authentication (`/auth/register`, `/auth/token`)
- Workspace creation with membership
- Workspace scoping middleware (`X-Workspace-Id` enforced on scoped routes)
- Repository ingestion and code chunk persistence
- Embedding pipeline and FAISS-compatible index metadata storage
- Architecture query endpoint with citations and trace output
- Readiness endpoint

## Local setup

```bash
pip install -e .[dev]
uvicorn app.main:app --reload
```

## Core endpoints

- `POST /auth/register`
- `POST /auth/token`
- `POST /workspaces`
- `POST /repos/index`
- `POST /query/architecture`
- `GET /health/ready`
