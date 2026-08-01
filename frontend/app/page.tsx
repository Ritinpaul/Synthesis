"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { PRRiskCard } from "@/components/PRRiskCard";
import { QueryPanel } from "@/components/QueryPanel";
import { DebtHeatmap } from "@/components/DebtHeatmap";
import { RepoIndexer } from "@/components/RepoIndexer";
import { WorkspaceAnalyticsView } from "@/components/WorkspaceAnalyticsView";

type ActiveTab = "pr_risk" | "architecture_query" | "debt_heatmap" | "repositories" | "analytics";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("pr_risk");

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-zinc-950 text-zinc-200">
      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Workspace Container */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Bar Header */}
        <Header workspaceName="acme-corp" activeRepo="core-api" />

        {/* Tab Content Body */}
        <main className="flex-1 overflow-y-auto p-6 bg-zinc-950">
          <div className="max-w-6xl mx-auto">
            {activeTab === "pr_risk" && <PRRiskCard />}
            {activeTab === "architecture_query" && <QueryPanel />}
            {activeTab === "debt_heatmap" && <DebtHeatmap />}
            {activeTab === "repositories" && <RepoIndexer />}
            {activeTab === "analytics" && <WorkspaceAnalyticsView />}
          </div>
        </main>
      </div>
    </div>
  );
}
