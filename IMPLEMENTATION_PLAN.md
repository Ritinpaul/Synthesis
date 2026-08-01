# Synthesis Implementation Plan

Project: Synthesis - Autonomous Codebase Intelligence and PR Copilot
Stack: Next.js 14, TypeScript, FastAPI, LangGraph, FAISS, PostgreSQL, Redis, Docker
Date: 2026-04-20

## 1) Goal
Build an end-to-end engineering intelligence system that indexes large repositories, answers architecture questions with high relevance, analyzes pull requests in real time, and presents actionable risk and tech debt insights through a dashboard.

## 2) Success Metrics
- Repository indexing: >= 50,000 LOC indexed in <= 90 seconds on benchmark repos
- Query relevance: >= 85% relevance accuracy on developer-labeled architecture Q/A set
- PR analysis speed: <= 5 seconds for summary plus risk report on medium PRs
- Breaking change signal quality: >= 80% precision on validation set
- Diagram to code interpretation: >= 85% correctness on curated test diagrams
- Workspace isolation: 0 cross-workspace data leakage under auth and API tests

## 3) MVP Scope (Fast and Practical)
In scope:
1. Multi-workspace auth with JWT
2. Repository ingest and code chunk indexing in FAISS
3. LangGraph pipeline with 3 agents (parser, impact analyzer, doc generator)
4. Architecture query API and citation-backed responses
5. PR intelligence engine (summary, risk score, debt heatmap)
6. Next.js dashboard for live PR and query insights
7. Dockerized deployment with background workers

Out of scope for MVP:
- Enterprise SSO and SCIM
- Monorepo cross-org governance
- IDE extension integrations

## 4) High-Level Architecture
1. Ingestion Service (FastAPI worker)
- Pulls repository refs and parses source files into normalized code chunks.
- Tracks file metadata, symbols, and dependency edges.

2. Memory Indexing Layer
- Embeds chunks and writes vectors into FAISS.
- Stores chunk metadata and index versions in PostgreSQL.

3. LangGraph Orchestrator
- Parser agent identifies affected symbols and context.
- Impact analyzer computes change risk and dependency blast radius.
- Doc generator creates PR descriptions and architecture answers.

4. PR Intelligence Service
- Ingests diff data and computes risk score, breaking-change hints, and debt markers.
- Persists scored signals for dashboard rendering.

5. Application Layer
- FastAPI endpoints for indexing, querying, and PR analysis.
- Next.js dashboard with workspace-scoped views and drill-downs.

## 5) Proposed Folder Structure
synthesis/
- backend/
  - app/
    - api/
    - auth/
    - ingestion/
    - indexing/
    - graph/
    - pr_intel/
    - db/
  - workers/
- frontend/
  - app/
  - components/
  - lib/
- tests/
- scripts/
- docker-compose.yml
- README.md

## 6) Data Model (PostgreSQL)
Tables:
1. workspaces
- workspace_id (pk)
- name
- created_at

2. repositories
- repo_id (pk)
- workspace_id (fk)
- provider
- url
- default_branch
- last_indexed_at

3. code_chunks
- chunk_id (pk)
- repo_id (fk)
- file_path
- symbol_name
- language
- content_hash
- token_count
- chunk_text
- indexed_at

4. index_versions
- version_id (pk)
- repo_id (fk)
- faiss_location
- chunk_count
- embedding_model
- created_at

5. pull_requests
- pr_id (pk)
- repo_id (fk)
- pr_number
- title
- author
- created_at

6. pr_risk_signals
- signal_id (pk)
- pr_id (fk)
- breaking_change_score
- debt_score
- summary_text
- generated_at

7. query_logs
- query_id (pk)
- workspace_id (fk)
- prompt
- response_summary
- relevance_score
- created_at

## 7) API Contract (FastAPI)
Endpoints:
1. POST /workspaces
- input: name
- output: workspace metadata

2. POST /repos/index
- input: workspace_id, repo_url, branch
- output: index job id and status

3. POST /query/architecture
- input: workspace_id, question
- output: answer, citations, relevance estimate

