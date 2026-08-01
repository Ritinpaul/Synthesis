"use client";

import React from "react";
import { RefreshCw, ShieldCheck } from "lucide-react";

type HeaderProps = {
  workspaceName?: string;
  activeRepo?: string;
  onRefresh?: () => void;
};

export function Header({ workspaceName = "acme-corp", activeRepo = "core-api", onRefresh }: HeaderProps) {
  return (
    <header className="h-14 flex flex-shrink-0 items-center justify-between px-6 border-b border-zinc-800 bg-zinc-950">
      <div className="flex items-center text-sm font-mono">
        <span className="text-zinc-400 font-semibold">{workspaceName}</span>
        <span className="mx-2 text-zinc-600">/</span>
        <span className="text-zinc-300">{activeRepo}</span>
        <span className="mx-2 text-zinc-600">/</span>
        <span className="text-violet-400 font-medium bg-violet-500/10 px-2 py-0.5 rounded border border-violet-500/20">
          PR Intelligence & Codebase Vector Search
        </span>
      </div>

      <div className="flex items-center space-x-3 text-xs">
        <div className="flex items-center text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
          <ShieldCheck className="w-3.5 h-3.5 mr-1.5" />
          LangGraph 3-Agent Pipeline Online
        </div>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 p-1.5 rounded-md transition-colors border border-zinc-700"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        )}
      </div>
    </header>
  );
}
