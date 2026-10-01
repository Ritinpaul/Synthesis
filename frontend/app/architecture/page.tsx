"use client";

import React from "react";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
import FunctionsOutlinedIcon from "@mui/icons-material/FunctionsOutlined";
import ApiOutlinedIcon from "@mui/icons-material/ApiOutlined";
import { SynthesisMermaid } from "@/components/SynthesisMermaid";

const mermaidChart = `
graph TD
    classDef client fill:#0A1211,stroke:#10B981,stroke-width:1.5px,color:#F8FAFC;
    classDef gateway fill:#101B1A,stroke:#06B6D4,stroke-width:1.5px,color:#F8FAFC;
    classDef agentNode fill:#132220,stroke:#8B5CF6,stroke-width:1.5px,color:#F8FAFC;
    classDef storage fill:#09100E,stroke:#F59E0B,stroke-width:1.5px,color:#F8FAFC;

    subgraph ClientLayer ["1. Next.js 14 Client Layer"]
        UI["Command Center UI"]:::client
        PRRisk["PR Risk Analyzer"]:::client
        ArchQA["Architecture Q&A"]:::client
        Heatmap["Debt Heatmap"]:::client
    end

    subgraph GatewayLayer ["2. FastAPI Gateway Layer"]
        API["FastAPI 0.110 Router"]:::gateway
        Auth["JWT & X-Workspace-Id"]:::gateway
        Webhook["GitHub Webhook Ingestion"]:::gateway
    end

    subgraph LangGraphLayer ["3. LangGraph 3-Agent StateGraph"]
        ASTParser["Agent 1: AST Diff Parser<br/>(Extracts function signature mutations)"]:::agentNode
        BlastRadius["Agent 2: Blast Radius Evaluator<br/>(Traverses import DAG & callers)"]:::agentNode
        DebtScorer["Agent 3: Tech Debt Scorer<br/>(Computes 0-100 breaking score)"]:::agentNode
    end

    subgraph StorageLayer ["4. Persistence & Vector Engine"]
        FAISS["FAISS Vector Store<br/>(Sub-ms code chunk search)"]:::storage
        Postgres["PostgreSQL / SQLAlchemy<br/>(Workspaces, Pull Requests, Query Logs)"]:::storage
    end

    UI --> API
    PRRisk --> API
    ArchQA --> API
    Heatmap --> API
    Webhook --> API

    API --> Auth
    Auth --> ASTParser

    ASTParser --> BlastRadius
    BlastRadius --> DebtScorer

    DebtScorer --> FAISS
    DebtScorer --> Postgres
`;

export default function ArchitecturePage() {
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#142321]">
        <div>
          <div className="flex items-center space-x-2">
            <AccountTreeOutlinedIcon sx={{ fontSize: 22, color: "#8B5CF6" }} />
            <h1 className="text-xl font-bold text-white tracking-tight">System Architecture & Multi-Agent Specification</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            End-to-end topology diagram, LangGraph StateGraph agent definitions, and mathematical precision models.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-mono px-3 py-1 rounded bg-[#101B1A] border border-[#142321] text-purple-400 font-semibold">
            Topology: LangGraph 3-Agent StateGraph
          </span>
        </div>
      </div>

      {/* Interactive Mermaid Diagram */}
      <div className="rounded-xl border border-[#142321] bg-[#0A1211] p-5 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#142321]">
          <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
            Distributed Pipeline Flowchart
          </span>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            Interactive Mermaid.js
          </span>
        </div>

        <div className="bg-[#060A0A] p-4 rounded-xl border border-[#142321]">
          <SynthesisMermaid chart={mermaidChart} />
        </div>
      </div>

      {/* Mathematical Formulations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl border border-[#142321] bg-[#0A1211] p-5 space-y-3">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-200">
            <FunctionsOutlinedIcon sx={{ fontSize: 18, color: "#10B981" }} />
            <span>Breaking Change Precision Score Formula</span>
          </div>

          <div className="p-3 bg-[#060A0A] rounded-lg font-mono text-xs text-emerald-400 border border-[#142321] overflow-x-auto">
            Score = min(100, (W_sig × Δ_sig) + (W_args × Δ_args) + (W_callers × log2(1 + N_callers)))
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Where <code className="text-slate-300">W_sig = 40.0</code> for removed methods, <code className="text-slate-300">W_args = 25.0</code> for modified non-default arguments, and logarithmic caller weighting scales gracefully up to 100 callers.
          </p>
        </div>

        <div className="rounded-xl border border-[#142321] bg-[#0A1211] p-5 space-y-3">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-200">
            <FunctionsOutlinedIcon sx={{ fontSize: 18, color: "#06B6D4" }} />
            <span>FAISS Vector Cosine Similarity</span>
          </div>

          <div className="p-3 bg-[#060A0A] rounded-lg font-mono text-xs text-cyan-400 border border-[#142321] overflow-x-auto">
            Sim(Q, C_i) = (Q · C_i) / (||Q|| × ||C_i||) ≥ θ_threshold (0.85)
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Code chunk embeddings are pre-normalized to unit spheres. Cosine similarity threshold <code className="text-slate-300">θ = 0.85</code> eliminates hallucinated low-relevance citations during prompt generation.
          </p>
        </div>
      </div>

      {/* OpenAPI Reference Table */}
      <div className="rounded-xl border border-[#142321] bg-[#0A1211] p-5 space-y-4">
        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-200">
          <ApiOutlinedIcon sx={{ fontSize: 18, color: "#10B981" }} />
          <span>Core REST & Webhook API Endpoints</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono text-left">
            <thead>
              <tr className="border-b border-[#142321] text-slate-400 text-[10px] uppercase">
                <th className="py-2 px-3">Method</th>
                <th className="py-2 px-3">Endpoint</th>
                <th className="py-2 px-3">Description</th>
                <th className="py-2 px-3">Guardrail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#142321] text-slate-300">
              <tr>
                <td className="py-2 px-3 text-emerald-400 font-bold">POST</td>
                <td className="py-2 px-3 text-white">/pr/analyze</td>
                <td className="py-2 px-3">Execute 3-agent AST diff analysis</td>
                <td className="py-2 px-3 text-slate-400">X-Workspace-Id</td>
              </tr>
              <tr>
                <td className="py-2 px-3 text-emerald-400 font-bold">POST</td>
                <td className="py-2 px-3 text-white">/query/architecture</td>
                <td className="py-2 px-3">FAISS vector question answering</td>
                <td className="py-2 px-3 text-slate-400">Top-8 threshold</td>
              </tr>
              <tr>
                <td className="py-2 px-3 text-emerald-400 font-bold">POST</td>
                <td className="py-2 px-3 text-white">/repos/index</td>
                <td className="py-2 px-3">AST chunking & FAISS index build</td>
                <td className="py-2 px-3 text-slate-400">Incremental SHA</td>
              </tr>
              <tr>
                <td className="py-2 px-3 text-cyan-400 font-bold">GET</td>
                <td className="py-2 px-3 text-white">/workspaces/:id/analytics</td>
                <td className="py-2 px-3">Workspace telemetry & query logs</td>
                <td className="py-2 px-3 text-slate-400">Tenant Scoped</td>
              </tr>
              <tr>
                <td className="py-2 px-3 text-emerald-400 font-bold">POST</td>
                <td className="py-2 px-3 text-white">/webhooks/github</td>
                <td className="py-2 px-3">Automated PR sync webhook</td>
                <td className="py-2 px-3 text-slate-400">HMAC Signature</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
