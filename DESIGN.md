# DESIGN.md — Synthesis: AI Codebase Intelligence & PR Risk Platform

## 1. Brand & Visual Philosophy

Synthesis is an enterprise-grade developer platform that uses a **3-agent LangGraph pipeline** (`AST Diff Parser`, `Dependency Blast Radius Evaluator`, `Technical Debt Scorer`) to prevent architectural breaking changes and surface codebase knowledge in sub-second vector queries.

### Core Design Tenets
1. **Instrument-Grade Developer Console:** Visuals evoke high-performance terminal consoles, GitHub Enterprise security tools, and Datadog APM monitors.
2. **Architectural Drafting Logic:** Clean 1px structural grid lines, orthogonal division rules, micro-chamfered cards, and Cartesian coordinate notations (`[LANGGRAPH NODE: AST_PARSER // LATENCY: 42ms]`).
3. **Strictly Zero AI Slop / Zero Emojis:** No cartoon gradients, no playful emoji decorations (`🔒`, `🚀`), no generic blue blur blobs. All icons originate strictly from `lucide-react` with precise 14px–18px stroke geometry.
4. **Data-Dense Code Readability:** High-contrast dark theme optimized for viewing complex unified diffs, AST mutation alerts, FAISS vector distance scores, and cyclomatic complexity heatmaps.

---

## 2. Color System & Design Tokens

Calibrated for dark developer environments with low eye-fatigue and semantic risk hierarchy:

| Token Name | Hex Value | Semantic Role |
| :--- | :--- | :--- |
| `bg-canvas` | `#080B11` | Primary viewport background (deep obsidian) |
| `bg-surface-deck` | `#0E131F` | Primary panel container, card backgrounds |
| `bg-surface-elevated`| `#151D2E` | Active cards, inspection sheets, dropdowns |
| `border-hairline` | `#1E293B` | Structural 1px separation boundaries |
| `border-hairline-bright`| `#334155`| Hover borders, active frame emphasis |
| `text-primary` | `#F1F5F9` | Primary technical titles, code snippets, metrics |
| `text-muted` | `#94A3B8` | Subheadings, descriptions, metadata labels |
| `agent-violet` | `#8B5CF6` | Primary brand accent, LangGraph agent workflows |
| `agent-cyan` | `#06B6D4` | Vector search, FAISS index status, query intent |
| `risk-critical` | `#EF4444` | Breaking changes, signature drops, >75 debt score |
| `risk-high` | `#F97316` | High blast radius, deprecated interfaces |
| `risk-medium` | `#F59E0B` | Code smells, unhandled exceptions, TODO markers |
| `status-nominal` | `#10B981` | Safe diffs, clean AST compatibility, <20 debt score |

---

## 3. Typography Hierarchy

- **Sector Labels & Headings:** `Inter` or `Space Grotesk` (SemiBold / Bold, uppercase tracking `letter-spacing: 0.05em`).
- **Narrative Copy & Summaries:** `Inter` (13px / 14px, line-height 20px, high legibility).
- **Code Diffs, Symbols & Numbers:** `JetBrains Mono` or `Geist Mono` (`tabular-nums`, monospace font-feature-settings) for stable numeric metrics during live updates.

---

## 4. Multi-Surface Route Architecture (For Stitch UI Design)

Synthesis is organized into 7 distinct, high-impact routes:

```
Synthesis Web Platform
├── /                    # Operations Overview, Hero, Live Pipeline Visualizer, Benchmark Grid
├── /pr-risk             # Interactive Unified Diff Risk & Breaking Change Precision Analyzer
├── /architecture-qa     # LangGraph Vector Q&A Studio with Citations & Multi-Agent Trace
├── /debt-heatmap        # Codebase Technical Debt & Cyclomatic Complexity Heatmap
├── /repositories        # Multi-Repo Ingestion & FAISS Vector Indexing Console
├── /analytics           # Workspace Intelligence, Query Hotspots & Relevance Telemetry
└── /architecture        # Interactive System Topology & LangGraph Pipeline Spec
```

