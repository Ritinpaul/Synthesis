"use client";

import React, { useState } from "react";
import GridOnOutlinedIcon from "@mui/icons-material/GridOnOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import FilterListOutlinedIcon from "@mui/icons-material/FilterListOutlined";

type DebtFile = {
  path: string;
  debtScore: number;
  complexity: number;
  todoCount: number;
  loc: number;
  hotspotReason: string;
  recommendation: string;
};

const initialFiles: DebtFile[] = [
  {
    path: "src/auth/session.ts",
    debtScore: 92,
    complexity: 34,
    todoCount: 6,
    loc: 480,
    hotspotReason: "Deep nested callback chains and missing token revocation lock in distributed cluster.",
    recommendation: "Split into TokenRevocationStore and SessionValidator interfaces. Add Redis TTL lock.",
  },
  {
    path: "backend/app/services/ingestion.py",
    debtScore: 78,
    complexity: 28,
    todoCount: 4,
    loc: 620,
    hotspotReason: "Synchronous file chunking blocks event loop during high-concurrency GitHub webhook ingest.",
    recommendation: "Offload chunk tokenization to thread pool or Celery background worker queue.",
  },
  {
    path: "backend/app/api/routes.py",
    debtScore: 68,
    complexity: 32,
    todoCount: 2,
    loc: 540,
    hotspotReason: "Route handler contains inline database queries instead of service layer repository pattern.",
    recommendation: "Extract business logic into dedicated PullRequestService and WorkspaceService modules.",
  },
  {
    path: "backend/app/services/graph_orchestrator.py",
    debtScore: 54,
    complexity: 22,
    todoCount: 2,
    loc: 380,
    hotspotReason: "LangGraph state reducer relies on dictionary casting rather than strict Pydantic BaseModel.",
    recommendation: "Introduce TypedDict with strict runtime validation for intermediate agent state passing.",
  },
  {
    path: "backend/app/workers/billing_cron.py",
    debtScore: 48,
    complexity: 16,
    todoCount: 1,
    loc: 290,
    hotspotReason: "Batch transaction handler lacks retry backoff on third-party webhook timeout.",
    recommendation: "Implement exponential backoff retry decorator with dead-letter queue.",
  },
  {
    path: "src/utils/crypto.ts",
    debtScore: 14,
    complexity: 6,
    todoCount: 0,
    loc: 110,
    hotspotReason: "Nominal maintenance status. Pure functions with 100% test coverage.",
    recommendation: "No refactoring required. Maintain current interface contract.",
  },
];

