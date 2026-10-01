"use client";

import React, { useState } from "react";
import Link from "next/link";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import StorageOutlinedIcon from "@mui/icons-material/StorageOutlined";
import GppMaybeOutlinedIcon from "@mui/icons-material/GppMaybeOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
import HubOutlinedIcon from "@mui/icons-material/HubOutlined";
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import GitHubIcon from "@mui/icons-material/GitHub";

export default function OverviewPage() {
  const [qaInput, setQaInput] = useState("");

  return (
    <div className="p-4 sm:p-5 md:p-6 space-y-5 max-w-[1700px] mx-auto">
      {/* 1. HERO SECTION WITH CINEMATIC BACKGROUND */}
      <section
        className="relative rounded-2xl border border-[#142623] overflow-hidden min-h-[340px] flex items-center p-6 md:p-10 shadow-2xl"
        style={{
          background: `linear-gradient(90deg, rgba(6, 10, 10, 0.95) 0%, rgba(6, 10, 10, 0.88) 40%, rgba(6, 10, 10, 0.3) 100%), url('/hero.png') center / cover no-repeat`,
        }}
      >
        <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Headline, Actions & Value Prop */}
          <div className="lg:col-span-7 space-y-4">
            <div className="text-[11px] font-mono tracking-widest uppercase font-bold text-emerald-400">
              AI-POWERED CODEBASE INTELLIGENCE
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
              See the impact <br />
              <span className="text-white">before you merge.</span>
            </h1>

            <p className="text-slate-300 text-xs md:text-sm leading-relaxed max-w-xl font-normal">
              Multi-agent analysis for safer, smarter, and faster development. Detect breaking changes,
              visualize dependencies, and explore your codebase with AI — in seconds.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/pr-risk"
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-[#060A0A] font-semibold text-xs transition-all shadow-md shadow-emerald-950/60"
              >
                <span>Analyze a Pull Request</span>
                <ArrowForwardOutlinedIcon sx={{ fontSize: 14 }} />
              </Link>

              <Link
                href="/repositories"
                className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-lg bg-[#0A1412]/80 hover:bg-[#101F1C] border border-[#182F2A] text-slate-200 font-medium text-xs transition-all backdrop-blur-md"
              >
                <GitHubIcon sx={{ fontSize: 15 }} />
                <span>Connect Repository</span>
              </Link>
            </div>
          </div>

          {/* Right Column: 4 Floating Glassmorphic Metric Cards */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-3.5">
            {/* Metric 1: LOC Indexed */}
            <div className="p-3.5 rounded-xl bg-[#091110]/80 border border-white/10 backdrop-blur-md flex items-center space-x-3 shadow-lg">
              <div className="w-10 h-10 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center flex-shrink-0 text-amber-400">
                <HubOutlinedIcon sx={{ fontSize: 20 }} />
              </div>
              <div>
                <div className="text-base font-extrabold text-white tracking-tight">50,000+</div>
                <div className="text-[10px] text-slate-400 font-medium">LOC Indexed</div>
              </div>
            </div>

            {/* Metric 2: Breaking precision */}
            <div className="p-3.5 rounded-xl bg-[#091110]/80 border border-white/10 backdrop-blur-md flex items-center space-x-3 shadow-lg">
              <div className="w-10 h-10 rounded-full bg-rose-500/15 border border-rose-500/30 flex items-center justify-center flex-shrink-0 text-rose-400">
                <GppMaybeOutlinedIcon sx={{ fontSize: 20 }} />
              </div>
              <div>
                <div className="text-base font-extrabold text-white tracking-tight">85%</div>
                <div className="text-[10px] text-slate-400 font-medium">Breaking change precision</div>
              </div>
            </div>

            {/* Metric 3: Analysis time */}
            <div className="p-3.5 rounded-xl bg-[#091110]/80 border border-white/10 backdrop-blur-md flex items-center space-x-3 shadow-lg">
              <div className="w-10 h-10 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center flex-shrink-0 text-emerald-400">
                <BoltOutlinedIcon sx={{ fontSize: 20 }} />
              </div>
              <div>
                <div className="text-base font-extrabold text-white tracking-tight">&lt; 4.2s</div>
                <div className="text-[10px] text-slate-400 font-medium">PR analysis time</div>
              </div>
            </div>

            {/* Metric 4: Workspace isolation */}
            <div className="p-3.5 rounded-xl bg-[#091110]/80 border border-white/10 backdrop-blur-md flex items-center space-x-3 shadow-lg">
              <div className="w-10 h-10 rounded-full bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center flex-shrink-0 text-cyan-400">
                <SecurityOutlinedIcon sx={{ fontSize: 20 }} />
              </div>
              <div>
                <div className="text-base font-extrabold text-white tracking-tight">100%</div>
                <div className="text-[10px] text-slate-400 font-medium">Workspace isolation</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SIX BENTO CARDS ROW (Exact match to inspiration screenshot) */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
        {/* Card 1: PR Risk Analyzer */}
        <Link
          href="/pr-risk"
          className="rounded-xl border border-[#142623] bg-[#0A1211] p-3.5 flex flex-col justify-between hover:border-emerald-500/40 transition-all hover:bg-[#0D1816] group space-y-3"
        >
          <div className="space-y-2.5">
            <div className="flex items-center justify-between pb-1.5 border-b border-[#142623]">
              <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-200">
                <GppMaybeOutlinedIcon sx={{ fontSize: 15, color: "#10B981" }} />
                <span>PR Risk Analyzer</span>
              </div>
              <ChevronRightOutlinedIcon sx={{ fontSize: 15, color: "#64748B" }} className="group-hover:translate-x-0.5 transition-transform" />
            </div>

            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400 font-mono truncate">#842 Add streaming cache layer...</span>
              <span className="px-1.5 py-0.5 rounded bg-rose-500/15 border border-rose-500/30 text-rose-400 font-bold text-[9px] font-mono flex-shrink-0 ml-1">
                85/100 High Risk
              </span>
            </div>

            {/* Code diff lines */}
            <div className="bg-[#060A0A] rounded-lg p-2 font-mono text-[9px] leading-relaxed border border-[#142623] overflow-hidden space-y-0.5">
              <div className="text-rose-400 bg-rose-500/10 px-1 rounded">
                <span className="text-slate-600 mr-1.5">49</span>- const cacheTimeout = 3600;
              </div>
              <div className="text-emerald-400 bg-emerald-500/10 px-1 rounded">
                <span className="text-slate-600 mr-1.5">50</span>+ const cacheTimeout = 7200;
              </div>
              <div className="text-slate-400 px-1">
                <span className="text-slate-600 mr-1.5">51</span>const getCachedData = async () =&gt; &#123;
              </div>
              <div className="text-rose-400 bg-rose-500/10 px-1 rounded">
                <span className="text-slate-600 mr-1.5">52</span>- if (!session) return null;
              </div>
              <div className="text-emerald-400 bg-emerald-500/10 px-1 rounded">
                <span className="text-slate-600 mr-1.5">53</span>+ if (!session) throw new Error();
              </div>
              <div className="text-slate-400 px-1">
                <span className="text-slate-600 mr-1.5">54</span>return cache.get(&#39;user&#39;);
              </div>
            </div>
          </div>
        </Link>

        {/* Card 2: Architecture Q&A */}
        <Link
          href="/architecture-qa"
          className="rounded-xl border border-[#142623] bg-[#0A1211] p-3.5 flex flex-col justify-between hover:border-emerald-500/40 transition-all hover:bg-[#0D1816] group space-y-3"
        >
          <div className="space-y-2.5">
            <div className="flex items-center justify-between pb-1.5 border-b border-[#142623]">
              <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-200">
                <ChatBubbleOutlineOutlinedIcon sx={{ fontSize: 15, color: "#10B981" }} />
                <span>Architecture Q&A</span>
              </div>
              <ChevronRightOutlinedIcon sx={{ fontSize: 15, color: "#64748B" }} className="group-hover:translate-x-0.5 transition-transform" />
            </div>

            <div className="bg-[#060A0A] p-2 rounded-lg border border-[#142623] space-y-1.5">
              <div className="text-[10px] text-slate-300 italic truncate">
                How does the auth module handle session expiry?
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  3 sources
                </span>
              </div>
              <div className="font-mono text-[9px] text-slate-400 bg-[#09100E] p-1.5 rounded border border-[#142623] leading-snug">
                export async function validateSession(token: string): Promise&lt;Session | null&gt; &#123;
                <div className="text-emerald-400/80">// Check token expiry and refresh...</div>
                &#125;
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between bg-[#060A0A] px-2.5 py-1.5 rounded-lg border border-[#142623] text-[10px] text-slate-500">
            <span>Ask about your codebase...</span>
            <SendOutlinedIcon sx={{ fontSize: 12, color: "#64748B" }} />
          </div>
        </Link>

        {/* Card 3: Debt Heatmap */}
        <Link
          href="/debt-heatmap"
          className="rounded-xl border border-[#142623] bg-[#0A1211] p-3.5 flex flex-col justify-between hover:border-emerald-500/40 transition-all hover:bg-[#0D1816] group space-y-3"
        >
          <div className="space-y-2.5">
            <div className="flex items-center justify-between pb-1.5 border-b border-[#142623]">
              <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-200">
                <BarChartOutlinedIcon sx={{ fontSize: 15, color: "#EAB308" }} />
                <span>Debt Heatmap</span>
              </div>
              <ChevronRightOutlinedIcon sx={{ fontSize: 15, color: "#64748B" }} className="group-hover:translate-x-0.5 transition-transform" />
            </div>

            <div className="grid grid-cols-12 gap-2">
              {/* File tree */}
              <div className="col-span-5 font-mono text-[9px] text-slate-400 space-y-1">
                <div className="text-slate-300 font-semibold">📁 src</div>
                <div className="pl-1.5">auth</div>
                <div className="pl-1.5">api</div>
                <div className="pl-1.5">components</div>
                <div className="pl-1.5">utils</div>
                <div className="pl-1.5">config</div>
                <div className="pl-1.5">services</div>
              </div>

              {/* Heatmap blocks */}
              <div className="col-span-7 grid grid-cols-3 gap-1 relative">
                <div className="bg-emerald-500/30 rounded h-6 border border-emerald-500/50"></div>
                <div className="bg-emerald-500/20 rounded h-6 border border-emerald-500/40"></div>
                <div className="bg-amber-500/40 rounded h-6 border border-amber-500/60"></div>
                <div className="bg-emerald-500/25 rounded h-6 border border-emerald-500/50"></div>
                <div className="bg-rose-500/50 rounded h-6 border border-rose-500/70"></div>
                <div className="bg-amber-500/30 rounded h-6 border border-amber-500/50"></div>

                {/* Hotspot tooltip pill */}
                <div className="col-span-3 bg-[#060A0A] border border-rose-500/60 rounded p-1.5 text-[9px] font-mono text-center">
                  <div className="text-rose-400 font-bold truncate">src/auth/session.ts</div>
                  <div className="text-slate-400 text-[8px]">Debt Score: 92 • High complexity</div>
                </div>
              </div>
            </div>
          </div>
        </Link>

        {/* Card 4: Repositories */}
        <Link
          href="/repositories"
          className="rounded-xl border border-[#142623] bg-[#0A1211] p-3.5 flex flex-col justify-between hover:border-emerald-500/40 transition-all hover:bg-[#0D1816] group space-y-3"
        >
          <div className="space-y-2.5">
            <div className="flex items-center justify-between pb-1.5 border-b border-[#142623]">
              <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-200">
                <StorageOutlinedIcon sx={{ fontSize: 15, color: "#14B8A6" }} />
                <span>Repositories</span>
              </div>
              <AddOutlinedIcon sx={{ fontSize: 15, color: "#64748B" }} />
            </div>

            <div className="space-y-2 text-[10px] font-mono">
              <div className="flex items-center justify-between p-1.5 rounded bg-[#060A0A] border border-[#142623]">
                <div className="flex items-center space-x-1.5 truncate">
                  <StorageOutlinedIcon sx={{ fontSize: 13, color: "#10B981" }} />
                  <span className="text-slate-200 font-medium truncate">astral-core</span>
                </div>
                <span className="text-emerald-400 text-[9px] flex-shrink-0">50,000 LOC</span>
              </div>

              <div className="flex items-center justify-between p-1.5 rounded bg-[#060A0A] border border-[#142623]">
                <div className="flex items-center space-x-1.5 truncate">
                  <StorageOutlinedIcon sx={{ fontSize: 13, color: "#10B981" }} />
                  <span className="text-slate-200 font-medium truncate">web-client</span>
                </div>
                <span className="text-slate-400 text-[9px] flex-shrink-0">12,300 LOC</span>
              </div>

              <div className="flex items-center justify-between p-1.5 rounded bg-[#060A0A] border border-[#142623]">
                <div className="flex items-center space-x-1.5 truncate">
                  <StorageOutlinedIcon sx={{ fontSize: 13, color: "#10B981" }} />
                  <span className="text-slate-200 font-medium truncate">ml-agents</span>
                </div>
                <span className="text-slate-400 text-[9px] flex-shrink-0">8,900 LOC</span>
              </div>

              <div className="flex items-center justify-between p-1.5 rounded bg-[#060A0A] border border-[#142623]">
                <div className="flex items-center space-x-1.5 truncate">
                  <StorageOutlinedIcon sx={{ fontSize: 13, color: "#10B981" }} />
                  <span className="text-slate-200 font-medium truncate">infra</span>
                </div>
                <span className="text-slate-400 text-[9px] flex-shrink-0">4,200 LOC</span>
              </div>
            </div>
          </div>
        </Link>

        {/* Card 5: Analytics */}
        <Link
          href="/analytics"
          className="rounded-xl border border-[#142623] bg-[#0A1211] p-3.5 flex flex-col justify-between hover:border-emerald-500/40 transition-all hover:bg-[#0D1816] group space-y-3"
        >
          <div className="space-y-2.5">
            <div className="flex items-center justify-between pb-1.5 border-b border-[#142623]">
              <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-200">
                <BarChartOutlinedIcon sx={{ fontSize: 15, color: "#A855F7" }} />
                <span>Analytics</span>
              </div>
              <ChevronRightOutlinedIcon sx={{ fontSize: 15, color: "#64748B" }} className="group-hover:translate-x-0.5 transition-transform" />
            </div>

            <div className="flex items-center justify-between text-[10px]">
              <span className="text-slate-400">Query volume</span>
              <span className="font-bold text-white font-mono">248 <span className="text-emerald-400 text-[9px]">+12%</span></span>
            </div>

            {/* SVG Multi-wave chart with Y axis */}
            <div className="h-24 w-full bg-[#060A0A] rounded-lg p-2 border border-[#142623] flex items-center justify-between relative">
              <div className="text-[8px] font-mono text-slate-600 flex flex-col justify-between h-full">
                <span>40</span>
                <span>30</span>
                <span>20</span>
                <span>10</span>
              </div>
              <svg className="w-[85%] h-full overflow-visible" viewBox="0 0 100 40" fill="none">
                <path
                  d="M 0 35 Q 25 15 50 25 T 100 10"
                  stroke="#10B981"
                  strokeWidth="2"
                  fill="none"
                />
                <path
                  d="M 0 38 Q 25 25 50 30 T 100 18"
                  stroke="#EAB308"
                  strokeWidth="1.5"
                  strokeDasharray="2 2"
                  fill="none"
                />
                <path
                  d="M 0 39 Q 30 32 60 35 T 100 28"
                  stroke="#A855F7"
                  strokeWidth="1.5"
                  fill="none"
                />
              </svg>
            </div>

            <div className="flex items-center justify-between text-[8px] font-mono text-slate-400 pt-1">
              <span className="flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Arch</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-400"></span>
                <span>Deps</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                <span>Search</span>
              </span>
            </div>
          </div>
        </Link>

        {/* Card 6: System Architecture */}
        <Link
          href="/architecture"
          className="rounded-xl border border-[#142623] bg-[#0A1211] p-3.5 flex flex-col justify-between hover:border-emerald-500/40 transition-all hover:bg-[#0D1816] group space-y-3"
        >
          <div className="space-y-2.5">
            <div className="flex items-center justify-between pb-1.5 border-b border-[#142623]">
              <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-200">
                <AccountTreeOutlinedIcon sx={{ fontSize: 15, color: "#8B5CF6" }} />
                <span>System Architecture</span>
              </div>
              <ChevronRightOutlinedIcon sx={{ fontSize: 15, color: "#64748B" }} className="group-hover:translate-x-0.5 transition-transform" />
            </div>

            {/* Diagram node block */}
            <div className="bg-[#060A0A] p-2.5 rounded-lg border border-[#142623] space-y-2.5 font-mono text-[9px]">
              {/* Top row */}
              <div className="grid grid-cols-3 gap-1 text-center">
                <div className="p-1 rounded bg-[#0D1816] border border-cyan-500/40 text-cyan-300">
                  <div className="text-[7px] text-slate-500">Frontend</div>
                  <div className="font-bold">Next.js 14</div>
                </div>
                <div className="p-1 rounded bg-[#0D1816] border border-emerald-500/40 text-emerald-300">
                  <div className="text-[7px] text-slate-500">Backend</div>
                  <div className="font-bold">FastAPI</div>
                </div>
                <div className="p-1 rounded bg-[#0D1816] border border-amber-500/40 text-amber-300">
                  <div className="text-[7px] text-slate-500">Agents</div>
                  <div className="font-bold">LangGraph</div>
                </div>
              </div>

              {/* Connecting lines */}
              <div className="flex justify-around text-slate-600 text-[10px] leading-none">
                <span>↓</span>
                <span>↓</span>
                <span>↓</span>
              </div>

              {/* Bottom row */}
              <div className="grid grid-cols-2 gap-1 text-center">
                <div className="p-1 rounded bg-[#0D1816] border border-purple-500/40 text-purple-300">
                  <div className="text-[7px] text-slate-500">Vector DB</div>
                  <div className="font-bold">ChromaDB</div>
                </div>
                <div className="p-1 rounded bg-[#0D1816] border border-blue-500/40 text-blue-300">
                  <div className="text-[7px] text-slate-500">Database</div>
                  <div className="font-bold">PostgreSQL</div>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </section>
    </div>
  );
}