---

### Route 1: Landing & Pipeline Overview (`/`)
- **Hero Section:**
  - Headline: "Autonomous Codebase Intelligence & Breaking Change Prevention"
  - Subhead: "3-agent LangGraph pipeline continuously parses AST mutations, maps dependency blast radius, and computes breaking change precision before code merges."
  - Metric Badges: `50,000 LOC Indexed in < 74s` | `85% Breaking Change Precision` | `< 4.2s PR Risk Analysis` | `100% Multi-Tenant Isolation`.
- **Live Pipeline Visualizer:**
  - Animated 3-node graph representing:
    1. `AST Diff Parser Node` (Extracts deleted arguments, modified types)
    2. `Dependency Blast Radius Evaluator Node` (Traverses import DAG)
    3. `Technical Debt Scorer Node` (Evaluates cyclomatic complexity + smells)
- **Enterprise Capabilities Grid (Bento Box):**
  - Card A: AST-Level Semantic Breaking Change Detection (no dumb regex).
  - Card B: FAISS Sub-Millisecond Vector Retrieval with Citation Confidence Tiers.
  - Card C: Dependency Blast Radius & Reverse Import Call Graphs.
  - Card D: Automated Refactoring Priority & Debt Hotspot Scoring.
- **Benchmark Proof Table:**
  - Real vs. Target benchmark metrics comparing Synthesis against SonarQube & GitHub Copilot.

---

### Route 2: PR Diff Risk & Breaking Change Analyzer (`/pr-risk`)
- **Header:** Workspace selector (`organization: astral-core`, `repository: uv-runtime`), PR selector (`PR #842: Refactor Resolver Cache & Concurrency Pools`).
- **Scorecards:**
  - Breaking Change Risk: `85 / 100` (`CRITICAL RISK`, red halo).
  - Technical Debt Penalty: `62.5 / 100` (`HIGH DEBT`, amber halo).
  - Dependency Blast Radius: `14 impacted downstream modules`.
- **Interactive Diff Workbench:**
  - Left panel: Input unified diff (real Python/TypeScript AST diff with modified function signatures).
  - Trigger Button: "Run LangGraph Risk Analysis".
  - Right panel:
    - AI-Synthesized PR Summary (markdown formatted with actionable review guidance).
    - AST Mutated Symbols list (`process_transaction`, `ConnectionPool.acquire`).
    - Impacted Downstream Files list (`src/api/routes.py`, `src/workers/billing.py`).
    - Technical Debt Markers (`Unsafe broad exception clause`, `TODO: implement retry backoff`).

---

### Route 3: Architecture Q&A Studio (`/architecture-qa`)
- **Header:** Search bar with prompt suggestions:
  - *"Which modules handle workspace authorization and JWT token scoping?"*
  - *"How does the incremental FAISS indexing pipeline avoid re-embedding unchanged files?"*
  - *"Where is the Redis Celery task queue instantiated for PR webhooks?"*
- **Response Deck:**
  - Executive Architecture Summary with high-confidence explanations.
  - **LangGraph Multi-Agent Trace Stepper:**
    - Step 1: `Parser Agent` (Intent: `security_architecture_query`, Keywords: `workspace, jwt, middleware`).
    - Step 2: `Impact Analyzer Agent` (Vector Chunks: 8 analyzed, Relevance: 96.4%).
    - Step 3: `Doc Generator Agent` (Synthesized markdown response with verified symbols).
- **Code Citations Drawer:**
  - File path, symbol name, confidence tier (`HIGH 96%`), and syntax-highlighted code snippet.

---

### Route 4: Technical Debt & Refactoring Heatmap (`/debt-heatmap`)
- **Header:** Filter controls: Sort by Debt Score, Cyclomatic Complexity, or Lines of Code.
- **Visual Heatmap Grid:**
  - Matrix of indexed files colored by risk level (Critical >70 Red, High 50-70 Amber, Moderate 30-50 Yellow, Nominal <30 Green).