export default function DebtHeatmapPage() {
  const [files, setFiles] = useState<DebtFile[]>(initialFiles);
  const [selectedFile, setSelectedFile] = useState<DebtFile>(initialFiles[0]);
  const [sortBy, setSortBy] = useState<"score" | "complexity" | "loc">("score");

  const getHeatmapColor = (score: number) => {
    if (score >= 80) return "bg-rose-500/30 border-rose-500/60 text-rose-300 hover:border-rose-400";
    if (score >= 60) return "bg-amber-500/25 border-amber-500/50 text-amber-300 hover:border-amber-400";
    if (score >= 40) return "bg-yellow-500/20 border-yellow-500/40 text-yellow-300 hover:border-yellow-400";
    return "bg-emerald-500/15 border-emerald-500/35 text-emerald-300 hover:border-emerald-400";
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return "bg-rose-500/15 text-rose-400 border-rose-500/30";
    if (score >= 60) return "bg-amber-500/15 text-amber-400 border-amber-500/30";
    if (score >= 40) return "bg-yellow-500/15 text-yellow-400 border-yellow-500/30";
    return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
  };

  const sortedFiles = [...files].sort((a, b) => {
    if (sortBy === "score") return b.debtScore - a.debtScore;
    if (sortBy === "complexity") return b.complexity - a.complexity;
    return b.loc - a.loc;
  });

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#142321]">
        <div>
          <div className="flex items-center space-x-2">
            <GridOnOutlinedIcon sx={{ fontSize: 22, color: "#F59E0B" }} />
            <h1 className="text-xl font-bold text-white tracking-tight">Technical Debt & Refactoring Heatmap</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Visual treemap of codebase cyclomatic complexity, code smells, and architectural refactoring priority.
          </p>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center space-x-2 text-xs">
          <FilterListOutlinedIcon sx={{ fontSize: 16, color: "#94A3B8" }} />
          <span className="text-slate-400">Sort:</span>
          <button
            onClick={() => setSortBy("score")}
            className={`px-2.5 py-1 rounded font-medium transition-colors ${
              sortBy === "score"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                : "bg-[#101B1A] text-slate-400 border border-[#142321]"
            }`}
          >
            Debt Score
          </button>
          <button
            onClick={() => setSortBy("complexity")}
            className={`px-2.5 py-1 rounded font-medium transition-colors ${
              sortBy === "complexity"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                : "bg-[#101B1A] text-slate-400 border border-[#142321]"
            }`}
          >
            Complexity
          </button>
          <button
            onClick={() => setSortBy("loc")}
            className={`px-2.5 py-1 rounded font-medium transition-colors ${
              sortBy === "loc"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                : "bg-[#101B1A] text-slate-400 border border-[#142321]"
            }`}
          >
            LOC
          </button>
        </div>
      </div>

      {/* Visual Treemap Grid */}
      <div className="rounded-xl border border-[#142321] bg-[#0A1211] p-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
            Interactive Codebase Treemap
          </span>
          <div className="flex items-center space-x-3 text-[10px] font-mono">
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded bg-rose-500"></span>
              <span className="text-slate-400">&gt; 80 Critical</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded bg-amber-500"></span>
              <span className="text-slate-400">60-80 High</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded bg-yellow-500"></span>
              <span className="text-slate-400">40-60 Moderate</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded bg-emerald-500"></span>
              <span className="text-slate-400">&lt; 40 Nominal</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
          {sortedFiles.map((file) => (
            <div
              key={file.path}
              onClick={() => setSelectedFile(file)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${getHeatmapColor(
                file.debtScore
              )} ${selectedFile.path === file.path ? "ring-2 ring-emerald-400" : ""}`}
            >
              <div className="flex items-start justify-between">
                <span className="text-xs font-mono font-semibold truncate max-w-[190px]">{file.path}</span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold border ${getScoreBadge(file.debtScore)}`}>
                  {file.debtScore}/100
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-3 pt-2 border-t border-[#142321]/50 text-[10px] font-mono">
                <div>
                  <span className="text-slate-400">Complexity: </span>
                  <span className="font-semibold text-slate-200">{file.complexity}</span>
                </div>
                <div>
                  <span className="text-slate-400">TODOs: </span>
                  <span className="font-semibold text-slate-200">{file.todoCount}</span>
                </div>
                <div>
                  <span className="text-slate-400">LOC: </span>
                  <span className="font-semibold text-slate-200">{file.loc}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Hotspot Inspection Drawer */}
      <div className="rounded-xl border border-[#142321] bg-[#0A1211] p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#142321]">
          <div>
            <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Inspecting File</div>
            <div className="text-sm font-bold text-white font-mono">{selectedFile.path}</div>
          </div>
          <span className={`text-xs font-mono px-3 py-1 rounded font-bold border ${getScoreBadge(selectedFile.debtScore)}`}>
            Debt Score: {selectedFile.debtScore}/100
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-lg bg-[#060A0A] border border-[#142321] space-y-1.5">
            <div className="flex items-center space-x-1.5 text-rose-400 font-semibold">
              <ErrorOutlineOutlinedIcon sx={{ fontSize: 16 }} />
              <span>Architectural Hotspot Diagnosis</span>
            </div>
            <p className="text-slate-300 leading-relaxed">{selectedFile.hotspotReason}</p>
          </div>

          <div className="p-3.5 rounded-lg bg-[#060A0A] border border-[#142321] space-y-1.5">
            <div className="flex items-center space-x-1.5 text-emerald-400 font-semibold">
              <CheckCircleOutlineOutlinedIcon sx={{ fontSize: 16 }} />
              <span>AI Refactoring Recommendation</span>
            </div>
            <p className="text-slate-300 leading-relaxed">{selectedFile.recommendation}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
