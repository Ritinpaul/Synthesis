import { WorkspacePanel } from "@/components/WorkspacePanel";
import type { DashboardStat } from "@/lib/types";

const stats: DashboardStat[] = [
  { title: "Indexed Chunks", value: "0", subtitle: "Run /repos/index to populate" },
  { title: "Active Risk Alerts", value: "0", subtitle: "Phase 3 adds PR risk stream" },
  { title: "Architecture Queries", value: "0", subtitle: "Tracked in query_logs" },
];

export default function HomePage() {
  return (
    <main style={{ maxWidth: 1080, margin: "0 auto", padding: "56px 24px" }}>
      <section style={{ marginBottom: 30 }}>
        <h1 style={{ margin: 0, fontSize: 44, lineHeight: 1.1 }}>Synthesis Workspace Intelligence</h1>
        <p style={{ maxWidth: 720, fontSize: 18, color: "#3f3a33" }}>
          Phase 1 and 2 dashboard shell for workspace indexing and architecture Q/A. Connect this UI
          to backend APIs to visualize repository health and query relevance trends.
        </p>
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 18,
        }}
      >
        {stats.map((card) => (
          <WorkspacePanel
            key={card.title}
            title={card.title}
            value={card.value}
            subtitle={card.subtitle}
          />
        ))}
      </section>
    </main>
  );
}
