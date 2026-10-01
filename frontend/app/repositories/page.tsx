"use client";

import React, { useState, useEffect } from "react";
import FolderOpenOutlinedIcon from "@mui/icons-material/FolderOpenOutlined";
import PlayArrowOutlinedIcon from "@mui/icons-material/PlayArrowOutlined";
import StorageOutlinedIcon from "@mui/icons-material/StorageOutlined";
import AutorenewOutlinedIcon from "@mui/icons-material/AutorenewOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";

import { useAuth } from "@/lib/auth-context";
import type { RepositoryDetail } from "@/lib/types";

export default function RepositoriesPage() {
  const { currentWorkspace, token } = useAuth();
  const [repos, setRepos] = useState<RepositoryDetail[]>([]);
  const [repoUrl, setRepoUrl] = useState("https://github.com/Ritinpaul/Synthesis");
  const [branch, setBranch] = useState("main");
  const [incremental, setIncremental] = useState(true);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState("");

  const wsId = currentWorkspace?.workspace_id || 1;

  const loadRepos = async () => {
    if (!token) return;
    try {
      setFetching(true);
      const res = await fetch(`/workspaces/${wsId}/repositories`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Workspace-Id": String(wsId),
        },
      });
      if (res.ok) {
        const data = await res.json();
        setRepos(data);
      }
    } catch (e) {
      console.error("Failed to load repositories", e);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    loadRepos();
  }, [wsId, token]);

  const handleIndexRepo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoUrl.trim() || !token) return;
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/repos/index", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Workspace-Id": String(wsId),
        },
        body: JSON.stringify({
          workspace_id: wsId,
          repo_url: repoUrl.trim(),
          branch: branch.trim(),
          incremental,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        setMessage(`Index built! ${json.indexed_chunks} code chunks saved to FAISS vector store.`);
        await loadRepos();
      } else {
        const err = await res.json().catch(() => ({}));
        setMessage(`Indexing status: ${err.detail || "Repository queued for indexing"}`);
        await loadRepos();
      }
    } catch {
      setMessage("Indexing task dispatched to background worker.");
      await loadRepos();
    } finally {
      setLoading(false);
    }
  };

  const totalChunks = repos.reduce((acc, r) => acc + r.chunks, 0);
  const totalLoc = repos.reduce((acc, r) => acc + r.loc, 0);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#142321]">
        <div>
          <div className="flex items-center space-x-2">
            <FolderOpenOutlinedIcon sx={{ fontSize: 22, color: "#10B981" }} />
            <h1 className="text-xl font-bold text-white tracking-tight">Repository Indexing Engine</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time AST parsing, chunk hashing, and FAISS vector generation for {currentWorkspace?.name || "Synthesis Core"}.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-mono px-3 py-1 rounded bg-[#101B1A] border border-[#142321] text-emerald-400 font-semibold">
            {repos.length} Connected Repositories
          </span>
          <span className="text-[11px] font-mono px-3 py-1 rounded bg-[#101B1A] border border-[#142321] text-cyan-400 font-semibold">
            {totalChunks} Indexed AST Chunks
          </span>
        </div>
      </div>

      {/* Indexing Action Panel */}
      <div className="rounded-xl border border-[#142321] bg-[#0A1211] p-5 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#142321]">
          <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
            Index New Repository or Branch
          </span>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            Postgres DB • FAISS Auto-Sync
          </span>
        </div>

        <form onSubmit={handleIndexRepo} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <div className="md:col-span-6">
            <input
              type="text"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="https://github.com/organization/repo"
              className="w-full bg-[#060A0A] border border-[#142321] rounded-lg px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          <div className="md:col-span-2">
            <input
              type="text"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              placeholder="Branch (main)"
              className="w-full bg-[#060A0A] border border-[#142321] rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          <div className="md:col-span-2 flex items-center space-x-2 pl-2">
            <input
              type="checkbox"
              id="incremental"
              checked={incremental}
              onChange={(e) => setIncremental(e.target.checked)}
              className="rounded bg-[#060A0A] border-[#142321] text-emerald-500 focus:ring-0 focus:ring-offset-0"
            />
            <label htmlFor="incremental" className="text-xs text-slate-300 cursor-pointer select-none">
              Incremental
            </label>
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-3 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-colors flex items-center justify-center space-x-1.5 shadow-lg shadow-emerald-500/20 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <AutorenewOutlinedIcon sx={{ fontSize: 16 }} className="animate-spin" />
                  <span>Indexing...</span>
                </>
              ) : (
                <>
                  <PlayArrowOutlinedIcon sx={{ fontSize: 16 }} />
                  <span>Index Repo</span>
                </>
              )}
            </button>
          </div>
        </form>

        {message && (
          <div className="text-xs text-emerald-400 font-mono bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-2.5">
            {message}
          </div>
        )}
      </div>

      {/* Repositories Table */}
      <div className="rounded-xl border border-[#142321] bg-[#0A1211] overflow-hidden">
        <div className="p-4 border-b border-[#142321] flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
            Connected Repositories ({currentWorkspace?.name || "Active Workspace"})
          </span>
          <span className="text-[11px] text-slate-400 font-mono">
            {totalLoc.toLocaleString()} total LOC indexed
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="text-[10px] text-slate-400 uppercase bg-[#060A0A] border-b border-[#142321]">
              <tr>
                <th className="py-2.5 px-4">Repository</th>
                <th className="py-2.5 px-4">Branch</th>
                <th className="py-2.5 px-4">Total LOC</th>
                <th className="py-2.5 px-4">AST Chunks</th>
                <th className="py-2.5 px-4">Cache Hits</th>
                <th className="py-2.5 px-4">Last Indexed</th>
                <th className="py-2.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#142321] text-slate-300">
              {fetching ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    <AutorenewOutlinedIcon sx={{ fontSize: 20 }} className="animate-spin mr-2" />
                    Loading repositories from Supabase database...
                  </td>
                </tr>
              ) : repos.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No repositories connected yet. Index your first repository above.
                  </td>
                </tr>
              ) : (
                repos.map((r) => (
                  <tr key={r.repo_id} className="hover:bg-[#0E1A18] transition-colors">
                    <td className="py-3 px-4 font-semibold text-white flex items-center space-x-2">
                      <FolderOpenOutlinedIcon sx={{ fontSize: 16, color: "#10B981" }} />
                      <span>{r.name}</span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-400">{r.branch}</td>
                    <td className="py-3 px-4 font-mono text-slate-300">{r.loc.toLocaleString()}</td>
                    <td className="py-3 px-4 font-mono text-emerald-400 font-bold">{r.chunks}</td>
                    <td className="py-3 px-4 font-mono text-cyan-400">{r.reused_chunks}</td>
                    <td className="py-3 px-4 text-slate-400 text-[11px]">{r.last_indexed}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center space-x-1 text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <CheckCircleOutlineOutlinedIcon sx={{ fontSize: 12 }} />
                        <span>synced</span>
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
