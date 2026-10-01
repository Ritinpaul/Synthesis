"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { Workspace, UserProfile } from "@/lib/types";

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  setCurrentWorkspace: (ws: Workspace) => void;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  createWorkspace: (name: string) => Promise<Workspace | null>;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isWsModalOpen: boolean;
  setIsWsModalOpen: (open: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [currentWorkspace, setCurrentWorkspaceState] = useState<Workspace | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isWsModalOpen, setIsWsModalOpen] = useState(false);

  // Set workspace and persist to localStorage
  const setCurrentWorkspace = useCallback((ws: Workspace) => {
    setCurrentWorkspaceState(ws);
    try {
      localStorage.setItem("synthesis_active_ws_id", String(ws.workspace_id));
    } catch {}
  }, []);

  // Fetch /auth/me with active token
  const fetchProfile = useCallback(async (authToken: string) => {
    try {
      const res = await fetch("/auth/me", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (res.ok) {
        const data: UserProfile = await res.json();
        setUser(data);
        if (data.workspaces && data.workspaces.length > 0) {
          setWorkspaces(data.workspaces);
          // Restore saved active ws or use first
          const savedWsId = localStorage.getItem("synthesis_active_ws_id");
          const matched = data.workspaces.find((w) => String(w.workspace_id) === savedWsId);
          setCurrentWorkspaceState(matched || data.workspaces[0]);
        }
        return true;
      }
    } catch (err) {
      console.warn("Failed to fetch /auth/me", err);
    }
    return false;
  }, []);

  // Initial auth load on mount: check stored session, or prompt for Sign In / Demo on startup
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = localStorage.getItem("synthesis_token");

        if (storedToken) {
          setToken(storedToken);
          const ok = await fetchProfile(storedToken);
          if (!ok) {
            // Token expired or invalid
            localStorage.removeItem("synthesis_token");
            setToken(null);
            setUser(null);
            setIsAuthModalOpen(true);
          }
        } else {
          // On startup with no session, open Sign In / Demo modal immediately
          setIsAuthModalOpen(true);
        }
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, [fetchProfile]);

  const login = async (email: string, pass: string) => {
    try {
      const res = await fetch("/auth/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: pass }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        return { success: false, error: err.detail || "Invalid email or password" };
      }
      const data = await res.json();
      const accessToken = data.access_token;
      setToken(accessToken);
      localStorage.setItem("synthesis_token", accessToken);
      await fetchProfile(accessToken);
      setIsAuthModalOpen(false);
      return { success: true };
    } catch {
      return { success: false, error: "Network connection error" };
    }
  };

  const register = async (email: string, pass: string) => {
    try {
      const res = await fetch("/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: pass }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        return { success: false, error: err.detail || "Registration failed" };
      }
      const data = await res.json();
      const accessToken = data.access_token;
      setToken(accessToken);
      localStorage.setItem("synthesis_token", accessToken);
      await fetchProfile(accessToken);
      setIsAuthModalOpen(false);
      return { success: true };
    } catch {
      return { success: false, error: "Network connection error" };
    }
  };

  const logout = () => {
    localStorage.removeItem("synthesis_token");
    localStorage.removeItem("synthesis_active_ws_id");
    setToken(null);
    setUser(null);
    setWorkspaces([]);
    setCurrentWorkspaceState(null);
    setIsAuthModalOpen(true);
  };

  const createWorkspace = async (name: string): Promise<Workspace | null> => {
    if (!token) return null;
    try {
      const res = await fetch("/workspaces", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });
      if (res.ok) {
        const newWs: Workspace = await res.json();
        setWorkspaces((prev) => [...prev, newWs]);
        setCurrentWorkspace(newWs);
        setIsWsModalOpen(false);
        return newWs;
      }
    } catch (e) {
      console.error("Failed to create workspace", e);
    }
    return null;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        workspaces,
        currentWorkspace,
        setCurrentWorkspace,
        login,
        register,
        logout,
        createWorkspace,
        isLoading,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isWsModalOpen,
        setIsWsModalOpen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
