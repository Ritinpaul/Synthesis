"use client";

import React from "react";
import Link from "next/link";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import GppMaybeOutlinedIcon from "@mui/icons-material/GppMaybeOutlined";
import TerminalOutlinedIcon from "@mui/icons-material/TerminalOutlined";
import GridOnOutlinedIcon from "@mui/icons-material/GridOnOutlined";
import FolderOpenOutlinedIcon from "@mui/icons-material/FolderOpenOutlined";
import ShowChartOutlinedIcon from "@mui/icons-material/ShowChartOutlined";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
import SpeedOutlinedIcon from "@mui/icons-material/SpeedOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import StorageOutlinedIcon from "@mui/icons-material/StorageOutlined";
import CodeOutlinedIcon from "@mui/icons-material/CodeOutlined";
import LaunchOutlinedIcon from "@mui/icons-material/LaunchOutlined";
import GitHubIcon from "@mui/icons-material/GitHub";

export default function OverviewPage() {
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Hero Section */}
      <section className="relative rounded-2xl border border-[#142321] bg-[#0A1211] p-7 md:p-10 overflow-hidden emerald-glow hero-landscape-bg">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Headline, Actions & Metrics */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[11px] font-semibold tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>AI-Powered Codebase Intelligence</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
                See the impact <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                  before you merge.
                </span>
              </h1>
              <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-xl">
                Multi-agent analysis for safer, smarter, and faster development. Detect breaking changes,
                visualize dependencies, and explore your codebase with AI — in seconds.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                href="/pr-risk"
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-[#060A0A] font-semibold text-xs transition-all shadow-md shadow-emerald-950/60"
              >
                <span>Analyze a Pull Request</span>
                <ArrowForwardOutlinedIcon sx={{ fontSize: 16 }} />
              </Link>

              <Link
                href="/repositories"
                className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-lg bg-[#101B1A] hover:bg-[#152422] border border-[#142321] text-slate-200 font-medium text-xs transition-all"
              >
                <GitHubIcon sx={{ fontSize: 16 }} />
                <span>Connect Repository</span>
              </Link>
            </div>

            {/* 4 Metric Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
              <div className="p-3 rounded-xl bg-[#101B1A]/80 border border-[#142321]">
                <div className="text-emerald-400 mb-1">
                  <CodeOutlinedIcon sx={{ fontSize: 18 }} />
                </div>
                <div className="text-lg font-bold text-white tracking-tight">50,000+</div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wide">LOC Indexed</div>
              </div>

              <div className="p-3 rounded-xl bg-[#101B1A]/80 border border-[#142321]">
                <div className="text-emerald-400 mb-1">
                  <SecurityOutlinedIcon sx={{ fontSize: 18 }} />
                </div>
                <div className="text-lg font-bold text-white tracking-tight">85%</div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wide">Breaking Precision</div>
              </div>

              <div className="p-3 rounded-xl bg-[#101B1A]/80 border border-[#142321]">
                <div className="text-emerald-400 mb-1">
                  <SpeedOutlinedIcon sx={{ fontSize: 18 }} />
                </div>
                <div className="text-lg font-bold text-white tracking-tight">&lt; 4.2s</div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wide">Analysis Time</div>
              </div>

              <div className="p-3 rounded-xl bg-[#101B1A]/80 border border-[#142321]">
                <div className="text-emerald-400 mb-1">
                  <StorageOutlinedIcon sx={{ fontSize: 18 }} />
                </div>
                <div className="text-lg font-bold text-white tracking-tight">100%</div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wide">Workspace Isolation</div>
              </div>
            </div>
          </div>

          {/* Right Column: LangGraph 3-Agent Pipeline Stepper */}
          <div className="lg:col-span-5 bg-[#0D1715]/90 border border-[#142321] rounded-xl p-5 space-y-4 backdrop-blur-md">
            <div className="flex items-center justify-between pb-2 border-b border-[#142321]">
              <div className="flex items-center space-x-2">
                <AccountTreeOutlinedIcon sx={{ fontSize: 18, color: "#10B981" }} />
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-200">
                  LangGraph Pipeline
                </span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Active StateGraph
              </span>
            </div>

            <div className="space-y-3">
              {/* Node 1 */}
              <div className="flex items-start space-x-3.5 p-3 rounded-lg bg-[#101B1A] border border-[#142321]">
                <div className="w-6 h-6 rounded-md bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-100">AST Diff Parser</div>
                  <div className="text-[11px] text-slate-400 leading-snug">
                    Extracts modified symbols, deleted arguments, and return type changes.
                  </div>
                </div>
              </div>

              {/* Node 2 */}
              <div className="flex items-start space-x-3.5 p-3 rounded-lg bg-[#101B1A] border border-[#142321]">
                <div className="w-6 h-6 rounded-md bg-amber-500/20 border border-amber-500/40 text-amber-400 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-100">Blast Radius Evaluator</div>
                  <div className="text-[11px] text-slate-400 leading-snug">
                    Maps dependency graph impact, reverse imports, and downstream callers.
                  </div>
                </div>
              </div>

              {/* Node 3 */}
              <div className="flex items-start space-x-3.5 p-3 rounded-lg bg-[#101B1A] border border-[#142321]">
                <div className="w-6 h-6 rounded-md bg-rose-500/20 border border-rose-500/40 text-rose-400 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-100">Technical Debt Scorer</div>
                  <div className="text-[11px] text-slate-400 leading-snug">
                    Analyzes complexity, code smells, and calculates breaking change risk.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6-Card Interactive Bento Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Operational Capabilities
          </h2>
          <span className="text-[11px] text-emerald-400 font-mono">
            6 Connected Surfaces
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Card 1: PR Risk Analyzer */}
          <Link
            href="/pr-risk"
            className="group rounded-xl border border-[#142321] bg-[#0A1211] p-5 flex flex-col justify-between hover:border-emerald-500/40 transition-all hover:bg-[#0D1715]"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs font-semibold text-slate-200">
                  <GppMaybeOutlinedIcon sx={{ fontSize: 18, color: "#EF4444" }} />
                  <span>PR Risk Analyzer</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/15 border border-rose-500/30 text-rose-400 font-bold">
                    85/100 High Risk
                  </span>
                  <LaunchOutlinedIcon sx={{ fontSize: 14, color: "#64748B" }} />
                </div>
              </div>

              {/* Code Diff Preview */}
              <div className="bg-[#060A0A] rounded-lg p-3 font-mono text-[11px] leading-tight space-y-1 border border-[#142321]">
                <div className="text-slate-500">@@ src/payments/core.py @@</div>
                <div className="text-rose-400 bg-rose-500/10 px-1 py-0.5 rounded">
                  - def process_transaction(self, amount: float) -&gt; bool:
                </div>
                <div className="text-emerald-400 bg-emerald-500/10 px-1 py-0.5 rounded">
                  + async def process_transaction(self, amount: float, currency: str):
                </div>
              </div>

              <div className="text-[11px] text-slate-400 leading-snug">
                Detects breaking API mutations, modified signatures, and calculates risk score before merge.
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between text-xs text-emerald-400 font-medium group-hover:translate-x-1 transition-transform">
              <span>Open Risk Workbench</span>
              <ArrowForwardOutlinedIcon sx={{ fontSize: 14 }} />
            </div>
          </Link>

          {/* Card 2: Architecture Q&A */}
          <Link
            href="/architecture-qa"
            className="group rounded-xl border border-[#142321] bg-[#0A1211] p-5 flex flex-col justify-between hover:border-emerald-500/40 transition-all hover:bg-[#0D1715]"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs font-semibold text-slate-200">
                  <TerminalOutlinedIcon sx={{ fontSize: 18, color: "#10B981" }} />
                  <span>Architecture Q&A</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    3 sources cited
                  </span>
                  <LaunchOutlinedIcon sx={{ fontSize: 14, color: "#64748B" }} />
                </div>
              </div>

              <div className="bg-[#060A0A] rounded-lg p-3 text-xs border border-[#142321] space-y-1.5">
                <div className="text-slate-400 italic">"How does the auth module handle session expiry?"</div>
                <div className="text-[11px] font-mono text-emerald-300 line-clamp-2">
                  → `backend/app/auth.py` creates access token with `JWT_EXPIRE_MINUTES` payload validation.
                </div>
              </div>

              <div className="text-[11px] text-slate-400 leading-snug">
                Multi-agent LangGraph questions over FAISS vector chunks with high-confidence code citations.
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between text-xs text-emerald-400 font-medium group-hover:translate-x-1 transition-transform">
              <span>Ask Architecture Query</span>
              <ArrowForwardOutlinedIcon sx={{ fontSize: 14 }} />
            </div>
          </Link>

          {/* Card 3: Debt Heatmap */}
          <Link
            href="/debt-heatmap"
            className="group rounded-xl border border-[#142321] bg-[#0A1211] p-5 flex flex-col justify-between hover:border-emerald-500/40 transition-all hover:bg-[#0D1715]"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs font-semibold text-slate-200">
                  <GridOnOutlinedIcon sx={{ fontSize: 18, color: "#F59E0B" }} />
                  <span>Debt Heatmap</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 text-amber-400">
                    Hotspots Monitored
                  </span>
                  <LaunchOutlinedIcon sx={{ fontSize: 14, color: "#64748B" }} />
                </div>
              </div>

              {/* Treemap visual preview */}
              <div className="grid grid-cols-4 gap-1.5 h-20">
                <div className="col-span-2 bg-rose-500/40 border border-rose-500/60 rounded p-1.5 flex flex-col justify-between">
                  <span className="text-[9px] font-mono text-rose-200 truncate">src/auth/session.ts</span>
                  <span className="text-[9px] font-bold text-rose-300">Debt: 92</span>
                </div>
                <div className="col-span-1 bg-amber-500/30 border border-amber-500/50 rounded p-1.5 flex flex-col justify-between">
                  <span className="text-[9px] font-mono text-amber-200 truncate">api/routes</span>
                  <span className="text-[9px] font-bold text-amber-300">Debt: 68</span>
                </div>
                <div className="col-span-1 bg-emerald-500/20 border border-emerald-500/40 rounded p-1.5 flex flex-col justify-between">
                  <span className="text-[9px] font-mono text-emerald-200 truncate">utils</span>
                  <span className="text-[9px] font-bold text-emerald-300">Debt: 14</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 leading-snug">
                Cyclomatic complexity, unhandled branches, and maintainability metrics across indexed files.
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between text-xs text-emerald-400 font-medium group-hover:translate-x-1 transition-transform">
              <span>Inspect Codebase Heatmap</span>
              <ArrowForwardOutlinedIcon sx={{ fontSize: 14 }} />
            </div>
          </Link>

          {/* Card 4: Repositories */}
          <Link
            href="/repositories"
            className="group rounded-xl border border-[#142321] bg-[#0A1211] p-5 flex flex-col justify-between hover:border-emerald-500/40 transition-all hover:bg-[#0D1715]"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs font-semibold text-slate-200">
                  <FolderOpenOutlinedIcon sx={{ fontSize: 18, color: "#14B8A6" }} />
                  <span>Repositories</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-500/10 border border-teal-500/20 text-teal-400">
                    4 Active
                  </span>
                  <LaunchOutlinedIcon sx={{ fontSize: 14, color: "#64748B" }} />
                </div>
              </div>

              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex items-center justify-between py-1 px-2 rounded bg-[#060A0A] border border-[#142321]">
                  <span className="text-slate-300">astral-core</span>
                  <span className="text-emerald-400 text-[10px]">50,000 LOC</span>
                </div>
                <div className="flex items-center justify-between py-1 px-2 rounded bg-[#060A0A] border border-[#142321]">
                  <span className="text-slate-300">web-client</span>
                  <span className="text-slate-400 text-[10px]">12,300 LOC</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 leading-snug">
                Incremental AST parsing that avoids re-embedding unchanged repository chunks.
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between text-xs text-emerald-400 font-medium group-hover:translate-x-1 transition-transform">
              <span>Manage Repositories</span>
              <ArrowForwardOutlinedIcon sx={{ fontSize: 14 }} />
            </div>
          </Link>

          {/* Card 5: Analytics */}
          <Link
            href="/analytics"
            className="group rounded-xl border border-[#142321] bg-[#0A1211] p-5 flex flex-col justify-between hover:border-emerald-500/40 transition-all hover:bg-[#0D1715]"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs font-semibold text-slate-200">
                  <ShowChartOutlinedIcon sx={{ fontSize: 18, color: "#06B6D4" }} />
                  <span>Analytics</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                    248 queries +12%
                  </span>
                  <LaunchOutlinedIcon sx={{ fontSize: 14, color: "#64748B" }} />
                </div>
              </div>

              {/* Dynamic SVG wave preview */}
              <div className="h-20 w-full bg-[#060A0A] rounded-lg p-2 border border-[#142321] flex items-end">
                <svg className="w-full h-14 overflow-visible" viewBox="0 0 100 30" fill="none">
                  <path
                    d="M 0 25 Q 25 5 50 15 T 100 8"
                    stroke="#10B981"
                    strokeWidth="2"
                    fill="none"
                  />
                  <path
                    d="M 0 28 Q 25 18 50 20 T 100 15"
                    stroke="#06B6D4"
                    strokeWidth="1.5"
                    strokeDasharray="2 2"
                    fill="none"
                  />
                </svg>
              </div>

              <div className="text-[11px] text-slate-400 leading-snug">
                Track top queried files, vector relevance scores, and trending architecture questions.
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between text-xs text-emerald-400 font-medium group-hover:translate-x-1 transition-transform">
              <span>View Query Telemetry</span>
              <ArrowForwardOutlinedIcon sx={{ fontSize: 14 }} />
            </div>
          </Link>

          {/* Card 6: System Architecture */}
          <Link
            href="/architecture"
            className="group rounded-xl border border-[#142321] bg-[#0A1211] p-5 flex flex-col justify-between hover:border-emerald-500/40 transition-all hover:bg-[#0D1715]"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs font-semibold text-slate-200">
                  <AccountTreeOutlinedIcon sx={{ fontSize: 18, color: "#8B5CF6" }} />
                  <span>System Architecture</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-violet-500/10 border border-violet-500/20 text-violet-400">
                    LangGraph 3.0
                  </span>
                  <LaunchOutlinedIcon sx={{ fontSize: 14, color: "#64748B" }} />
                </div>
              </div>

              {/* Node graph flow */}
              <div className="flex items-center justify-between text-[10px] font-mono bg-[#060A0A] p-2.5 rounded-lg border border-[#142321]">
                <span className="px-2 py-1 rounded bg-[#101B1A] text-slate-300">Next.js 14</span>
                <span className="text-slate-600">→</span>
                <span className="px-2 py-1 rounded bg-[#101B1A] text-emerald-400">FastAPI</span>
                <span className="text-slate-600">→</span>
                <span className="px-2 py-1 rounded bg-[#101B1A] text-violet-400">LangGraph</span>
              </div>

              <div className="text-[11px] text-slate-400 leading-snug">
                Inspect the complete multi-agent DAG, mathematical precision formulations, and OpenAPI specs.
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between text-xs text-emerald-400 font-medium group-hover:translate-x-1 transition-transform">
              <span>View System Topology</span>
              <ArrowForwardOutlinedIcon sx={{ fontSize: 14 }} />
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
