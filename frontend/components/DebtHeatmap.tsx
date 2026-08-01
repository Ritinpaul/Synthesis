"use client";

import React from "react";
import { Layers, Flame } from "lucide-react";

type FileDebtItem = {
  path: string;
  debtScore: number;
  complexity: number;
  todoCount: number;
  lastModified: string;
};

const mockDebtFiles: FileDebtItem[] = [
  { path: "backend/app/services/ingestion.py", debtScore: 78, complexity: 24, todoCount: 4, lastModified: "2 hours ago" },
  { path: "backend/app/api/routes.py", debtScore: 65, complexity: 32, todoCount: 2, lastModified: "1 hour ago" },
  { path: "backend/app/services/graph_orchestrator.py", debtScore: 45, complexity: 18, todoCount: 1, lastModified: "3 hours ago" },
  { path: "backend/app/services/pr_intel.py", debtScore: 35, complexity: 15, todoCount: 0, lastModified: "Just now" },
  { path: "backend/app/auth.py", debtScore: 12, complexity: 8, todoCount: 0, lastModified: "1 day ago" },
];

export function DebtHeatmap() {
  const getHeatmapColor = (score: number) => {
    if (score >= 70) return "bg-red-950/60 border-red-500/40 text-red-300";
    if (score >= 50) return "bg-amber-950/60 border-amber-500/40 text-amber-300";
    if (score >= 30) return "bg-yellow-950/40 border-yellow-500/30 text-yellow-300";
    return "bg-emerald-950/30 border-emerald-500/30 text-emerald-300";
  };

  return (
    <div className="space-y-6">
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
        <h2 className="text-xl font-bold text-white mb-1 flex items-center">
          <Layers className="w-5 h-5 text-violet-400 mr-2" />
          Technical Debt Heatmap & Refactoring Priority
        </h2>
        <p className="text-zinc-400 text-sm">
          Aggregated technical debt markers, cyclomatic complexity estimates, and architectural hotspot visualization across indexed repository files.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockDebtFiles.map((file) => (
          <div
            key={file.path}
            className={`border rounded-lg p-4 relative flex flex-col justify-between transition-all hover:scale-[1.01] ${getHeatmapColor(
              file.debtScore
            )}`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs truncate max-w-[200px]" title={file.path}>
                  {file.path}
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-zinc-950/80 border border-zinc-800">
                  Score: {file.debtScore}
                </span>
              </div>

              <div className="space-y-1.5 my-3 text-xs text-zinc-300">
                <div className="flex justify-between">
                  <span>Complexity Rank:</span>
                  <span className="font-semibold">{file.complexity}</span>
                </div>
                <div className="flex justify-between">
                  <span>TODO / FIXME Markers:</span>
                  <span className="font-semibold">{file.todoCount}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Last Index Touch:</span>
                  <span>{file.lastModified}</span>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-zinc-800/50 flex justify-between items-center text-[11px]">
              <span className="flex items-center text-zinc-400">
                <Flame className="w-3.5 h-3.5 mr-1 text-amber-400" />
                {file.debtScore >= 60 ? "High Refactor Urgency" : "Maintainable"}
              </span>
              <button className="text-violet-400 hover:text-violet-300 font-medium">Drilldown →</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
