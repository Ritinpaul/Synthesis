"use client";

import React, { useState, useEffect } from "react";
import GridOnOutlinedIcon from "@mui/icons-material/GridOnOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import AutorenewOutlinedIcon from "@mui/icons-material/AutorenewOutlined";

import { useAuth } from "@/lib/auth-context";
import type { DebtHeatmapItem } from "@/lib/types";

export default function DebtHeatmapPage() {
  const { currentWorkspace, token } = useAuth();
  const [filter, setFilter] = useState<"all" | "critical" | "warning" | "stable">("all");
  const [modules, setModules] = useState<DebtHeatmapItem[]>([]);
  const [loading, setLoading] = useState(true);

  const wsId = currentWorkspace?.workspace_id || 1;

  useEffect(() => {
    const loadHeatmap = async () => {
      if (!token) return;
      try {
        setLoading(true);
        const res = await fetch(`/workspaces/${wsId}/debt-heatmap`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Workspace-Id": String(wsId),
          },
        });
        if (res.ok) {
          const data = await res.json();
          setModules(data.modules || []);
        }
      } catch (e) {
        console.error("Failed to load debt heatmap", e);
      } finally {
        setLoading(false);
      }
    };
    loadHeatmap();
  }, [wsId, token]);

  const filtered = modules.filter((f) => (filter === "all" ? true : f.status === filter));

  const criticalCount = modules.filter((m) => m.status === "critical").length;
  const warningCount = modules.filter((m) => m.status === "warning").length;
  const stableCount = modules.filter((m) => m.status === "stable").length;
  const avgDebt = modules.length > 0 ? (modules.reduce((a, b) => a + b.risk_score, 0) / modules.length).toFixed(1) : "0";

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#142321]">
        <div>
          <div className="flex items-center space-x-2">
            <GridOnOutlinedIcon sx={{ fontSize: 22, color: "#10B981" }} />
            <h1 className="text-xl font-bold text-white tracking-tight">Codebase Technical Debt Heatmap</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Component-level debt scores, cyclomatic complexity, and refactoring urgency for {currentWorkspace?.name || "Active Workspace"}.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-mono px-3 py-1 rounded bg-[#101B1A] border border-[#142321] text-emerald-400 font-semibold">
            Avg Debt Score: {avgDebt} / 100
          </span>
          <span className="text-[11px] font-mono px-3 py-1 rounded bg-[#101B1A] border border-[#142321] text-red-400 font-semibold">
            {criticalCount} Critical Modules
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {(["all", "critical", "warning", "stable"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
              filter === t
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                : "bg-[#0A1211] border border-[#142321] text-slate-400 hover:text-slate-200"
            }`}
          >
            {t} {t === "all" ? `(${modules.length})` : t === "critical" ? `(${criticalCount})` : t === "warning" ? `(${warningCount})` : `(${stableCount})`}
          </button>
        ))}
      </div>

      {/* Grid of File Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full py-12 text-center text-slate-500">
            <AutorenewOutlinedIcon sx={{ fontSize: 22 }} className="animate-spin mr-2" />
            Calculating technical debt matrix from Supabase...
          </div>
        ) : filtered.map((f, i) => (
          <div
            key={i}
            className={`rounded-xl border p-4 space-y-3 bg-[#0A1211] transition-all hover:translate-y-[-2px] ${
              f.status === "critical"
                ? "border-red-500/30 hover:border-red-500/50"
                : f.status === "warning"
                ? "border-amber-500/30 hover:border-amber-500/50"
                : "border-emerald-500/30 hover:border-emerald-500/50"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-white truncate max-w-[200px]">
                {f.file_path}
              </span>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                  f.status === "critical"
                    ? "bg-red-500/10 text-red-400 border border-red-500/20"
                    : f.status === "warning"
                    ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                }`}
              >
                {f.status}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 p-2.5 rounded-lg bg-[#060A0A] border border-[#142321] text-center text-xs">
              <div>
                <div className="text-[9px] text-slate-500 uppercase font-semibold">Debt</div>
                <div className="font-bold font-mono text-white mt-0.5">{f.risk_score}</div>
              </div>
              <div>
                <div className="text-[9px] text-slate-500 uppercase font-semibold">Symbol</div>
                <div className="font-bold font-mono text-slate-300 mt-0.5 truncate">{f.symbol_name}</div>
              </div>
              <div>
                <div className="text-[9px] text-slate-500 uppercase font-semibold">LOC</div>
                <div className="font-bold font-mono text-slate-300 mt-0.5">{f.loc}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
