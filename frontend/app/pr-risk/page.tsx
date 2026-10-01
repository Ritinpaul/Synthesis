"use client";

import React, { useState, useEffect } from "react";
import GppMaybeOutlinedIcon from "@mui/icons-material/GppMaybeOutlined";
import PlayArrowOutlinedIcon from "@mui/icons-material/PlayArrowOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
import AutorenewOutlinedIcon from "@mui/icons-material/AutorenewOutlined";

import { useAuth } from "@/lib/auth-context";
import type { PRAnalyzeResponse, PRListItem } from "@/lib/types";

export default function PRRiskPage() {
  const { currentWorkspace, token } = useAuth();
  const [prNumber, setPrNumber] = useState(42);
  const [title, setTitle] = useState("feat(auth): enforce JWT workspace scoping and AST visitor cache");
  const [author, setAuthor] = useState("Ritin Pal");
  const [diffText, setDiffText] = useState(
    `--- a/backend/app/auth.py\n+++ b/backend/app/auth.py\n@@ -18,6 +18,9 @@\n-def require_workspace_access(request: Request) -> int:\n+async def require_workspace_access(request: Request, db: Session = Depends(get_db_session)) -> int:\n+    # TODO: verify token revocation in distributed Redis cluster\n`
  );
  const [loading, setLoading] = useState(false);
  const [prList, setPrList] = useState<PRListItem[]>([]);

  const wsId = currentWorkspace?.workspace_id || 1;

  const [data, setData] = useState<PRAnalyzeResponse>({
    pr_id: 42,
    repo_id: 1,
    pr_number: 42,
    title: "feat(auth): enforce JWT workspace scoping and AST visitor cache",
    author: "Ritin Pal",
    breaking_change_score: 84.5,
    debt_score: 68.0,
    summary_text:
      "High risk breaking change detected in workspace authorization contract. Modifies public require_workspace_access dependency signature impacting downstream router endpoints.",
    risk_level: "critical",
    blast_radius_count: 8,
    impacted_files: [
      "backend/app/auth.py",
      "backend/app/main.py",
      "backend/app/dependencies.py",
      "backend/app/api/routes.py",
    ],
    debt_markers: [
      "Async signature transformation requires update across all 20 FastAPI router endpoints",
      "Contains unhandled TODO: token revocation cache fallback",
    ],
    generated_at: new Date().toISOString(),
  });

  const loadPRs = async () => {
    if (!token) return;
    try {
      const res = await fetch(`/workspaces/${wsId}/prs`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Workspace-Id": String(wsId),
        },
      });
      if (res.ok) {
        const list: PRListItem[] = await res.json();
        setPrList(list);
      }
    } catch (e) {
      console.error("Failed to load PRs", e);
    }
  };

  useEffect(() => {
    loadPRs();
  }, [wsId, token]);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch("/pr/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Workspace-Id": String(wsId),
        },
        body: JSON.stringify({
          workspace_id: wsId,
          repo_id: 1,
          pr_number: Number(prNumber),
          title,
          author,
          diff_text: diffText,
        }),
      });
      if (res.ok) {
        const json = await res.json();
        setData(json);
        await loadPRs();
      }
    } catch (e) {
      console.error("PR analyze failed", e);
    } finally {
      setLoading(false);
    }
  };

  const isCritical = data.breaking_change_score >= 75;
  const isHigh = data.breaking_change_score >= 50 && data.breaking_change_score < 75;

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#142321]">
        <div>
          <div className="flex items-center space-x-2">
            <GppMaybeOutlinedIcon sx={{ fontSize: 22, color: "#10B981" }} />
            <h1 className="text-xl font-bold text-white tracking-tight">PR Risk & Blast Radius Analyzer</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            AST-level semantic diff parsing, caller graph traversal, and mathematical breaking change prediction.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-mono px-3 py-1 rounded bg-[#101B1A] border border-[#142321] text-emerald-400 font-semibold">
            Active Workspace: {currentWorkspace?.name || "Synthesis Core"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form Column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-xl border border-[#142321] bg-[#0A1211] p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#142321]">
              <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                Analyze PR Diff
              </span>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                Multi-Agent Pipeline
              </span>
            </div>

            <form onSubmit={handleAnalyze} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-slate-400 uppercase font-semibold mb-1">PR Number</label>
                  <input
                    type="number"
                    value={prNumber}
                    onChange={(e) => setPrNumber(Number(e.target.value))}
                    className="w-full bg-[#060A0A] border border-[#142321] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500/50"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 uppercase font-semibold mb-1">Author</label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full bg-[#060A0A] border border-[#142321] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 uppercase font-semibold mb-1">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#060A0A] border border-[#142321] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 uppercase font-semibold mb-1">Git Unified Diff</label>
                <textarea
                  rows={6}
                  value={diffText}
                  onChange={(e) => setDiffText(e.target.value)}
                  className="w-full font-mono bg-[#060A0A] border border-[#142321] rounded-lg p-2.5 text-[11px] text-slate-300 focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-colors flex items-center justify-center space-x-1.5 shadow-lg shadow-emerald-500/20 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <AutorenewOutlinedIcon sx={{ fontSize: 16 }} className="animate-spin" />
                    <span>Analyzing AST Diff...</span>
                  </>
                ) : (
                  <>
                    <PlayArrowOutlinedIcon sx={{ fontSize: 16 }} />
                    <span>Run Multi-Agent Risk Analysis</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Historical PRs in this workspace */}
          <div className="rounded-xl border border-[#142321] bg-[#0A1211] p-4 space-y-3">
            <div className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
              Recent PRs in {currentWorkspace?.name || "Workspace"}
            </div>
            <div className="space-y-2">
              {prList.length === 0 ? (
                <div className="text-xs text-slate-500 py-3 text-center">No PRs analyzed yet.</div>
              ) : (
                prList.map((p) => (
                  <div
                    key={p.pr_id}
                    onClick={() => {
                      setPrNumber(p.pr_number);
                      setTitle(p.title);
                      setAuthor(p.author);
                    }}
                    className="p-2.5 rounded-lg bg-[#060A0A] border border-[#142321] hover:border-emerald-500/30 cursor-pointer transition-colors flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-semibold text-white flex items-center space-x-1.5">
                        <span className="text-emerald-400">#{p.pr_number}</span>
                        <span className="truncate max-w-[200px]">{p.title}</span>
                      </div>
                      <div className="text-[10px] text-slate-500">by {p.author} • {p.created_at}</div>
                    </div>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                        p.risk_level === "critical"
                          ? "bg-red-500/15 text-red-400 border border-red-500/30"
                          : p.risk_level === "high"
                          ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                          : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                      }`}
                    >
                      {p.breaking_change_score}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Analysis Result Column */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-xl border border-[#142321] bg-[#0A1211] p-5 space-y-5">
            {/* Score Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#060A0A] border border-[#142321]">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Breaking Change Score</div>
                <div
                  className={`text-3xl font-extrabold tracking-tight mt-1 ${
                    isCritical ? "text-red-400" : isHigh ? "text-amber-400" : "text-emerald-400"
                  }`}
                >
                  {data.breaking_change_score.toFixed(1)} / 100
                </div>
                <div className="text-[10px] text-slate-400 mt-1 font-mono">AST Signature Mutation Risk</div>
              </div>

              <div className="p-4 rounded-xl bg-[#060A0A] border border-[#142321]">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Tech Debt Score</div>
                <div className="text-3xl font-extrabold text-amber-400 tracking-tight mt-1">
                  {data.debt_score.toFixed(1)} / 100
                </div>
                <div className="text-[10px] text-slate-400 mt-1 font-mono">Code Smells & TODO Density</div>
              </div>
            </div>

            {/* Summary */}
            <div className="p-4 rounded-xl bg-[#060A0A] border border-[#142321] space-y-2">
              <div className="text-xs font-semibold text-slate-200">Multi-Agent Intelligence Synthesis</div>
              <p className="text-xs text-slate-300 leading-relaxed">{data.summary_text}</p>
            </div>

            {/* Impacted Files */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-200">
                Blast Radius ({data.blast_radius_count} Callers Impacted)
              </div>
              <div className="space-y-1.5">
                {data.impacted_files.map((file, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-lg bg-[#060A0A] border border-[#142321] flex items-center justify-between text-xs"
                  >
                    <span className="font-mono text-slate-300">{file}</span>
                    <span className="text-[10px] font-mono text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                      High Impact
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Debt Markers */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-200">Automated Debt Markers</div>
              <div className="space-y-1.5">
                {data.debt_markers.map((marker, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-lg bg-[#060A0A] border border-[#142321] flex items-center space-x-2 text-xs text-slate-400"
                  >
                    <WarningAmberOutlinedIcon sx={{ fontSize: 16, color: "#F59E0B" }} />
                    <span>{marker}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
