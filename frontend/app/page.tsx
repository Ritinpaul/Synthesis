"use client";

import React, { useState } from "react";
import Link from "next/link";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import StorageOutlinedIcon from "@mui/icons-material/StorageOutlined";
import GppMaybeOutlinedIcon from "@mui/icons-material/GppMaybeOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
import HubOutlinedIcon from "@mui/icons-material/HubOutlined";
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import GitHubIcon from "@mui/icons-material/GitHub";
import GridOnOutlinedIcon from "@mui/icons-material/GridOnOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";

export default function OverviewPage() {
  const [qaInput, setQaInput] = useState("");

  return (
    <div className="px-6 py-6 pb-16 space-y-8 max-w-[1600px] mx-auto">

      {/* ═══════════════════════════════════════════════════════
          HERO SECTION — Cinematic background, unchanged spirit
          ═══════════════════════════════════════════════════════ */}
      <section
        className="relative rounded-2xl border border-[#142623] overflow-hidden min-h-[420px] flex items-center p-10 md:p-14 shadow-2xl"
        style={{
          background: `linear-gradient(90deg, rgba(6, 10, 10, 0.96) 0%, rgba(6, 10, 10, 0.88) 45%, rgba(6, 10, 10, 0.25) 100%), url('/hero.png') center / cover no-repeat`,
        }}
      >
        {/* Subtle emerald vignette at bottom */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#060A0A]/80 to-transparent pointer-events-none" />

        <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-5">
            <div className="text-[11px] font-mono tracking-widest uppercase font-semibold text-emerald-400 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              AI-POWERED CODEBASE INTELLIGENCE
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.05]">
              See the impact<br />
              <span className="text-white">before you merge.</span>
            </h1>

            <p className="text-slate-300 text-sm leading-relaxed max-w-lg font-normal">
              Multi-agent analysis for safer, smarter, and faster development.
              Detect breaking changes, visualize dependencies, and explore your
              codebase with AI — in seconds.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                href="/pr-risk"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-[#060A0A] font-semibold text-sm transition-all shadow-lg shadow-emerald-950/60"
              >
                <span>Analyze a Pull Request</span>
                <ArrowForwardOutlinedIcon sx={{ fontSize: 16 }} />
              </Link>

              <Link
                href="/repositories"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#0A1412]/80 hover:bg-[#101F1C] border border-[#182F2A] text-slate-200 font-medium text-sm transition-all backdrop-blur-md"
              >
                <GitHubIcon sx={{ fontSize: 16 }} />
                <span>Connect Repository</span>
              </Link>
            </div>
          </div>

          {/* Right Column: 2×2 Glassmorphic Metric Tiles */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            {[
              { icon: <HubOutlinedIcon sx={{ fontSize: 22 }} />, value: "50,000+", label: "LOC Indexed", color: "amber" },
              { icon: <GppMaybeOutlinedIcon sx={{ fontSize: 22 }} />, value: "85%", label: "Breaking change precision", color: "rose" },
              { icon: <BoltOutlinedIcon sx={{ fontSize: 22 }} />, value: "< 4.2s", label: "PR analysis time", color: "emerald" },
              { icon: <SecurityOutlinedIcon sx={{ fontSize: 22 }} />, value: "100%", label: "Workspace isolation", color: "cyan" },
            ].map((m, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-[#091110]/80 border border-white/10 backdrop-blur-md flex items-center gap-3.5 shadow-lg"
              >
                <div className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 ${
                  m.color === "amber" ? "bg-amber-500/15 border border-amber-500/30 text-amber-400" :
                  m.color === "rose"  ? "bg-rose-500/15 border border-rose-500/30 text-rose-400" :
                  m.color === "emerald" ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400" :
                  "bg-cyan-500/15 border border-cyan-500/30 text-cyan-400"
                }`}>
                  {m.icon}
                </div>
                <div>
                  <div className="text-xl font-extrabold text-white tracking-tight leading-tight">{m.value}</div>
                  <div className="text-[11px] text-slate-400 font-medium mt-0.5">{m.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION LABEL
          ═══════════════════════════════════════════════════════ */}
      <div className="flex items-center gap-4 pt-2">
        <span className="text-[10px] font-mono tracking-widest uppercase text-slate-500 font-semibold">
          Intelligence Modules
        </span>
        <div className="flex-1 h-px bg-[#142623]" />
        <span className="text-[10px] text-slate-600 font-mono">6 tools active</span>
      </div>

      {/* ═══════════════════════════════════════════════════════
          FEATURED ROW — 2 Large Cards
          ═══════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* ── Card 1: PR Risk Analyzer (Large) ── */}
        <Link
          href="/pr-risk"
          className="group rounded-2xl border border-[#142623] bg-[#0A1211] p-6 flex flex-col gap-5 hover:border-emerald-500/35 hover:bg-[#0D1816] hover:shadow-lg hover:shadow-emerald-950/20 transition-all duration-200"
        >
          {/* Card Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/12 border border-emerald-500/25 flex items-center justify-center text-emerald-400">
                <GppMaybeOutlinedIcon sx={{ fontSize: 17 }} />
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-100">PR Risk Analyzer</div>
                <div className="text-[10px] text-slate-500">AST-level breaking change detection</div>
              </div>
            </div>
            <ChevronRightOutlinedIcon
              sx={{ fontSize: 18, color: "#475569" }}
              className="group-hover:translate-x-1 transition-transform duration-200"
            />
          </div>

          {/* PR Meta row */}
          <div className="flex items-center justify-between bg-[#060A0A] border border-[#142623] rounded-xl px-4 py-3">
            <div>
              <div className="text-[11px] text-slate-400 font-mono">#842</div>
              <div className="text-xs text-slate-200 font-medium mt-0.5 truncate max-w-[260px]">
                Add streaming cache layer to async gateway
              </div>
            </div>
            <span className="flex-shrink-0 px-2.5 py-1 rounded-lg bg-rose-500/12 border border-rose-500/25 text-rose-400 font-bold text-[10px] font-mono">
              85/100 HIGH
            </span>
          </div>

          {/* Code Diff */}
          <div className="bg-[#060A0A] rounded-xl p-4 font-mono text-[11px] leading-6 border border-[#142623] space-y-0.5 overflow-hidden">
            <div className="text-slate-500 text-[10px] mb-2 pb-1.5 border-b border-[#142623]">
              src/payments/core.py • @@ -49,7 +49,8 @@
            </div>
            <div className="text-rose-400 bg-rose-500/8 px-2 py-0.5 rounded">
              <span className="text-slate-600 mr-2 select-none">49</span>- const cacheTimeout = 3600;
            </div>
            <div className="text-emerald-400 bg-emerald-500/8 px-2 py-0.5 rounded">
              <span className="text-slate-600 mr-2 select-none">50</span>+ const cacheTimeout = 7200;
            </div>
            <div className="text-slate-400 px-2 py-0.5">
              <span className="text-slate-600 mr-2 select-none">51</span>const getCachedData = async () =&gt; &#123;
            </div>
            <div className="text-rose-400 bg-rose-500/8 px-2 py-0.5 rounded">
              <span className="text-slate-600 mr-2 select-none">52</span>- if (!session) return null;
            </div>
            <div className="text-emerald-400 bg-emerald-500/8 px-2 py-0.5 rounded">
              <span className="text-slate-600 mr-2 select-none">53</span>+ if (!session) throw new Error();
            </div>
            <div className="text-slate-400 px-2 py-0.5">
              <span className="text-slate-600 mr-2 select-none">54</span>return cache.get(&#39;user&#39;);
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-auto pt-1">
            <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
              <AccessTimeOutlinedIcon sx={{ fontSize: 12 }} />
              <span>Last analyzed 2 min ago</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
              <span>Analyze another PR</span>
              <ArrowForwardOutlinedIcon sx={{ fontSize: 12 }} />
            </div>
          </div>
        </Link>

        {/* ── Card 2: Architecture Q&A (Large) ── */}
        <Link
          href="/architecture-qa"
          className="group rounded-2xl border border-[#142623] bg-[#0A1211] p-6 flex flex-col gap-5 hover:border-emerald-500/35 hover:bg-[#0D1816] hover:shadow-lg hover:shadow-emerald-950/20 transition-all duration-200"
        >
          {/* Card Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/12 border border-cyan-500/25 flex items-center justify-center text-cyan-400">
                <ChatBubbleOutlineOutlinedIcon sx={{ fontSize: 17 }} />
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-100">Architecture Q&A</div>
                <div className="text-[10px] text-slate-500">RAG-powered codebase exploration</div>
              </div>
            </div>
            <ChevronRightOutlinedIcon
              sx={{ fontSize: 18, color: "#475569" }}
              className="group-hover:translate-x-1 transition-transform duration-200"
            />
          </div>

          {/* Question input preview */}
          <div className="flex items-center gap-2 bg-[#060A0A] border border-[#1F3A35] rounded-xl px-4 py-3 group-hover:border-emerald-500/25 transition-colors">
            <span className="text-[11px] text-slate-400 flex-1 font-mono italic">
              How does the auth module handle session expiry?
            </span>
            <SendOutlinedIcon sx={{ fontSize: 14, color: "#10B981" }} />
          </div>

          {/* Answer snippet */}
          <div className="bg-[#060A0A] rounded-xl border border-[#142623] p-4 space-y-3 flex-1">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-[10px] text-emerald-400 font-mono font-medium">3 sources found</span>
              <span className="ml-auto flex items-center gap-1 text-[10px] text-slate-500">
                <VerifiedOutlinedIcon sx={{ fontSize: 12 }} />
                96% confidence
              </span>
            </div>

            <div className="font-mono text-[10.5px] text-slate-300 bg-[#09100E] rounded-lg p-3 border border-[#142623] leading-relaxed">
              <span className="text-slate-500 block mb-1">// backend/app/auth.py — validateSession()</span>
              <span className="text-cyan-300">export async function</span>{" "}
              <span className="text-emerald-300">validateSession</span>
              <span className="text-slate-300">(token: string):</span>{" "}
              <span className="text-amber-300">Promise</span>
              <span className="text-slate-300">&lt;Session | null&gt; &#123;</span>
              <div className="text-emerald-400/70 mt-1 pl-4">// Check token expiry and refresh...</div>
              <span className="text-slate-300">&#125;</span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {["backend/app/auth.py", "app/dependencies.py", "app/main.py"].map(f => (
                <span key={f} className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#0D1816] border border-[#142623] text-slate-400">
                  {f}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between mt-auto pt-1">
            <div className="text-[10px] text-slate-500">Ask anything about your codebase</div>
            <div className="flex items-center gap-1 text-[10px] text-cyan-400 font-medium">
              <span>Open Q&A</span>
              <ArrowForwardOutlinedIcon sx={{ fontSize: 12 }} />
            </div>
          </div>
        </Link>
      </div>

      {/* ═══════════════════════════════════════════════════════
          SECONDARY ROW — 4 Compact Cards
          ═══════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-5">

        {/* ── Card 3: Debt Heatmap ── */}
        <Link
          href="/debt-heatmap"
          className="group rounded-2xl border border-[#142623] bg-[#0A1211] p-5 flex flex-col gap-4 hover:border-amber-500/25 hover:bg-[#0D1816] hover:shadow-lg hover:shadow-amber-950/10 transition-all duration-200"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GridOnOutlinedIcon sx={{ fontSize: 15, color: "#F59E0B" }} />
              <span className="text-xs font-semibold text-slate-200">Debt Heatmap</span>
            </div>
            <ChevronRightOutlinedIcon sx={{ fontSize: 14, color: "#475569" }} className="group-hover:translate-x-0.5 transition-transform" />
          </div>

          {/* Score badge */}
          <div className="flex items-center gap-2">
            <div className="text-2xl font-extrabold text-amber-400 tracking-tight">92</div>
            <div className="text-[10px] text-slate-400 leading-tight">Debt<br />score</div>
            <span className="ml-auto text-[9px] px-2 py-1 rounded-lg bg-amber-500/12 border border-amber-500/25 text-amber-400 font-mono font-semibold">HIGH</span>
          </div>

          {/* Heatmap grid */}
          <div className="space-y-1 font-mono text-[9.5px]">
            {[
              { name: "src", cells: ["#10B981", "#10B981", "#F59E0B"] },
              { name: "auth", cells: ["#10B981", "#10B981", "#10B981"] },
              { name: "api", cells: ["#10B981", "#EF4444", "#F59E0B"] },
              { name: "utils", cells: ["#F59E0B", "#EF4444", null] },
            ].map(row => (
              <div key={row.name} className="flex items-center gap-2">
                <span className="text-slate-500 w-10 truncate">{row.name}</span>
                <div className="flex gap-1">
                  {row.cells.map((c, i) => (
                    c ? <div key={i} style={{ backgroundColor: c + "30", borderColor: c + "60" }} className="w-4 h-4 rounded border" /> : null
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="text-[9px] text-slate-500 font-mono mt-auto">src/auth/session.ts • High complexity</div>
        </Link>

        {/* ── Card 4: Repositories ── */}
        <Link
          href="/repositories"
          className="group rounded-2xl border border-[#142623] bg-[#0A1211] p-5 flex flex-col gap-4 hover:border-emerald-500/25 hover:bg-[#0D1816] hover:shadow-lg hover:shadow-emerald-950/10 transition-all duration-200"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <StorageOutlinedIcon sx={{ fontSize: 15, color: "#10B981" }} />
              <span className="text-xs font-semibold text-slate-200">Repositories</span>
            </div>
            <button className="w-6 h-6 rounded-md bg-emerald-500/12 border border-emerald-500/25 flex items-center justify-center text-emerald-400 hover:bg-emerald-500/20 transition-colors">
              <AddOutlinedIcon sx={{ fontSize: 13 }} />
            </button>
          </div>

          {/* Repo list */}
          <div className="space-y-2.5 flex-1">
            {[
              { name: "astral-core", loc: "50,000", active: true },
              { name: "web-client", loc: "12,300", active: false },
              { name: "ml-agents", loc: "8,900", active: false },
              { name: "infra", loc: "4,200", active: false },
            ].map(r => (
              <div key={r.name} className="flex items-center justify-between py-1 border-b border-[#0F1C1A] last:border-0">
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${r.active ? "bg-emerald-400" : "bg-slate-600"}`} />
                  <span className="text-[11px] text-slate-200 font-medium">{r.name}</span>
                </div>
                <span className={`text-[10px] font-mono ${r.active ? "text-emerald-400" : "text-slate-500"}`}>{r.loc}</span>
              </div>
            ))}
          </div>
        </Link>

        {/* ── Card 5: Analytics ── */}
        <Link
          href="/analytics"
          className="group rounded-2xl border border-[#142623] bg-[#0A1211] p-5 flex flex-col gap-4 hover:border-purple-500/25 hover:bg-[#0D1816] hover:shadow-lg hover:shadow-purple-950/10 transition-all duration-200"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChartOutlinedIcon sx={{ fontSize: 15, color: "#A855F7" }} />
              <span className="text-xs font-semibold text-slate-200">Analytics</span>
            </div>
            <ChevronRightOutlinedIcon sx={{ fontSize: 14, color: "#475569" }} className="group-hover:translate-x-0.5 transition-transform" />
          </div>

          <div className="flex items-end gap-2">
            <div className="text-2xl font-extrabold text-white tracking-tight">248</div>
            <div className="text-[10px] text-emerald-400 font-mono mb-1">+12%</div>
            <div className="text-[10px] text-slate-500 mb-1 ml-auto">Queries / week</div>
          </div>

          {/* SVG Chart */}
          <div className="flex-1 bg-[#060A0A] rounded-xl border border-[#142623] p-3 min-h-[80px]">
            <svg className="w-full h-full" viewBox="0 0 120 48" fill="none" preserveAspectRatio="none">
              <path d="M 0 42 Q 30 22 60 30 T 120 12" stroke="#10B981" strokeWidth="2" fill="none" />
              <path d="M 0 46 Q 30 30 60 36 T 120 22" stroke="#EAB308" strokeWidth="1.5" strokeDasharray="3 2" fill="none" />
              <path d="M 0 47 Q 36 38 72 42 T 120 34" stroke="#A855F7" strokeWidth="1.5" fill="none" />
            </svg>
          </div>

          <div className="flex items-center justify-between text-[9px] font-mono text-slate-400">
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />Arch</span>
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-yellow-400 inline-block" />Deps</span>
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-purple-400 inline-block" />Search</span>
          </div>
        </Link>

        {/* ── Card 6: System Architecture ── */}
        <Link
          href="/architecture"
          className="group rounded-2xl border border-[#142623] bg-[#0A1211] p-5 flex flex-col gap-4 hover:border-violet-500/25 hover:bg-[#0D1816] hover:shadow-lg hover:shadow-violet-950/10 transition-all duration-200"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AccountTreeOutlinedIcon sx={{ fontSize: 15, color: "#8B5CF6" }} />
              <span className="text-xs font-semibold text-slate-200">Architecture</span>
            </div>
            <ChevronRightOutlinedIcon sx={{ fontSize: 14, color: "#475569" }} className="group-hover:translate-x-0.5 transition-transform" />
          </div>

          {/* Node diagram */}
          <div className="flex-1 bg-[#060A0A] rounded-xl border border-[#142623] p-3 font-mono text-[9.5px] space-y-3">
            <div className="grid grid-cols-3 gap-1.5 text-center">
              {[
                { label: "Frontend", tech: "Next.js 14", color: "cyan" },
                { label: "Backend", tech: "FastAPI", color: "emerald" },
                { label: "Agents", tech: "LangGraph", color: "amber" },
              ].map(n => (
                <div key={n.label} className={`p-1.5 rounded-lg border ${
                  n.color === "cyan" ? "bg-cyan-500/8 border-cyan-500/30 text-cyan-300" :
                  n.color === "emerald" ? "bg-emerald-500/8 border-emerald-500/30 text-emerald-300" :
                  "bg-amber-500/8 border-amber-500/30 text-amber-300"
                }`}>
                  <div className="text-[7px] text-slate-500 mb-0.5">{n.label}</div>
                  <div className="font-bold text-[9px]">{n.tech}</div>
                </div>
              ))}
            </div>

            <div className="flex justify-around text-slate-700 text-[11px] leading-none">
              <span>↓</span><span>↓</span><span>↓</span>
            </div>

            <div className="grid grid-cols-2 gap-1.5 text-center">
              {[
                { label: "Vector DB", tech: "ChromaDB", color: "purple" },
                { label: "Database", tech: "PostgreSQL", color: "blue" },
              ].map(n => (
                <div key={n.label} className={`p-1.5 rounded-lg border ${
                  n.color === "purple" ? "bg-purple-500/8 border-purple-500/30 text-purple-300" :
                  "bg-blue-500/8 border-blue-500/30 text-blue-300"
                }`}>
                  <div className="text-[7px] text-slate-500 mb-0.5">{n.label}</div>
                  <div className="font-bold text-[9px]">{n.tech}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-[9px] text-slate-500 font-mono">5 services • 2 databases</div>
        </Link>
      </div>
    </div>
  );
}
