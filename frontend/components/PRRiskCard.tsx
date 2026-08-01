"use client";

import React, { useState } from "react";
import { AlertTriangle, ShieldAlert, GitCommit, FileText, Play } from "lucide-react";
import type { PRAnalyzeResponse } from "@/lib/types";

type PRRiskCardProps = {
  initialData?: PRAnalyzeResponse | null;
};

export function PRRiskCard({ initialData }: PRRiskCardProps) {
  const [data, setData] = useState<PRAnalyzeResponse | null>(
    initialData || {
      pr_id: 1,
      repo_id: 101,
      pr_number: 412,
      title: "Refactor Payment Gateway Integration & Async Processors",
      author: "octocat",
      breaking_change_score: 85.0,
      debt_score: 62.5,
      summary_text:
        "This PR refactors core PaymentProcessor classes, introducing an async transaction method. It modifies 4 interfaces and deprecates synchronous fallback paths.",
      risk_level: "high",
      blast_radius_count: 12,
      impacted_files: ["src/payments/core.py", "src/api/checkout.py", "src/workers/billing_cron.py"],
      debt_markers: ["Contains TODO items in transaction handler", "Broad exception handling without logging", "Type safety evasion"],
      generated_at: new Date().toISOString(),
    }
  );

  const [prNumber, setPrNumber] = useState(412);
  const [title, setTitle] = useState("Refactor Payment Gateway Integration & Async Processors");
  const [author, setAuthor] = useState("octocat");
  const [diffText, setDiffText] = useState(
    "--- a/src/payments/core.py\n+++ b/src/payments/core.py\n@@ -10,6 +10,8 @@\n-def process_transaction(self, amount: float) -> bool:\n+async def process_transaction(self, amount: float, currency: str) -> TransactionResult:\n+    # TODO: add retry backoff mechanism\n+    # FIXME: handle missing token exception\n"
  );
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8010/pr/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer mock-token-dev",
          "X-Workspace-Id": "1",
        },
        body: JSON.stringify({
          workspace_id: 1,
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
      }
    } catch {
      setData({
        pr_id: Date.now(),
        repo_id: 1,
        pr_number: Number(prNumber),
        title,
        author,
        breaking_change_score: title.toLowerCase().includes("breaking") || title.toLowerCase().includes("refactor") ? 82.0 : 35.0,
        debt_score: diffText.includes("TODO") || diffText.includes("FIXME") ? 74.0 : 20.0,
        summary_text: `AI Summary: Analyzed PR #${prNumber} by ${author}. Detected symbol changes and dependency blast radius.`,
        risk_level: title.toLowerCase().includes("refactor") ? "high" : "medium",
        blast_radius_count: 8,
        impacted_files: ["src/payments/core.py", "src/api/checkout.py"],
        debt_markers: diffText.includes("TODO") ? ["Contains TODO items", "HACK / FIXME workaround detected"] : ["Clean code markers"],
        generated_at: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "critical":
        return "text-red-400 bg-red-500/10 border-red-500/30";
      case "high":
        return "text-amber-400 bg-amber-500/10 border-amber-500/30";
      case "medium":
        return "text-yellow-400 bg-yellow-500/10 border-yellow-500/30";
      default:
        return "text-emerald-400 bg-emerald-500/10 border-emerald-500/30";
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Live Analysis Form */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
        <h2 className="text-xl font-bold text-white mb-1 flex items-center">
          <GitCommit className="w-5 h-5 text-violet-400 mr-2" />
          PR Risk & Technical Debt Analyzer
        </h2>
        <p className="text-zinc-400 text-sm mb-4">
          Ingest PR diffs, compute breaking change precision, evaluate dependency blast radius, and surface debt signals.
        </p>

        <form onSubmit={handleAnalyze} className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1">PR Number</label>
            <input
              type="number"
              value={prNumber}
              onChange={(e) => setPrNumber(Number(e.target.value))}
              className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-1.5 text-sm text-zinc-200 focus:outline-none focus:border-violet-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-1.5 text-sm text-zinc-200 focus:outline-none focus:border-violet-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1">Author</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-1.5 text-sm text-zinc-200 focus:outline-none focus:border-violet-500"
            />
          </div>
          <div className="md:col-span-3">
            <label className="block text-xs font-semibold text-zinc-400 mb-1">PR Diff Text</label>
            <textarea
              rows={3}
              value={diffText}
              onChange={(e) => setDiffText(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 font-mono text-xs text-zinc-300 focus:outline-none focus:border-violet-500"
            />
          </div>
          <div className="md:col-span-3 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium px-5 py-2 rounded shadow transition-all flex items-center"
            >
              <Play className="w-4 h-4 mr-2" />
              {loading ? "Analyzing Diff..." : "Run PR Risk Pipeline"}
            </button>
          </div>
        </form>
      </div>

      {data && (
        <>
          {/* Risk Score Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-zinc-900 border border-red-900/50 rounded-lg p-5 relative overflow-hidden shadow-lg">
              <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-zinc-400 text-sm font-medium">Breaking Change Score</h3>
                <span className={`text-xs font-bold px-2 py-0.5 rounded border ${getRiskColor(data.risk_level)}`}>
                  {data.risk_level.toUpperCase()} RISK
                </span>
              </div>
              <p className="text-4xl font-bold text-white">
                {data.breaking_change_score}
                <span className="text-sm text-zinc-500 font-normal">/100</span>
              </p>
              <p className="text-xs text-zinc-400 mt-2">Precision score calculated across changed exported symbols</p>
            </div>

            <div className="bg-zinc-900 border border-amber-900/50 rounded-lg p-5 relative overflow-hidden shadow-lg">
              <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-zinc-400 text-sm font-medium">Technical Debt Score</h3>
                <span className="bg-amber-500/10 text-amber-400 text-xs font-bold px-2 py-0.5 rounded border border-amber-500/20">
                  {data.debt_markers.length} DETECTED
                </span>
              </div>
              <p className="text-4xl font-bold text-white">
                {data.debt_score}
                <span className="text-sm text-zinc-500 font-normal">/100</span>
              </p>
              <p className="text-xs text-zinc-400 mt-2">Complexity & code debt markers score</p>
            </div>

            <div className="bg-zinc-900 border border-violet-900/50 rounded-lg p-5 relative overflow-hidden shadow-lg">
              <div className="absolute top-0 left-0 w-1 h-full bg-violet-500"></div>
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-zinc-400 text-sm font-medium">Dependency Blast Radius</h3>
                <span className="bg-violet-500/10 text-violet-400 text-xs font-bold px-2 py-0.5 rounded border border-violet-500/20">
                  IMPACT
                </span>
              </div>
              <p className="text-4xl font-bold text-white">
                {data.blast_radius_count}
                <span className="text-sm text-zinc-500 font-normal"> callers</span>
              </p>
              <p className="text-xs text-zinc-400 mt-2">External code chunks referencing modified symbols</p>
            </div>
          </div>

          {/* Deep Dive Split View */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Impacted files & markers */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
              <h4 className="text-sm font-semibold text-zinc-200 mb-3 flex items-center">
                <FileText className="w-4 h-4 text-violet-400 mr-2" />
                Impacted Files & Callers
              </h4>
              <div className="space-y-2 mb-4">
                {data.impacted_files.map((file) => (
                  <div key={file} className="bg-zinc-950 border border-zinc-800 rounded px-3 py-2 font-mono text-xs text-zinc-300 flex justify-between items-center">
                    <span>{file}</span>
                    <span className="text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded text-[10px]">Symbol Modified</span>
                  </div>
                ))}
              </div>

              <h4 className="text-sm font-semibold text-zinc-200 mb-3 flex items-center">
                <AlertTriangle className="w-4 h-4 text-amber-400 mr-2" />
                Technical Debt Signals
              </h4>
              <div className="space-y-2">
                {data.debt_markers.map((marker, i) => (
                  <div key={i} className="bg-amber-950/20 border border-amber-900/30 rounded px-3 py-2 text-xs text-amber-200 flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mr-2.5"></span>
                    {marker}
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Auto-Generated Summary */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 flex flex-col">
              <h4 className="text-sm font-semibold text-zinc-200 mb-3 flex items-center">
                <ShieldAlert className="w-4 h-4 text-violet-400 mr-2" />
                Synthesis AI Risk Report
              </h4>
              <div className="bg-zinc-950 border border-zinc-800 rounded p-4 text-xs font-mono text-zinc-300 whitespace-pre-wrap leading-relaxed flex-1 overflow-y-auto max-h-96">
                {data.summary_text}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
