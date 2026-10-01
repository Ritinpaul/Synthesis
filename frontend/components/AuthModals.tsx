"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";

export function AuthModals() {
  const {
    user,
    token,
    login,
    register,
    logout,
    createWorkspace,
    isAuthModalOpen,
    setIsAuthModalOpen,
    isWsModalOpen,
    setIsWsModalOpen,
  } = useAuth();

  // Auth Modal State
  const [mode, setMode] = useState<"profile" | "login" | "register">("profile");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [loading, setLoading] = useState(false);

  // New Workspace State
  const [wsName, setWsName] = useState("");
  const [wsError, setWsError] = useState("");
  const [wsLoading, setWsLoading] = useState(false);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setLoading(true);

    try {
      if (mode === "login") {
        const res = await login(email, password);
        if (!res.success) {
          setAuthError(res.error || "Login failed");
        }
      } else if (mode === "register") {
        const res = await register(email, password);
        if (!res.success) {
          setAuthError(res.error || "Registration failed");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setEmail("ritin@synthesis.dev");
    setPassword("synthesis123");
    setAuthError("");
    setLoading(true);
    try {
      await login("ritin@synthesis.dev", "synthesis123");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWs = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wsName.trim()) {
      setWsError("Workspace name is required");
      return;
    }
    setWsError("");
    setWsLoading(true);
    try {
      const created = await createWorkspace(wsName.trim());
      if (created) {
        setWsName("");
        setIsWsModalOpen(false);
      } else {
        setWsError("Failed to create workspace in database");
      }
    } finally {
      setWsLoading(false);
    }
  };

  return (
    <>
      {/* ─── AUTH / PROFILE MODAL ─────────────────────────────────────── */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#0A1211] border border-[#142321] rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <button
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-100 transition-colors"
            >
              <CloseOutlinedIcon sx={{ fontSize: 20 }} />
            </button>

            {mode === "profile" && user ? (
              <div className="space-y-6">
                <div className="flex items-center space-x-3.5 pb-4 border-b border-[#142321]">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 font-bold text-lg flex items-center justify-center">
                    {user.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{user.name}</h3>
                    <p className="text-xs text-slate-400">{user.email}</p>
                    <span className="inline-block mt-1 text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                      {user.role} - Supabase DB Verified
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#060A0A] border border-[#142321] text-xs">
                    <span className="text-slate-400">Active Workspaces:</span>
                    <span className="font-semibold text-slate-200">{user.workspaces.length}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#060A0A] border border-[#142321] text-xs">
                    <span className="text-slate-400">Security Standard:</span>
                    <span className="font-mono text-emerald-400">JWT HS256 + Tenant Scoping</span>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => {
                      setMode("login");
                      setAuthError("");
                    }}
                    className="flex-1 py-2.5 px-4 rounded-xl border border-[#142321] text-xs font-semibold text-slate-300 hover:bg-[#0F1B19] transition-colors"
                  >
                    Switch User
                  </button>
                  <button
                    onClick={logout}
                    className="py-2.5 px-5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs font-semibold text-red-400 hover:bg-red-500/20 transition-colors"
                  >
                    Log Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="flex items-center space-x-2 text-white font-bold text-lg">
                  <ShieldOutlinedIcon sx={{ fontSize: 22, color: "#10B981" }} />
                  <h2>{mode === "login" ? "Sign In to Synthesis" : "Create Account"}</h2>
                </div>

                <div className="flex rounded-lg bg-[#060A0A] p-1 border border-[#142321]">
                  <button
                    type="button"
                    onClick={() => setMode("login")}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                      mode === "login" ? "bg-emerald-500/20 text-emerald-300" : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode("register")}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                      mode === "register" ? "bg-emerald-500/20 text-emerald-300" : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Register
                  </button>
                </div>

                {authError && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                    {authError}
                  </div>
                )}

                <form onSubmit={handleAuthSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-[11px] text-slate-400 uppercase font-semibold mb-1">Email</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ritin@synthesis.dev"
                      className="w-full bg-[#060A0A] border border-[#142321] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 uppercase font-semibold mb-1">Password</label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-[#060A0A] border border-[#142321] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                  >
                    {loading ? "Authenticating..." : mode === "login" ? "Sign In" : "Create Account"}
                  </button>
                </form>

                <div className="pt-2 border-t border-[#142321] flex justify-between items-center text-xs">
                  <button
                    type="button"
                    onClick={handleDemoLogin}
                    className="text-emerald-400 hover:text-emerald-300 font-semibold"
                  >
                    Quick Login (Ritin Pal)
                  </button>
                  {user && (
                    <button
                      type="button"
                      onClick={() => setMode("profile")}
                      className="text-slate-400 hover:text-slate-200"
                    >
                      Back to Profile
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── CREATE WORKSPACE MODAL ───────────────────────────────────── */}
      {isWsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#0A1211] border border-[#142321] rounded-2xl w-full max-w-sm p-6 shadow-2xl relative">
            <button
              onClick={() => setIsWsModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-100 transition-colors"
            >
              <CloseOutlinedIcon sx={{ fontSize: 20 }} />
            </button>

            <div className="flex items-center space-x-2 text-white font-bold text-base mb-4">
              <AddCircleOutlineOutlinedIcon sx={{ fontSize: 20, color: "#10B981" }} />
              <h3>Create New Workspace</h3>
            </div>

            {wsError && (
              <div className="p-3 mb-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                {wsError}
              </div>
            )}

            <form onSubmit={handleCreateWs} className="space-y-4">
              <div>
                <label className="block text-[11px] text-slate-400 uppercase font-semibold mb-1">
                  Workspace Name
                </label>
                <input
                  type="text"
                  required
                  value={wsName}
                  onChange={(e) => setWsName(e.target.value)}
                  placeholder="e.g. Platform Infrastructure"
                  className="w-full bg-[#060A0A] border border-[#142321] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsWsModalOpen(false)}
                  className="flex-1 py-2 rounded-xl border border-[#142321] text-xs font-semibold text-slate-400 hover:bg-[#0F1B19] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={wsLoading}
                  className="flex-1 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-colors disabled:opacity-50"
                >
                  {wsLoading ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
