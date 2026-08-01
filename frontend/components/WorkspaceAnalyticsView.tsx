"use client";

import React, { useEffect, useState } from "react";
import { BarChart3, Search, Activity, Tag, FileText } from "lucide-react";
import type { WorkspaceAnalyticsResponse } from "@/lib/types";

export function WorkspaceAnalyticsView() {
  const [analytics, setAnalytics] = useState<WorkspaceAnalyticsResponse | null>({
    workspace_id: 1,
    total_queries: 24,
    avg_relevance_score: 0.92,
    top_queried_files: [
      { file_path: "backend/app/main.py", query_hits: 18 },
      { file_path: "backend/app/api/routes.py", query_hits: 14 },
      { file_path: "backend/app/services/ingestion.py", query_hits: 9 },
      { file_path: "backend/app/services/graph_orchestrator.py", query_hits: 7 },
    ],
    top_search_keywords: ["authorization", "jwt", "routing", "ingestion", "faiss", "payment"],
    query_history_count: 24,
  });

  useEffect(() => {
    fetch("http://localhost:8010/workspaces/1/analytics", {
      headers: {
        Authorization: "Bearer mock-token-dev",
        "X-Workspace-Id": "1",
      },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setAnalytics(data);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
        <h2 className="text-xl font-bold text-white mb-1 flex items-center">
          <BarChart3 className="w-5 h-5 text-violet-400 mr-2" />
          Workspace Intelligence & Query Analytics
        </h2>
        <p className="text-zinc-400 text-sm">
          Monitor architecture question frequencies, top queried code hotspots, and vector relevance score trends over time.
        </p>
      </div>

      {analytics && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Total Architecture Queries</span>
                <Search className="w-4 h-4 text-violet-400" />
              </div>
              <p className="text-3xl font-bold text-white">{analytics.total_queries}</p>
              <p className="text-xs text-zinc-500 mt-1">Logged in query_logs audit table</p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Avg Vector Relevance</span>
                <Activity className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-3xl font-bold text-emerald-400">{(analytics.avg_relevance_score * 100).toFixed(0)}%</p>
              <p className="text-xs text-zinc-500 mt-1">3-Agent relevance evaluation precision</p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Search Keywords Extracted</span>
                <Tag className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-3xl font-bold text-white">{analytics.top_search_keywords.length}</p>
              <p className="text-xs text-zinc-500 mt-1">Parser agent extracted domain terms</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Queried Files */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
              <h3 className="text-sm font-semibold text-zinc-200 mb-3 flex items-center">
                <FileText className="w-4 h-4 text-violet-400 mr-2" />
                Most Queried Architectural Hotspots
              </h3>
              <div className="space-y-2">
                {analytics.top_queried_files.map((item) => (
                  <div key={item.file_path} className="bg-zinc-950 border border-zinc-800 rounded p-3 text-xs font-mono flex justify-between items-center">
                    <span className="text-zinc-300 truncate max-w-[280px]">{item.file_path}</span>
                    <span className="text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded border border-violet-500/20 font-bold">
                      {item.query_hits} queries
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Search Keywords */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
              <h3 className="text-sm font-semibold text-zinc-200 mb-3 flex items-center">
                <Tag className="w-4 h-4 text-violet-400 mr-2" />
                Top Architecture Search Keywords
              </h3>
              <div className="flex flex-wrap gap-2">
                {analytics.top_search_keywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="bg-zinc-950 border border-zinc-800 text-zinc-300 px-3 py-1.5 rounded-md text-xs font-mono hover:border-violet-500/50 transition-colors"
                  >
                    #{keyword}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
