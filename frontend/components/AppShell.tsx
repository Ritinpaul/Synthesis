"use client";

import React, { useState, useEffect, useRef } from "react";
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
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import ChevronLeftOutlinedIcon from "@mui/icons-material/ChevronLeftOutlined";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import DoneAllOutlinedIcon from "@mui/icons-material/DoneAllOutlined";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";

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

type NotificationItem = {
  id: string;
  title: string;
  description: string;
  time: string;
  type: "alert" | "success" | "info";
  read: boolean;
  link: string;
};

const initialNotifications: NotificationItem[] = [
  {
    id: "notif-1",
    title: "PR #42 Critical Risk Flagged",
    description: "AST analysis flagged 84.5% breaking risk in JWT workspace auth scoping.",
    time: "12m ago",
    type: "alert",
    read: false,
    link: "/pr-risk",
  },
  {
    id: "notif-2",
    title: "Repository Synced",
    description: "Synthesis (main) incremental index finished. 3 AST symbols registered.",
    time: "45m ago",
    type: "success",
    read: false,
    link: "/repositories",
  },
  {
    id: "notif-3",
    title: "Workspace Security Enforced",
    description: "Supabase PostgreSQL tenant isolation verified for active session.",
    time: "2h ago",
    type: "info",
    read: true,
    link: "/architecture",
  },
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

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isWsDropdownOpen, setIsWsDropdownOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close notifications when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    }
    if (isNotifOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isNotifOpen]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const removeNotification = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    e.preventDefault();
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const userInitials = user?.name ? user.name.slice(0, 2).toUpperCase() : "G";
  const userName = user?.name || "Guest User";
  const userRole = user?.role || "Visitor";
  const wsName = currentWorkspace?.name || "Synthesis Core";

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#060A0A] text-slate-100 font-sans">
      {/* Left Sidebar */}
      <aside
        className={`bg-[#090F0E] border-r border-[#132220] flex flex-col h-full flex-shrink-0 z-30 transition-all duration-300 ${
          isCollapsed ? "w-16" : "w-60"
        }`}
      >
        {/* Brand / Logo + Collapse Toggle */}
        <div className={`h-16 flex items-center border-b border-[#132220] px-3.5 ${isCollapsed ? "justify-center" : "justify-between"}`}>
          <Link href="/" className="flex items-center space-x-2.5 group overflow-hidden">
            <img
              src="/logo-icon.png"
              alt="Synthesis Logo"
              width={28}
              height={28}
              className="w-7 h-7 object-contain drop-shadow-[0_0_8px_rgba(16,185,129,0.4)] group-hover:scale-105 transition-transform flex-shrink-0"
            />
            {!isCollapsed && (
              <span className="font-bold text-sm tracking-tight text-white group-hover:text-emerald-400 transition-colors truncate">
                Synthesis
              </span>
            )}
          </Link>

          {/* Sidebar Collapse Toggle Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-slate-500 hover:text-slate-200 p-1.5 rounded-lg hover:bg-[#142623] transition-colors"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRightOutlinedIcon sx={{ fontSize: 18 }} />
            ) : (
              <ChevronLeftOutlinedIcon sx={{ fontSize: 18 }} />
            )}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-2.5 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                title={isCollapsed ? item.label : undefined}
                className={`flex items-center rounded-lg text-xs transition-colors duration-150 ${
                  isCollapsed ? "justify-center py-2.5 px-0" : "px-3 py-2"
                } ${
                  isActive
                    ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm shadow-emerald-950/40 font-semibold"
                    : "text-slate-400 hover:text-slate-100 hover:bg-[#0F1B19] border border-transparent"
                }`}
              >
                <span className={`${isCollapsed ? "" : "mr-3"} ${isActive ? "text-emerald-400" : "text-slate-400"}`}>
                  {item.icon}
                </span>
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Workspace & User Profile */}
        <div className="p-2.5 border-t border-[#132220] space-y-2 bg-[#070D0C] relative">
          {user ? (
            <>
              {/* Workspace Switcher Pill */}
              <div className="relative">
                <button
                  onClick={() => setIsWsDropdownOpen(!isWsDropdownOpen)}
                  title={isCollapsed ? `Workspace: ${wsName}` : undefined}
                  className={`w-full bg-[#0D1816] hover:bg-[#12221F] border border-[#142623] hover:border-emerald-500/30 rounded-lg p-2 flex items-center transition-colors text-left ${
                    isCollapsed ? "justify-center" : "justify-between"
                  }`}
                >
                  {isCollapsed ? (
                    <div className="w-5 h-5 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-[9px] font-bold flex items-center justify-center">
                      WS
                    </div>
                  ) : (
                    <div>
                      <div className="text-[9px] text-slate-500 uppercase tracking-wider font-semibold">Workspace</div>
                      <div className="font-semibold text-slate-200 truncate max-w-[130px] text-xs">{wsName}</div>
                      <div className="text-[9px] text-emerald-400/80 font-mono">Supabase DB • live</div>
                    </div>
                  )}
                  {!isCollapsed && (
                    <KeyboardArrowDownOutlinedIcon
                      sx={{ fontSize: 16, color: "#64748B" }}
                      className={`transition-transform duration-200 ${isWsDropdownOpen ? "rotate-180" : ""}`}
                    />
                  )}
                </button>

                {/* Workspace Dropdown */}
                {isWsDropdownOpen && (
                  <div className="absolute bottom-full left-0 mb-2 w-56 bg-[#0A1211] border border-[#142321] rounded-xl shadow-2xl p-1.5 space-y-1 z-50">
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
                title={isCollapsed ? `${userName} (${userRole})` : undefined}
                className={`flex items-center rounded-lg hover:bg-[#0F1B19] cursor-pointer transition-colors group p-1.5 ${
                  isCollapsed ? "justify-center" : "justify-between"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-full bg-emerald-950 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center justify-center shadow-sm group-hover:border-emerald-400 transition-colors flex-shrink-0">
                    {userInitials}
                  </div>
                  {!isCollapsed && (
                    <div className="text-left overflow-hidden">
                      <div className="text-xs font-semibold text-slate-200 group-hover:text-emerald-300 transition-colors leading-tight truncate max-w-[110px]">
                        {userName}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">{userRole}</div>
                    </div>
                  )}
                </div>
                {!isCollapsed && (
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
                )}
              </div>
            </>
          ) : (
            /* Logged Out / Guest State */
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className={`w-full flex items-center rounded-lg border border-emerald-500/30 bg-emerald-950/30 hover:bg-emerald-900/40 hover:border-emerald-500/60 transition-colors p-2 text-left group ${
                isCollapsed ? "justify-center" : "justify-between"
              }`}
              title="Sign In or Launch Demo"
            >
              <div className="flex items-center space-x-2">
                <LoginOutlinedIcon sx={{ fontSize: 16, color: "#10B981" }} />
                {!isCollapsed && (
                  <div>
                    <div className="text-xs font-semibold text-emerald-300 group-hover:text-emerald-200">
                      Sign In / Demo
                    </div>
                    <div className="text-[9px] text-slate-400">Launch 1-click demo</div>
                  </div>
                )}
              </div>
              {!isCollapsed && (
                <span className="text-[11px] text-emerald-400 font-bold group-hover:translate-x-0.5 transition-transform">
                  →
                </span>
              )}
            </button>
          )}
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
            {/* Notification Bell & Interactive Dropdown */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className={`relative p-1.5 rounded-lg border transition-all duration-200 ${
                  isNotifOpen
                    ? "text-emerald-400 border-emerald-500/40 bg-[#122421] shadow-sm shadow-emerald-950/60"
                    : "text-slate-400 hover:text-slate-200 border-[#142623] bg-[#0D1816] hover:bg-[#12221F]"
                }`}
                title="Notifications"
                aria-label="Toggle notifications dropdown"
              >
                {unreadCount > 0 ? (
                  <NotificationsActiveOutlinedIcon sx={{ fontSize: 18 }} />
                ) : (
                  <NotificationsNoneOutlinedIcon sx={{ fontSize: 18 }} />
                )}
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 bg-emerald-500 text-slate-950 font-bold text-[9px] rounded-full flex items-center justify-center ring-2 ring-[#090F0E] shadow-sm animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Flyout Panel */}
              {isNotifOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-[#0A1312]/95 border border-[#1A2E2B] rounded-xl shadow-2xl backdrop-blur-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                  {/* Header */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-[#142623] bg-[#0C1715]/70">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-xs text-slate-200">Notifications</span>
                      {unreadCount > 0 && (
                        <span className="text-[10px] font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded-full">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="flex items-center space-x-1 text-[11px] text-slate-400 hover:text-emerald-400 transition-colors"
                      >
                        <DoneAllOutlinedIcon sx={{ fontSize: 13 }} />
                        <span>Mark all read</span>
                      </button>
                    )}
                  </div>

                  {/* List of Notifications */}
                  <div className="max-h-[340px] overflow-y-auto divide-y divide-[#12221F]/60">
                    {notifications.length === 0 ? (
                      <div className="py-8 px-4 text-center">
                        <NotificationsNoneOutlinedIcon sx={{ fontSize: 28, color: "#475569" }} className="mb-2" />
                        <div className="text-xs font-medium text-slate-300">All caught up</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">No notifications in {wsName}</div>
                      </div>
                    ) : (
                      notifications.map((item) => {
                        const Icon =
                          item.type === "alert"
                            ? ErrorOutlineOutlinedIcon
                            : item.type === "success"
                            ? CheckCircleOutlineOutlinedIcon
                            : InfoOutlinedIcon;

                        const iconColor =
                          item.type === "alert"
                            ? "text-rose-400 bg-rose-500/10 border-rose-500/20"
                            : item.type === "success"
                            ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                            : "text-sky-400 bg-sky-500/10 border-sky-500/20";

                        return (
                          <div
                            key={item.id}
                            className={`group relative p-3.5 transition-colors cursor-pointer flex items-start space-x-3 ${
                              item.read
                                ? "bg-[#091110]/50 hover:bg-[#0E1A18]/60 opacity-80"
                                : "bg-[#0B1513] hover:bg-[#10201D]"
                            }`}
                            onClick={() => {
                              markAsRead(item.id);
                              setIsNotifOpen(false);
                            }}
                          >
                            <Link href={item.link} className="absolute inset-0 z-0" tabIndex={-1} />
                            
                            {/* Type Icon Badge */}
                            <div className={`w-6 h-6 rounded-md border flex items-center justify-center flex-shrink-0 mt-0.5 relative z-10 ${iconColor}`}>
                              <Icon sx={{ fontSize: 14 }} />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0 pr-4 relative z-10">
                              <div className="flex items-center justify-between mb-0.5">
                                <span className={`text-xs font-semibold truncate ${item.read ? "text-slate-300" : "text-white"}`}>
                                  {item.title}
                                </span>
                                <span className="text-[10px] text-slate-500 font-mono flex-shrink-0 ml-2">
                                  {item.time}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">
                                {item.description}
                              </p>
                            </div>

                            {/* Read indicator / Dismiss button */}
                            <div className="relative z-20 flex items-center">
                              {!item.read && (
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.8)] mr-1 group-hover:hidden" />
                              )}
                              <button
                                onClick={(e) => removeNotification(e, item.id)}
                                className="hidden group-hover:flex items-center justify-center w-5 h-5 rounded text-slate-500 hover:text-slate-200 hover:bg-[#172D29] transition-colors"
                                title="Dismiss notification"
                              >
                                <CloseOutlinedIcon sx={{ fontSize: 13 }} />
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Footer */}
                  {notifications.length > 0 && (
                    <div className="px-3.5 py-2 border-t border-[#142623] bg-[#070D0C] flex items-center justify-between text-[11px]">
                      <span className="text-slate-500 font-mono text-[10px]">
                        Scope: <span className="text-emerald-400/80">{wsName}</span>
                      </span>
                      <button
                        onClick={clearAllNotifications}
                        className="text-slate-400 hover:text-slate-200 transition-colors"
                      >
                        Clear all
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Profile Avatar Pill / Sign In Button */}
            {user ? (
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
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-emerald-500/40 bg-emerald-950/50 hover:bg-emerald-900/60 text-emerald-300 hover:text-emerald-200 text-xs font-semibold transition-colors shadow-sm shadow-emerald-950/50"
              >
                <LoginOutlinedIcon sx={{ fontSize: 14 }} />
                <span>Sign In / Demo</span>
              </button>
            )}
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