- **Hotspot Inspection Drawer:**
  - File name, LOC, Cyclomatic Complexity score.
  - Specific Debt Markers: `# TODO`, `# FIXME`, missing type annotations, cyclomatic branch count > 25.
  - One-click action: "Generate Refactoring Plan".

---

### Route 5: Repository Ingestion & Vector Indexer (`/repositories`)
- **Index Management Panel:**
  - Repository URL input (`https://github.com/astral-sh/uv`).
  - Target branch (`main`).
  - Toggle: `Incremental Ingestion` (Reuses unchanged AST chunks).
- **Live Indexing Audit Log:**
  - Status: `Completed in 3.42s`.
  - Statistics: `Indexed Chunks: 142`, `Reused Chunks: 118`, `New Chunks: 24`, `Deleted: 0`.
  - Memory & Disk: `FAISS Index Version ID: 0x8F2B1`, `Index Size: 1.2 MB`.

---

### Route 6: Workspace Intelligence & Query Analytics (`/analytics`)
- **Overview Cards:**
  - Total Architecture Queries: `1,284 queries`.
  - Average Vector Relevance: `94.2%`.
  - Active Workspaces: `12 isolated tenants`.
- **Analytics Charts:**
  - Top Queried Hotspot Files (`backend/app/main.py`, `backend/app/auth.py`, `backend/app/api/routes.py`).
  - Trending Architecture Topics (`JWT Scoping`, `AST Parser`, `FAISS Indexing`, `Payment Gateway`).
  - Relevance Score Distribution histogram.

---

### Route 7: System Topology & Multi-Agent Spec (`/architecture`)
- **Mermaid Interactive Flowchart:**
  - Complete data flow from GitHub Webhook / Developer UI -> FastAPI Gateway -> LangGraph StateGraph -> FAISS Vector DB + PostgreSQL -> Real-time Response.
- **Mathematical & Algorithmic Specifications:**
  - Formal definition of AST Breaking Change Precision Score.
  - Cyclomatic Complexity weight factors.
  - Cosine similarity thresholding in FAISS index retrieval.

---

## 5. Mock Data Elimination & Realism Spec

| Component | Bad Mock Data (TO REMOVE) | Real Production Data (TO USE) |
| :--- | :--- | :--- |
| Workspace / Repo | `acme-corp` / `core-api` | `astral-core` / `uv-runtime` or `pydantic-org` / `pydantic-core` |
| Author | `octocat` | `alec-dev`, `sarah-eng`, `chen-architect` |
| Auth Tokens | `Bearer mock-token-dev` | `Bearer syn_live_9f82c0a4e7` (Realistic JWT token signature format) |
| Diff Input | Trivial 2-line fake text | Real Python 3.12 async interface refactor with typed parameters |
| Hotspot Files | Generic `test1.py` | Real files: `services/ingestion.py`, `graph_orchestrator.py`, `pr_intel.py` |
| Debt Markers | "Some fake error" | "Cyclomatic branch depth > 8", "Deprecated sync I/O in async worker" |

---

## 6. Stitch MCP Implementation Guidelines

When generating screen layouts with Stitch:
1. **Layout Structure:** Use an app shell with a slim tactical top navigation bar (Logo, Workspace badge, Status pill, Quick Switcher) and a dense sidebar navigation.
2. **Container Framing:** Every panel must have a 1px border (`#1E293B`), subtle dark background (`#0E131F`), and clean uppercase section headers with font sizes 11px–12px.
3. **No Unneeded Padding:** Keep whitespace calibrated for professional developer tools (compact padding `p-4` or `p-5`, tight margins).
4. **Interactive States:** Provide hover borders (`hover:border-slate-600`), active selection indicators (`border-violet-500 bg-violet-500/10`), and accessible focus rings.
