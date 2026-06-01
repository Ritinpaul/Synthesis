<div align="center">

# 🧠 Synthesis

### AI-Powered Multi-Agent Codebase Intelligence & PR Risk Platform

[![TypeScript](https://img.shields.io/badge/TypeScript-5.5+-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Next.js](https://img.shields.io/badge/Next.js-14.2-000000?style=flat-square&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![LangGraph](https://img.shields.io/badge/LangGraph-3--Agent_Pipeline-FF6F00?style=flat-square)](https://langchain-ai.github.io/langgraph/)
[![License](https://img.shields.io/badge/license-MIT-00d4aa?style=flat-square)](LICENSE)

*An enterprise code intelligence platform — automated PR diff risk scoring, breaking change precision evaluation, dependency blast radius mapping, and architecture Q&A.*

</div>

---

## What Is Synthesis?

Synthesis is a **full-stack AI agent platform** that analyzes pull request diffs and codebase structures to prevent breaking architectural changes before code reaches production. Driven by a 3-agent LangGraph workflow (`AST Parser`, `Dependency Blast Radius Evaluator`, `Technical Debt Scorer`), Synthesis computes breaking change precision scores, identifies exposed symbol mutations, and visualizes code health heatmaps.

---

## 🖥️ Live Next.js Dashboard

> **Captured live from the running application** — PR Risk & Technical Debt Analyzer with breaking change precision scoring (85/100 HIGH RISK), AST diff parsing, and workspace navigation.

![Synthesis Dashboard](media/dashboard_screenshot.png)

---

## 🛠️ Live Backend API Docs

> **Captured live from the FastAPI Swagger UI** — complete OpenAPI 3.1 specification for PR risk evaluation, vector search, and repository indexing.

![Synthesis Swagger UI](media/synthesis_docs.png)

---

## Architecture

```
+--------------------------------------------------------------------+
|                  SYNTHESIS NEXT.JS 14 FRONTEND                     |
|  PRRiskAnalyzer | ArchitectureQ&A | DebtHeatmap | WorkspaceNav     |
+---------------------------------v----------------------------------+
                                  | REST / SSE
+---------------------------------v----------------------------------+
|                      FASTAPI BACKEND GATEWAY                       |
|   Workspace Isolation | JWT Auth | CORS | OpenAPI 3.1 Specs        |
+---------------------------------v----------------------------------+
                                  |
+---------------------------------v----------------------------------+
|                   LANGGRAPH 3-AGENT WORKFLOW                       |
|                                                                    |
|  1. AST Diff Parser Agent   -> Extract modified exported symbols  |
|  2. Blast Radius Evaluator  -> Map graph dependency impact        |
|  3. Tech Debt Scorer Agent  -> Compute breaking change score (0-100)|
+---------------------------------v----------------------------------+
                                  |
+---------------------------------v----------------------------------+
|                    PERSISTENCE & VECTOR STORE                      |
|  SQLite/PostgreSQL metadata | ChromaDB vector embeddings           |
+--------------------------------------------------------------------+
```

---

## Tech Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | Next.js 14, Tailwind CSS, TypeScript | Cyberpunk dark-mode intelligence dashboard |
| **Backend** | FastAPI, Python 3.11 | High-throughput async REST API |
| **Agent Pipeline** | LangGraph | 3-agent graph workflow for automated PR auditing |
| **Vector Engine** | ChromaDB | Repository AST code embeddings for Q&A |

---

## 🚀 Quick Start

### 1. Run Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn app.main:app --port 8010 --reload
# → API live at http://localhost:8010/docs
```

### 2. Run Frontend

```bash
cd frontend
npm install
npm run dev
# → Dashboard live at http://localhost:3000
```

---

## License

MIT — portfolio demonstration of AI-powered codebase intelligence & PR risk analysis.