4. POST /pr/analyze
- input: workspace_id, repo_id, pr_number
- output: PR summary, risk scores, debt heatmap payload

5. GET /pr/{pr_id}
- output: latest analysis and historical trend

6. GET /health/ready
- output: db, redis, index worker status

## 8) Phase-Wise Implementation Plan (12 Days)

### Phase 1: Platform Foundation (Days 1-2)
Step 1 (Day 1): Project bootstrap and auth
- Initialize backend plus frontend repos, JWT auth, workspace scoping middleware.
- Deliverable: authenticated workspace API skeleton.

Step 2 (Day 2): Repository ingestion primitives
- Add git fetch layer, parser scaffolding, and chunk persistence schema.
- Deliverable: repository files ingested and listed by workspace.

Phase 1 exit criteria:
- Auth plus workspace isolation is functional.
- Repository ingest baseline runs end-to-end.

### Phase 2: Semantic Memory and Query Engine (Days 3-5)
Step 1 (Day 3): FAISS indexing pipeline
- Generate embeddings for code chunks and store index metadata.
- Deliverable: 50k LOC benchmark index execution path.

Step 2 (Day 4): LangGraph 3-agent orchestration
- Implement parser, impact analyzer, and doc generator flow.
- Deliverable: deterministic pipeline execution with trace logs.

Step 3 (Day 5): Architecture query endpoint
- Add retrieval plus generation endpoint with citations and score output.
- Deliverable: architecture Q/A API with measurable relevance.

Phase 2 exit criteria:
- Indexing and query path is stable.
- Relevance baseline reaches target on initial validation set.

### Phase 3: PR Intelligence Core (Days 6-8)
Step 1 (Day 6): Diff ingestion and feature extraction
- Parse PR diffs, changed symbols, and dependency impact vectors.
- Deliverable: structured PR feature payload persisted.

Step 2 (Day 7): Risk and debt scoring
- Implement breaking-change and debt scoring functions.
- Deliverable: scored PR signals with versioned scoring output.

Step 3 (Day 8): Summary generation
- Generate auto PR descriptions and risk explanations.
- Deliverable: quality-reviewed PR summary output.

Phase 3 exit criteria:
- PR analysis pipeline runs in target latency.
- Score outputs and summaries are queryable by API.

### Phase 4: Dashboard and Diagram Intelligence (Days 9-10)
Step 1 (Day 9): Next.js dashboard implementation
- Build workspace dashboard for PR feed, risk cards, and debt heatmaps.
- Deliverable: live frontend panels backed by API.

Step 2 (Day 10): Diagram-to-code module
- Integrate GPT-4V style workflow for architecture diagram interpretation.
- Deliverable: diagram upload to code-context explanation path.

Phase 4 exit criteria:
- Dashboard is usable for core workflows.
- Diagram interpretation path is integrated and testable.

### Phase 5: Validation and Portfolio Packaging (Days 11-12)
Step 1 (Day 11): Performance and quality validation
- Run indexing, query relevance, and PR analysis benchmark suites.
- Deliverable: benchmark report with pass/fail gates.

Step 2 (Day 12): Production polish
- Finalize Docker deployment, README, architecture diagram, and demo script.
- Deliverable: portfolio-ready evidence package.

Phase 5 exit criteria:
- Success metrics are evidenced with test artifacts.
- System is reproducible and demo-ready.

## 9) Testing and Verification
Automated tests:
- Unit tests for parser, embedding, scoring, and summary generation logic
- Integration tests for ingest to index to query flow
- End-to-end tests for PR analysis and dashboard API contracts

Quality gates:
- Test pass rate 100%
- Workspace isolation verified via auth tests
- Benchmark suite meets indexing and relevance targets

## 10) Deployment Plan (MVP)
- Docker Compose stack for local and VM deployment
- Services: frontend, backend, worker, postgres, redis
- Background worker autoscaling profile for indexing workloads

## 11) Resume Proof Checklist
- Benchmark report proving 50,000+ LOC indexing under 90s
- Query relevance evaluation report with >= 85% accuracy
- PR analysis screenshots with risk scores and debt heatmaps
- Diagram-to-code demo output with correctness notes
