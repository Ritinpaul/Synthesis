"use client";

import React, { useState } from "react";
import { FolderGit2, Play, Database } from "lucide-react";

export function RepoIndexer() {
  const [repoUrl, setRepoUrl] = useState("https://github.com/fastapi/fastapi");
  const [branch, setBranch] = useState("main");
  const [incremental, setIncremental] = useState(true);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>({
    status: "completed",
    repo_id: 101,
    indexed_chunks: 142,
    reused_chunks: 118,
    added_chunks: 24,
    deleted_chunks: 0,
    is_incremental: true,
    index_version_id: 3,
  });

  const handleIndex = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8010/repos/index", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer mock-token-dev",
          "X-Workspace-Id": "1",
        },
        body: JSON.stringify({
          workspace_id: 1,
          repo_url: repoUrl,
          branch,
          incremental,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        setResult(json);
      }
    } catch {
      // Dev mode update
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
        <h2 className="text-xl font-bold text-white mb-1 flex items-center">
          <FolderGit2 className="w-5 h-5 text-violet-400 mr-2" />
          Repository Ingestion & FAISS Vector Indexer
        </h2>
        <p className="text-zinc-400 text-sm mb-4">
          Ingest source code repositories, split into tokenized code chunks, generate deterministic vector embeddings, and store index versions.
        </p>

        <form onSubmit={handleIndex} className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-zinc-400 mb-1">Git Repository URL / Local Path</label>
            <input
              type="text"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-1.5 text-sm text-zinc-200 focus:outline-none focus:border-violet-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1">Branch</label>
            <input
              type="text"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-1.5 text-sm text-zinc-200 focus:outline-none focus:border-violet-500 font-mono"
            />
          </div>

          <div className="md:col-span-3 flex items-center justify-between pt-2">
            <label className="flex items-center text-xs text-zinc-300 cursor-pointer">
              <input
                type="checkbox"
                checked={incremental}
                onChange={(e) => setIncremental(e.target.checked)}
                className="mr-2 rounded border-zinc-800 bg-zinc-950 text-violet-600 focus:ring-violet-500"
              />
              Enable Incremental Delta Indexing (reuses unchanged content hashes)
            </label>

            <button
              type="submit"
              disabled={loading}
              className="bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium px-5 py-2 rounded shadow transition-all flex items-center"
            >
              <Play className="w-4 h-4 mr-2" />
              {loading ? "Indexing Repository..." : "Run Index Job"}
            </button>
          </div>
        </form>
      </div>

      {result && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
          <h3 className="text-sm font-semibold text-zinc-200 mb-3 flex items-center">
            <Database className="w-4 h-4 text-emerald-400 mr-2" />
            Index Execution Metrics
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
            <div className="bg-zinc-950 p-3 rounded border border-zinc-800">
              <span className="text-zinc-500 block mb-1">Total Chunks</span>
              <span className="text-xl font-bold text-white">{result.indexed_chunks}</span>
            </div>
            <div className="bg-zinc-950 p-3 rounded border border-zinc-800">
              <span className="text-zinc-500 block mb-1">Reused (Delta)</span>
              <span className="text-xl font-bold text-emerald-400">{result.reused_chunks}</span>
            </div>
            <div className="bg-zinc-950 p-3 rounded border border-zinc-800">
              <span className="text-zinc-500 block mb-1">Added / Modified</span>
              <span className="text-xl font-bold text-violet-400">{result.added_chunks}</span>
            </div>
            <div className="bg-zinc-950 p-3 rounded border border-zinc-800">
              <span className="text-zinc-500 block mb-1">Deleted Chunks</span>
              <span className="text-xl font-bold text-amber-400">{result.deleted_chunks}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
