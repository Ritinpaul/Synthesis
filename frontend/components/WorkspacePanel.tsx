type WorkspacePanelProps = {
  title: string;
  value: string;
  subtitle: string;
};

export function WorkspacePanel({ title, value, subtitle }: WorkspacePanelProps) {
  return (
    <article
      style={{
        background: "rgba(255, 255, 255, 0.8)",
        border: "1px solid #d8c5ab",
        borderRadius: 16,
        padding: 20,
        boxShadow: "0 10px 30px rgba(95, 60, 20, 0.08)",
      }}
    >
      <p style={{ margin: 0, fontSize: 12, letterSpacing: 1, textTransform: "uppercase", color: "#7d5a31" }}>{title}</p>
      <p style={{ margin: "12px 0 8px", fontSize: 30, fontWeight: 700 }}>{value}</p>
      <p style={{ margin: 0, color: "#4e4a45" }}>{subtitle}</p>
    </article>
  );
}
