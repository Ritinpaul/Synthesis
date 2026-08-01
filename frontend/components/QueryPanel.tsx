"use client";

import React, { useState } from "react";
import { Terminal, Search, Cpu, FileCode, Check } from "lucide-react";
import type { ArchitectureQueryResponse } from "@/lib/types";

export function QueryPanel() {
  const [question, setQuestion] = useState("Which modules handle workspace authorization and JWT token scoping?");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ArchitectureQueryResponse | null>({
    answer:
      "### Architecture Query Analysis\n**Question:** Which modules handle workspace authorization and JWT token scoping?\n**Detected Query Intent:** `security_architecture_query` \n\nArchitecture summary:\n- **Primary Modules Affected:** `backend/app/auth.py`, `backend/app/main.py`, `backend/app/dependencies.py`\n- **Key Exported Symbols Identified:** `create_access_token`, `decode_access_token`, `workspace_scope_middleware`, `require_workspace_access`\n- **Risk & Debt Score Markers:** 0 warning signals detected across context chunks\n\n#### Synthesis Recommendation\nBased on `3` retrieved code citation(s) (Overall Relevance: `96%`), review the high-confidence code locations listed in the citations below for full dependency context.",
    citations: [
      {
        repo_id: 1,
        file_path: "backend/app/main.py",
        chunk_id: 12,
        snippet: "async def workspace_scope_middleware(request: Request, call_next):\n    if request.url.path.startswith(SCOPED_PATH_PREFIXES):\n        workspace_id_header = request.headers.get('X-Workspace-Id')",
        symbol_name: "workspace_scope_middleware",
        confidence_score: 0.96,
        confidence_tier: "high",
      },
      {
        repo_id: 1,
        file_path: "backend/app/auth.py",
        chunk_id: 4,
        snippet: "def create_access_token(user_id: int) -> str:\n    payload = {'sub': str(user_id), 'exp': datetime.now(UTC) + timedelta(minutes=JWT_EXPIRE_MINUTES)}\n    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)",
        symbol_name: "create_access_token",
        confidence_score: 0.91,
        confidence_tier: "high",
      },
      {
        repo_id: 1,
        file_path: "backend/app/dependencies.py",
        chunk_id: 8,
        snippet: "def require_workspace_access(request: Request) -> int:\n    workspace_id = getattr(request.state, 'workspace_id', None)\n    if workspace_id is None:\n        raise HTTPException(status_code=403, detail='Workspace access required')",
        symbol_name: "require_workspace_access",
        confidence_score: 0.88,
        confidence_tier: "high",
      },
    ],
    relevance_estimate: 0.96,
    trace: [
      { agent: "parser", status: "ok", detail: "parsed_intent=security_architecture_query; keywords=workspace,authorization,token" },
      { agent: "impact_analyzer", status: "ok", detail: "analyzed_chunks=3; risk_points=0; blast_files=3" },
      { agent: "doc_generator", status: "ok", detail: "synthesized_response; relevance=0.96; citations=3" },
    ],
  });

  const handleQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8010/query/architecture", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer mock-token-dev",
          "X-Workspace-Id": "1",
        },
        body: JSON.stringify({
          workspace_id: 1,
          question,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        setResult(json);
      }
    } catch {
      // Dev mode fallback
    } finally {
      setLoading(false);
    }
  };

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case "high":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "medium":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      default:
        return "bg-zinc-800 text-zinc-400 border-zinc-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
        <h2 className="text-xl font-bold text-white mb-1 flex items-center">
          <Terminal className="w-5 h-5 text-violet-400 mr-2" />
          Architecture Q&A Search Engine
        </h2>
        <p className="text-zinc-400 text-sm mb-4">
          Ask architecture, dependency, or security questions. Grounded in FAISS vector embeddings with citation confidence scores.
        </p>

        <form onSubmit={handleQuery} className="flex gap-2">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask an architecture question (e.g. Which services depend on payment gateway?)"
            className="flex-1 bg-zinc-950 border border-zinc-800 rounded-md px-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-violet-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium px-6 py-2.5 rounded-md shadow transition-all flex items-center"
          >
            <Search className="w-4 h-4 mr-2" />
            {loading ? "Synthesizing..." : "Query Engine"}
          </button>
        </form>
      </div>

      {result && (
        <div className="space-y-6">
          {/* 3-Agent Trace Output */}
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-lg p-4">
            <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3 flex items-center">
              <Cpu className="w-4 h-4 text-violet-400 mr-2" />
              LangGraph 3-Agent Execution Trace
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {result.trace.map((step, i) => (
                <div key={i} className="bg-zinc-950 border border-zinc-800/80 rounded p-3 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-violet-400 font-semibold uppercase">{step.agent} Agent</span>
                    <span className="text-emerald-400 flex items-center"><Check className="w-3 h-3 mr-1" /> {step.status}</span>
                  </div>
                  <p className="text-zinc-400 font-mono text-[11px] truncate" title={step.detail}>
                    {step.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Answer & Citations Split View */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Synthesized Answer */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-semibold text-zinc-200">Synthesized Architecture Response</h3>
                <span className="bg-violet-500/10 text-violet-400 text-xs font-bold px-2.5 py-0.5 rounded border border-violet-500/20">
                  Relevance: {(result.relevance_estimate * 100).toFixed(0)}%
                </span>
              </div>
              <div className="bg-zinc-950 border border-zinc-800 rounded p-4 text-xs font-mono text-zinc-300 whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
                {result.answer}
              </div>
            </div>

            {/* Right: Confidence-Calibrated Citations */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
              <h3 className="text-sm font-semibold text-zinc-200 mb-3 flex items-center">
                <FileCode className="w-4 h-4 text-violet-400 mr-2" />
                Retrieved Code Citations ({result.citations.length})
              </h3>
              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {result.citations.map((citation, i) => (
                  <div key={i} className="bg-zinc-950 border border-zinc-800 rounded p-3 text-xs space-y-2">
                    <div className="flex items-center justify-between font-mono">
                      <span className="text-zinc-200 font-semibold">{citation.file_path}</span>
                      <span className={`px-2 py-0.5 rounded border text-[10px] uppercase font-bold ${getTierBadge(citation.confidence_tier)}`}>
                        {citation.confidence_tier} ({(citation.confidence_score * 100).toFixed(0)}%)
                      </span>
                    </div>
                    <div className="text-[11px] text-zinc-400 font-mono">
                      Symbol: <code className="text-violet-300 bg-zinc-900 px-1 py-0.5 rounded">{citation.symbol_name}</code>
                    </div>
                    <pre className="bg-zinc-900 p-2 rounded text-[11px] text-zinc-300 font-mono overflow-x-auto whitespace-pre-wrap">
                      {citation.snippet}
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
