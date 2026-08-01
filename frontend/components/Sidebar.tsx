"use client";

import React from "react";
import { Terminal, ShieldAlert, Layers, Search, BarChart3, GitPullRequest } from "lucide-react";

type ActiveTab = "pr_risk" | "architecture_query" | "debt_heatmap" | "repositories" | "analytics";

type SidebarProps = {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
};

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  return (
    <aside className="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col h-full flex-shrink-0">
      <div className="h-14 flex items-center px-4 border-b border-zinc-800">
        <img
          src="/logo.png"
          alt="Synthesis Logo"
          className="w-8 h-8 rounded-lg mr-3 shadow-md border border-violet-500/30 object-cover"
        />
        <span className="text-zinc-100 font-semibold tracking-tight text-lg">Synthesis</span>
      </div>

      <div className="p-4">
        <button
          onClick={() => setActiveTab("architecture_query")}
          className="w-full bg-violet-600 hover:bg-violet-500 text-white text-sm py-2 px-4 rounded-md border border-violet-500 shadow-sm transition-all flex items-center justify-center font-medium"
        >
          <Search className="w-4 h-4 mr-2" />
          Ask Architecture Query
        </button>
      </div>

      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        <p className="px-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 mt-2">Intelligence</p>

        <button
          onClick={() => setActiveTab("pr_risk")}
          className={`w-full flex items-center px-3 py-2 text-sm rounded-md font-medium transition-colors ${
            activeTab === "pr_risk"
              ? "bg-violet-500/10 text-violet-400 border border-violet-500/20"
              : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
          }`}
        >
          <ShieldAlert className="w-4 h-4 mr-3" />
          PR Risk Analysis
        </button>

        <button
          onClick={() => setActiveTab("architecture_query")}
          className={`w-full flex items-center px-3 py-2 text-sm rounded-md font-medium transition-colors ${
            activeTab === "architecture_query"
              ? "bg-violet-500/10 text-violet-400 border border-violet-500/20"
              : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
          }`}
        >
          <Terminal className="w-4 h-4 mr-3" />
          Architecture Q&A
        </button>

        <button
          onClick={() => setActiveTab("debt_heatmap")}
          className={`w-full flex items-center px-3 py-2 text-sm rounded-md font-medium transition-colors ${
            activeTab === "debt_heatmap"
              ? "bg-violet-500/10 text-violet-400 border border-violet-500/20"
              : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
          }`}
        >
          <Layers className="w-4 h-4 mr-3" />
          Debt Heatmap
        </button>

        <p className="px-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 mt-6">Workspace</p>

        <button
          onClick={() => setActiveTab("repositories")}
          className={`w-full flex items-center px-3 py-2 text-sm rounded-md font-medium transition-colors ${
            activeTab === "repositories"
              ? "bg-violet-500/10 text-violet-400 border border-violet-500/20"
              : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
          }`}
        >
          <GitPullRequest className="w-4 h-4 mr-3" />
          Indexed Repositories
        </button>

        <button
          onClick={() => setActiveTab("analytics")}
          className={`w-full flex items-center px-3 py-2 text-sm rounded-md font-medium transition-colors ${
            activeTab === "analytics"
              ? "bg-violet-500/10 text-violet-400 border border-violet-500/20"
              : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
          }`}
        >
          <BarChart3 className="w-4 h-4 mr-3" />
          Query Analytics
        </button>
      </nav>

      <div className="p-4 border-t border-zinc-800 text-xs text-zinc-500 flex items-center justify-between">
        <span>Workspace Isolation</span>
        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Active</span>
      </div>
    </aside>
  );
}
