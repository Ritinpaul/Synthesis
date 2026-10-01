export type Workspace = {
  workspace_id: number;
  name: string;
  created_at: string;
};

export type UserProfile = {
  user_id: number;
  email: string;
  name: string;
  role: string;
  workspaces: Workspace[];
  active_workspace_id: number;
};

export type Repository = {
  repo_id: number;
  workspace_id: number;
  url: string;
  default_branch: string;
  last_indexed_at?: string;
};

export type RepositoryDetail = {
  repo_id: number;
  workspace_id: number;
  name: string;
  url: string;
  branch: string;
  provider: string;
  chunks: number;
  loc: number;
  reused_chunks: number;
  last_indexed: string;
  status: "synced" | "indexing" | "pending";
};

export type PRListItem = {
  pr_id: number;
  pr_number: number;
  title: string;
  author: string;
  breaking_change_score: number;
  debt_score: number;
  risk_level: "low" | "medium" | "high" | "critical";
  created_at: string;
};

export type Citation = {
  repo_id: number;
  file_path: string;
  chunk_id: number;
  snippet: string;
  symbol_name: string;
  confidence_score: number;
  confidence_tier: "high" | "medium" | "low";
};

export type ArchitectureQueryResponse = {
  answer: string;
  citations: Citation[];
  relevance_estimate: number;
  trace: { agent: string; status: string; detail: string }[];
};

export type PRAnalyzeResponse = {
  pr_id: number;
  repo_id: number;
  pr_number: number;
  title: string;
  author: string;
  breaking_change_score: number;
  debt_score: number;
  summary_text: string;
  risk_level: "low" | "medium" | "high" | "critical";
  blast_radius_count: number;
  impacted_files: string[];
  debt_markers: string[];
  generated_at: string;
};

export type DebtHeatmapItem = {
  file_path: string;
  symbol_name: string;
  loc: number;
  risk_score: number;
  status: "critical" | "warning" | "stable";
};

export type DebtHeatmapResponse = {
  workspace_id: number;
  total_files: number;
  avg_debt_score: number;
  critical_modules_count: number;
  modules: DebtHeatmapItem[];
};

export type WorkspaceAnalyticsResponse = {
  workspace_id: number;
  total_queries: number;
  avg_relevance_score: number;
  top_queried_files: { file_path: string; query_hits: number }[];
  top_search_keywords: string[];
  query_history_count: number;
};
