"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SpaceDashboardOutlinedIcon from "@mui/icons-material/SpaceDashboardOutlined";
import GppMaybeOutlinedIcon from "@mui/icons-material/GppMaybeOutlined";
import TerminalOutlinedIcon from "@mui/icons-material/TerminalOutlined";
import GridOnOutlinedIcon from "@mui/icons-material/GridOnOutlined";
import FolderOpenOutlinedIcon from "@mui/icons-material/FolderOpenOutlined";
import ShowChartOutlinedIcon from "@mui/icons-material/ShowChartOutlined";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import ChevronLeftOutlinedIcon from "@mui/icons-material/ChevronLeftOutlined";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";

import { useAuth } from "@/lib/auth-context";
import { AuthModals } from "@/components/AuthModals";

type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

const navItems: NavItem[] = [
  { label: "Overview", href: "/", icon: <SpaceDashboardOutlinedIcon sx={{ fontSize: 18 }} /> },
  { label: "PR Risk Analyzer", href: "/pr-risk", icon: <GppMaybeOutlinedIcon sx={{ fontSize: 18 }} /> },
  { label: "Codebase Q&A", href: "/architecture-qa", icon: <TerminalOutlinedIcon sx={{ fontSize: 18 }} /> },
  { label: "Debt Heatmap", href: "/debt-heatmap", icon: <GridOnOutlinedIcon sx={{ fontSize: 18 }} /> },
  { label: "Repositories", href: "/repositories", icon: <FolderOpenOutlinedIcon sx={{ fontSize: 18 }} /> },
  { label: "Analytics", href: "/analytics", icon: <ShowChartOutlinedIcon sx={{ fontSize: 18 }} /> },
  { label: "System Blueprint", href: "/architecture", icon: <AccountTreeOutlinedIcon sx={{ fontSize: 18 }} /> },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const {
    user,
    workspaces,
    currentWorkspace,
    setCurrentWorkspace,
    setIsAuthModalOpen,
    setIsWsModalOpen,
  } = useAuth();

  const [isWsDropdownOpen, setIsWsDropdownOpen] = useState(false);

  const userInitials = user?.name ? user.name.slice(0, 2).toUpperCase() : "RP";
  const userName = user?.name || "Ritin Pal";
  const userRole = user?.role || "Owner";
  const wsName = currentWorkspace?.name || "Synthesis Core";

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#060A0A] text-slate-100 font-sans">
      {/* Left Sidebar */}
      <aside className="w-60 bg-[#090F0E] border-r border-[#132220] flex flex-col h-full flex-shrink-0 z-30">
        {/* Brand / Logo */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-[#132220]">
          <Link href="/" className="flex items-center space-x-2.5 group">
            <img
              src="/logo-icon.png"
              alt="Synthesis Logo"
              width={28}
              height={28}
              className="w-7 h-7 object-contain drop-shadow-[0_0_8px_rgba(16,185,129,0.4)] group-hover:scale-105 transition-transform"
            />
            <span className="font-semibold text-base tracking-tight text-white group-hover:text-emerald-300 transition-colors">
              Synthesis
            </span>
          </Link>
          <button className="text-slate-500 hover:text-slate-300 transition-colors">
            <ChevronLeftOutlinedIcon sx={{ fontSize: 18 }} />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm shadow-emerald-950/40 font-semibold"
                    : "text-slate-400 hover:text-slate-100 hover:bg-[#0F1B19] border border-transparent"
                }`}
              >
                <span className={`mr-3 ${isActive ? "text-emerald-400" : "text-slate-400"}`}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Workspace & User Profile */}
        <div className="p-3 border-t border-[#132220] space-y-2.5 bg-[#070D0C] relative">
          {/* Workspace Switcher Pill */}
          <div className="relative">
            <button
              onClick={() => setIsWsDropdownOpen(!isWsDropdownOpen)}
              className="w-full bg-[#0D1816] hover:bg-[#12221F] border border-[#142623] hover:border-emerald-500/30 rounded-lg p-2.5 flex items-center justify-between text-xs transition-colors text-left"
            >
              <div>
                <div className="text-[9px] text-slate-500 uppercase tracking-wider font-semibold">Workspace</div>
                <div className="font-semibold text-slate-200 truncate max-w-[140px]">{wsName}</div>
                <div className="text-[10px] text-emerald-400/80 font-mono">Supabase DB • live</div>
              </div>
              <KeyboardArrowDownOutlinedIcon
                sx={{ fontSize: 16, color: "#64748B" }}
                className={`transition-transform duration-200 ${isWsDropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* Workspace Dropdown */}
            {isWsDropdownOpen && (
              <div className="absolute bottom-full left-0 mb-2 w-full bg-[#0A1211] border border-[#142321] rounded-xl shadow-2xl p-1.5 space-y-1 z-50">
                <div className="px-2.5 py-1 text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                  Switch Workspace
                </div>
                {workspaces.map((ws) => {
                  const isCurrent = currentWorkspace?.workspace_id === ws.workspace_id;
                  return (
                    <button
                      key={ws.workspace_id}
                      onClick={() => {
                        setCurrentWorkspace(ws);
                        setIsWsDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs transition-colors text-left ${
                        isCurrent
                          ? "bg-emerald-500/15 text-emerald-300 font-semibold"
                          : "text-slate-300 hover:bg-[#0F1B19] hover:text-white"
                      }`}
                    >
                      <span className="truncate">{ws.name}</span>
                      {isCurrent && <CheckOutlinedIcon sx={{ fontSize: 14, color: "#10B981" }} />}
                    </button>
                  );
                })}
                <div className="pt-1 border-t border-[#142321]">
                  <button
                    onClick={() => {
                      setIsWsDropdownOpen(false);
                      setIsWsModalOpen(true);
                    }}
                    className="w-full flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-[11px] text-emerald-400 hover:bg-emerald-500/10 font-semibold transition-colors"
                  >
                    <AddOutlinedIcon sx={{ fontSize: 14 }} />
                    <span>Create Workspace</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Pill */}
          <div
            onClick={() => setIsAuthModalOpen(true)}
            className="flex items-center justify-between px-1 py-1 rounded-lg hover:bg-[#0F1B19] cursor-pointer transition-colors group"
          >
            <div className="flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-full bg-emerald-950 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center justify-center shadow-sm group-hover:border-emerald-400 transition-colors">
                {userInitials}
              </div>
              <div className="text-left">
                <div className="text-xs font-semibold text-slate-200 group-hover:text-emerald-300 transition-colors leading-tight">
                  {userName}
                </div>
                <div className="text-[10px] text-slate-400">{userRole}</div>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsAuthModalOpen(true);
              }}
              className="text-slate-500 hover:text-slate-300 transition-colors p-1"
              title="User Account & Security"
            >
              <SettingsOutlinedIcon sx={{ fontSize: 16 }} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Viewport Container */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-[#132220] bg-[#090F0E]/90 backdrop-blur-md z-20 flex-shrink-0">
          {/* Search bar */}
          <div className="relative w-full max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
              <SearchOutlinedIcon sx={{ fontSize: 18 }} />
            </div>
            <input
              type="text"
              readOnly
              value="Search codebase, ask architecture, or run analysis..."
              className="w-full bg-[#0D1816] border border-[#142623] rounded-lg pl-9 pr-12 py-1.5 text-xs text-slate-400 cursor-pointer focus:outline-none hover:border-[#1F3A35] transition-colors"
            />
            <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-[10px] font-mono text-slate-500 pointer-events-none">
              ⌘ K
            </span>
          </div>

          {/* Right Header Status & Badges */}
          <div className="flex items-center space-x-3.5">
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="relative text-slate-400 hover:text-slate-200 p-1.5 rounded-lg border border-[#142623] bg-[#0D1816] hover:bg-[#12221F] transition-colors"
              title="Notifications"
            >
              <NotificationsNoneOutlinedIcon sx={{ fontSize: 18 }} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 text-slate-950 font-bold text-[9px] rounded-full flex items-center justify-center ring-2 ring-[#090F0E]">
                2
              </span>
            </button>

            {/* Profile Avatar Pill */}
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="flex items-center space-x-2 pl-1 pr-2.5 py-1 rounded-full border border-[#142623] bg-[#0D1816] hover:bg-[#12221F] transition-colors group"
            >
              <div className="w-6 h-6 rounded-full bg-emerald-900 border border-emerald-500/40 text-emerald-300 text-[11px] font-bold flex items-center justify-center">
                {userInitials}
              </div>
              <span className="text-xs text-slate-300 font-medium group-hover:text-emerald-300 transition-colors">
                {userName.split(" ")[0]}
              </span>
            </button>
          </div>
        </header>

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto bg-[#060A0A]">
          {children}
        </main>
      </div>

      {/* Global Modals (Auth, Profile, Workspace) */}
      <AuthModals />
    </div>
  );
}
