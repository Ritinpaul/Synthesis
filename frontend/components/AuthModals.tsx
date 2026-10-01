"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";

export function AuthModals() {
  const {
    user,
    token,
    workspaces,
    currentWorkspace,
    login,
    register,
    logout,
    createWorkspace,
    isAuthModalOpen,
    setIsAuthModalOpen,
    isWsModalOpen,
    setIsWsModalOpen,
  } = useAuth();

  // Auth Modal State: default to login if no user, or profile if user is logged in
  const [mode, setMode] = useState<"profile" | "login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [loading, setLoading] = useState(false);

  // Sync mode with user state whenever modal opens or user state changes
  useEffect(() => {
    if (!user) {
      setMode("login");
    } else {
      setMode("profile");
    }
  }, [user, isAuthModalOpen]);

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
      const res = await login("ritin@synthesis.dev", "synthesis123");
      if (!res.success) {
        setAuthError(res.error || "Demo login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWs = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wsName.trim()) return;
    setWsError("");
    setWsLoading(true);

    try {
      const res = await createWorkspace(wsName.trim());
      if (!res) {
        setWsError("Failed to create workspace in database");
      } else {
        setWsName("");
      }
    } finally {
      setWsLoading(false);
    }
  };

  return (
    <>
      {/* ── AUTH & USER PROFILE MODAL ── */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-[#0A1211] border border-[#142623] rounded-2xl w-full max-w-md p-6 shadow-2xl relative overflow-hidden">
            {/* Top decorative gradient */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600" />

            <button
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-100 transition-colors p-1 rounded-lg hover:bg-[#142623]"
              title="Close"
            >
              <CloseOutlinedIcon sx={{ fontSize: 20 }} />
            </button>

            {user && mode === "profile" ? (
              /* Profile Details View */
              <div className="space-y-5">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-950 border border-emerald-500/50 text-emerald-300 font-bold text-base flex items-center justify-center shadow-lg shadow-emerald-950/50">
                    {user.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-white font-bold text-base leading-tight">{user.name}</h2>
                    <p className="text-slate-400 text-xs font-mono">{user.email}</p>
                    <div className="inline-flex items-center space-x-1.5 mt-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>{user.role} — Supabase DB Verified</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#060A0A] border border-[#142321] text-xs">
                    <span className="text-slate-400">Current Workspace:</span>
                    <span className="font-semibold text-slate-200">{currentWorkspace?.name || "Synthesis Core"}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#060A0A] border border-[#142321] text-xs">
                    <span className="text-slate-400">Active Workspaces:</span>
                    <span className="font-semibold text-emerald-400">{user.workspaces.length}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#060A0A] border border-[#142321] text-xs">
                    <span className="text-slate-400">Security Standard:</span>
                    <span className="font-mono text-emerald-400 text-[11px]">JWT HS256 + Tenant Scoping</span>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => {
                      setMode("login");
                      setAuthError("");
                    }}
                    className="flex-1 py-2.5 px-4 rounded-xl border border-[#142321] text-xs font-semibold text-slate-300 hover:bg-[#0F1B19] hover:text-white transition-colors"
                  >
                    Switch Account
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setMode("login");
                    }}
                    className="flex items-center justify-center space-x-1.5 py-2.5 px-5 rounded-xl bg-red-500/15 border border-red-500/30 text-xs font-semibold text-red-400 hover:bg-red-500/25 transition-colors"
                  >
                    <LogoutOutlinedIcon sx={{ fontSize: 16 }} />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Sign In / Sign Up Form + Demo Account */
              <div className="space-y-4">
                <div>
                  <div className="flex items-center space-x-2 text-white font-bold text-base mb-1">
                    <ShieldOutlinedIcon sx={{ fontSize: 20, color: "#10B981" }} />
                    <h2>{mode === "login" ? "Sign In to Synthesis" : "Create Synthesis Account"}</h2>
                  </div>
                  <p className="text-slate-400 text-xs">
                    Connect to your Supabase-backed AST intelligence workspace
                  </p>
                </div>

                {/* Tabs */}
                <div className="flex rounded-lg bg-[#060A0A] p-1 border border-[#142321]">
                  <button
                    type="button"
                    onClick={() => {
                      setMode("login");
                      setAuthError("");
                    }}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                      mode === "login" ? "bg-emerald-500/20 text-emerald-300 shadow-sm" : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMode("register");
                      setAuthError("");
                    }}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                      mode === "register" ? "bg-emerald-500/20 text-emerald-300 shadow-sm" : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Sign Up
                  </button>
                </div>

                {authError && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                    {authError}
                  </div>
                )}

                <form onSubmit={handleAuthSubmit} className="space-y-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 uppercase font-semibold mb-1">Email</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="developer@synthesis.dev"
                      className="w-full bg-[#060A0A] border border-[#142321] rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50"
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
                      className="w-full bg-[#060A0A] border border-[#142321] rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50"
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

                {/* ── DEMO ACCOUNT CARD ── */}
                <div className="pt-3 border-t border-[#142623]/80">
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-2 text-center">
                    Instant Demo Access
                  </div>
                  <button
                    type="button"
                    onClick={handleDemoLogin}
                    disabled={loading}
                    className="w-full flex items-center justify-between p-3 rounded-xl border border-emerald-500/40 bg-gradient-to-r from-emerald-950/40 to-[#0A1A17] hover:border-emerald-500/70 hover:from-emerald-950/60 hover:to-[#0E2420] transition-all group text-left shadow-lg shadow-emerald-950/30 disabled:opacity-50"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-900 border border-emerald-500/60 text-emerald-300 text-xs font-bold flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
                        RP
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white group-hover:text-emerald-300 transition-colors flex items-center space-x-1.5">
                          <span>Demo: Ritin Pal</span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-mono">
                            Owner
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          ritin@synthesis.dev • 2 Pre-seeded Workspaces
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 text-emerald-400 text-xs font-semibold group-hover:translate-x-1 transition-transform">
                      <span>Explore</span>
                      <ArrowForwardOutlinedIcon sx={{ fontSize: 14 }} />
                    </div>
                  </button>
                </div>

                {user && (
                  <div className="pt-1 text-center">
                    <button
                      type="button"
                      onClick={() => setMode("profile")}
                      className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
                    >
                      ← Return to Profile
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── CREATE WORKSPACE MODAL ── */}
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
