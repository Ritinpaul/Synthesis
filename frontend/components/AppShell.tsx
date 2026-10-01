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
import AutorenewOutlinedIcon from "@mui/icons-material/AutorenewOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";

type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

const navItems: NavItem[] = [
  { label: "Overview", href: "/", icon: <SpaceDashboardOutlinedIcon sx={{ fontSize: 18 }} /> },
  { label: "PR Risk Analyzer", href: "/pr-risk", icon: <GppMaybeOutlinedIcon sx={{ fontSize: 18 }} /> },
  { label: "Architecture Q&A", href: "/architecture-qa", icon: <TerminalOutlinedIcon sx={{ fontSize: 18 }} /> },
  { label: "Debt Heatmap", href: "/debt-heatmap", icon: <GridOnOutlinedIcon sx={{ fontSize: 18 }} /> },
  { label: "Repositories", href: "/repositories", icon: <FolderOpenOutlinedIcon sx={{ fontSize: 18 }} /> },
  { label: "Analytics", href: "/analytics", icon: <ShowChartOutlinedIcon sx={{ fontSize: 18 }} /> },
  { label: "Architecture", href: "/architecture", icon: <AccountTreeOutlinedIcon sx={{ fontSize: 18 }} /> },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [workspace, setWorkspace] = useState("astral-core");
  const [activeRepo, setActiveRepo] = useState("uv-runtime");

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#060A0A] text-slate-100 font-sans">
      {/* Left Sidebar */}
      <aside className="w-64 bg-[#0A1211] border-r border-[#142321] flex flex-col h-full flex-shrink-0 z-30">
        {/* Brand / Logo */}
        <div className="h-16 flex items-center px-5 border-b border-[#142321]">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-lg shadow-sm group-hover:border-emerald-400 transition-colors">
              <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="font-semibold text-base tracking-tight text-white group-hover:text-emerald-300 transition-colors">
              Synthesis
            </span>
          </Link>
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
                    ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm shadow-emerald-950/50"
                    : "text-slate-400 hover:text-slate-100 hover:bg-[#101B1A] border border-transparent"
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
        <div className="p-3 border-t border-[#142321] space-y-2 bg-[#09100E]">
          {/* Workspace Pill */}
          <div className="bg-[#101B1A] border border-[#142321] rounded-lg p-2.5 flex items-center justify-between text-xs">
            <div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Workspace</div>
              <div className="font-medium text-slate-200">{workspace}</div>
              <div className="text-[10px] text-slate-400 font-mono">{activeRepo}</div>
            </div>
            <KeyboardArrowDownOutlinedIcon sx={{ fontSize: 16, color: "#64748B" }} />
          </div>

          {/* User Profile */}
          <div className="flex items-center justify-between px-1.5 py-1">
            <div className="flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-full bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center justify-center">
                RP
              </div>
              <div className="text-left">
                <div className="text-xs font-medium text-slate-200">Ritin Pal</div>
                <div className="text-[10px] text-slate-400">Developer</div>
              </div>
            </div>
            <button
              className="text-slate-500 hover:text-emerald-400 transition-colors p-1"
              title="Pipeline status synchronized"
            >
              <AutorenewOutlinedIcon sx={{ fontSize: 16 }} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Viewport Container */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-[#142321] bg-[#0A1211]/90 backdrop-blur-md z-20 flex-shrink-0">
          {/* Search bar */}
          <div className="relative w-full max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
              <SearchOutlinedIcon sx={{ fontSize: 18 }} />
            </div>
            <input
              type="text"
              readOnly
              value="Search codebase, ask architecture, or run analysis..."
              className="w-full bg-[#101B1A] border border-[#142321] rounded-lg pl-9 pr-12 py-1.5 text-xs text-slate-400 cursor-pointer focus:outline-none hover:border-[#203633] transition-colors"
            />
            <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-[10px] font-mono text-slate-500 pointer-events-none">
              ⌘ K
            </span>
          </div>

          {/* Right Header Status & Badges */}
          <div className="flex items-center space-x-3.5">
            <div className="hidden sm:flex items-center space-x-1.5 text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-[11px] font-medium tracking-wide">LangGraph Pipeline Online</span>
            </div>

            <button
              className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg border border-[#142321] bg-[#101B1A] hover:bg-[#152422] transition-colors"
              title="Notifications"
            >
              <NotificationsNoneOutlinedIcon sx={{ fontSize: 18 }} />
            </button>

            <div className="w-8 h-8 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center justify-center shadow-sm">
              RP
            </div>
          </div>
        </header>

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto bg-[#060A0A]">
          {children}
        </main>
      </div>
    </div>
  );
}
