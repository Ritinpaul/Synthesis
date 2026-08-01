export type Workspace = {
  workspace_id: number;
  name: string;
  created_at: string;
};

export type Repository = {
  repo_id: number;
  workspace_id: number;
  url: string;
  default_branch: string;
  last_indexed_at?: string;
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

export type WorkspaceAnalyticsResponse = {
  workspace_id: number;
  total_queries: number;
  avg_relevance_score: number;
  top_queried_files: { file_path: string; query_hits: number }[];
  top_search_keywords: string[];
  query_history_count: number;
};
