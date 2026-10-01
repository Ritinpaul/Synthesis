"use client";

import React, { useState } from "react";
import ShowChartOutlinedIcon from "@mui/icons-material/ShowChartOutlined";
import QueryStatsOutlinedIcon from "@mui/icons-material/QueryStatsOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import LayersOutlinedIcon from "@mui/icons-material/LayersOutlined";

export default function AnalyticsPage() {
  const [totalQueries, setTotalQueries] = useState(1284);
  const [avgRelevance, setAvgRelevance] = useState(94.2);

  const topFiles = [
    { file: "backend/app/main.py", hits: 248, relevance: 96.1 },
    { file: "backend/app/auth.py", hits: 182, relevance: 95.4 },
    { file: "backend/app/api/routes.py", hits: 156, relevance: 93.8 },
    { file: "backend/app/services/graph_orchestrator.py", hits: 112, relevance: 94.6 },
    { file: "backend/app/services/ingestion.py", hits: 94, relevance: 92.5 },
  ];

  const keywords = [
    { tag: "workspace", count: 342 },
    { tag: "authorization", count: 289 },
    { tag: "jwt", count: 245 },
    { tag: "faiss", count: 184 },
    { tag: "stategraph", count: 162 },
    { tag: "redis", count: 138 },
    { tag: "diff", count: 110 },
  ];

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#142321]">
        <div>
          <div className="flex items-center space-x-2">
            <ShowChartOutlinedIcon sx={{ fontSize: 22, color: "#06B6D4" }} />
            <h1 className="text-xl font-bold text-white tracking-tight">Workspace Intelligence & Query Analytics</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time telemetry on developer architecture questions, vector relevance accuracy, and codebase hotspots.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-mono px-3 py-1 rounded bg-[#101B1A] border border-[#142321] text-cyan-400 font-semibold">
            Telemetry Window: 30 Days
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-[#142321] bg-[#0A1211] p-4 space-y-1">
          <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Queries</div>
          <div className="text-2xl font-extrabold text-white tracking-tight">{totalQueries.toLocaleString()}</div>
          <div className="text-[10px] text-emerald-400 font-medium">↑ +14.2% vs last month</div>
        </div>

        <div className="rounded-xl border border-[#142321] bg-[#0A1211] p-4 space-y-1">
          <div className="text-[10px] text-slate-400 uppercase font-semibold">Vector Relevance</div>
          <div className="text-2xl font-extrabold text-emerald-400 tracking-tight">{avgRelevance}%</div>
          <div className="text-[10px] text-slate-400 font-mono">Mean Cosine Similarity</div>
        </div>

        <div className="rounded-xl border border-[#142321] bg-[#0A1211] p-4 space-y-1">
          <div className="text-[10px] text-slate-400 uppercase font-semibold">Cache Hit Ratio</div>
          <div className="text-2xl font-extrabold text-teal-400 tracking-tight">98.4%</div>
          <div className="text-[10px] text-slate-400 font-mono">Incremental AST Cache</div>
        </div>

        <div className="rounded-xl border border-[#142321] bg-[#0A1211] p-4 space-y-1">
          <div className="text-[10px] text-slate-400 uppercase font-semibold">Active Workspaces</div>
          <div className="text-2xl font-extrabold text-purple-400 tracking-tight">12</div>
          <div className="text-[10px] text-slate-400 font-mono">Multi-Tenant Scoped</div>
        </div>
      </div>

      {/* Main Grid: Wave Chart + Hotspot Files */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Wave Chart */}
        <div className="lg:col-span-7 rounded-xl border border-[#142321] bg-[#0A1211] p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#142321]">
            <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
              Query Frequency & Intent Trends
            </span>
            <div className="flex items-center space-x-3 text-[10px] font-mono">
              <span className="flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span className="text-slate-400">Architecture</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                <span className="text-slate-400">Dependencies</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                <span className="text-slate-400">Security</span>
              </span>
            </div>
          </div>

          <div className="h-44 w-full bg-[#060A0A] rounded-lg p-3 border border-[#142321] flex items-end">
            <svg className="w-full h-36 overflow-visible" viewBox="0 0 100 35" fill="none">
              <path
                d="M 0 30 Q 15 10 30 18 T 60 8 T 100 12"
                stroke="#10B981"
                strokeWidth="2.5"
                fill="none"
              />
              <path
                d="M 0 32 Q 20 22 40 26 T 70 14 T 100 20"
                stroke="#06B6D4"
                strokeWidth="2"
                strokeDasharray="2 2"
                fill="none"
              />
              <path
                d="M 0 34 Q 25 28 50 30 T 80 22 T 100 24"
                stroke="#A855F7"
                strokeWidth="1.5"
                fill="none"
              />
            </svg>
          </div>

          {/* Trending Keywords */}
          <div className="space-y-2 pt-2">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Trending Query Keywords</div>
            <div className="flex flex-wrap gap-1.5">
              {keywords.map((k, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded bg-[#101B1A] border border-[#142321] text-xs font-mono text-slate-300"
                >
                  #{k.tag} <strong className="text-emerald-400 font-normal">({k.count})</strong>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Top Queried Code Files */}
        <div className="lg:col-span-5 rounded-xl border border-[#142321] bg-[#0A1211] p-5 space-y-4">
          <div className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
            Most Queried Code Hotspots
          </div>

          <div className="space-y-2.5 font-mono text-xs">
            {topFiles.map((f, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-[#060A0A] border border-[#142321] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-200 font-semibold">{f.file}</span>
                  <span className="text-emerald-400 text-[11px] font-bold">{f.hits} hits</span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>Relevance: {f.relevance}%</span>
                  <span className="text-teal-300">FAISS Rank #{idx + 1}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
