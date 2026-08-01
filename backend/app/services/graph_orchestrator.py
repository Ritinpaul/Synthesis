from __future__ import annotations

from dataclasses import dataclass
from typing import Any

from app.models import CodeChunk


@dataclass
class EvaluatedCitation:
    repo_id: int
    file_path: str
    chunk_id: int
    snippet: str
    symbol_name: str
    confidence_score: float
    confidence_tier: str  # "high" | "medium" | "low"


@dataclass
class GraphResult:
    answer: str
    relevance: float
    citations: list[EvaluatedCitation]
    trace: list[dict[str, str]]


def run_graph(
    question: str,
    retrieved_chunks: list[CodeChunk],
    chunk_scores: dict[int, float] | None = None,
) -> GraphResult:
    chunk_scores = chunk_scores or {}

    # Agent 1: Parser Agent
    parser_output = _parser_agent(question)

    # Agent 2: Impact Analyzer Agent
    impact_output, citations = _impact_analyzer_agent(retrieved_chunks, chunk_scores, parser_output["target_keywords"])

    # Agent 3: Doc Generator Agent
    answer, relevance = _doc_generator_agent(question, retrieved_chunks, parser_output, impact_output, citations)

    trace = [
        {
            "agent": "parser",
            "status": "ok",
            "detail": f"parsed_intent={parser_output['intent']}; keywords={','.join(parser_output['target_keywords'][:5])}",
        },
        {
            "agent": "impact_analyzer",
            "status": "ok",
            "detail": f"analyzed_chunks={len(retrieved_chunks)}; risk_points={impact_output['risk_points']}; blast_files={len(impact_output['top_files'])}",
        },
        {
            "agent": "doc_generator",
            "status": "ok",
            "detail": f"synthesized_response; relevance={relevance:.2f}; citations={len(citations)}",
        },
    ]

    return GraphResult(
        answer=answer,
        relevance=relevance,
        citations=citations,
        trace=trace,
    )


def _parser_agent(question: str) -> dict[str, Any]:
    raw_tokens = [token.strip(".,:;!?()[]{}'\"").lower() for token in question.split()]
    stop_words = {"what", "which", "how", "where", "does", "this", "that", "from", "with", "about", "for", "and", "the", "are"}
    keywords = [tok for tok in raw_tokens if len(tok) > 2 and tok not in stop_words]

    intent = "general_architecture_query"
    if any(term in question.lower() for term in ["depend", "caller", "import", "module", "relationship"]):
        intent = "dependency_impact_analysis"
    elif any(term in question.lower() for term in ["auth", "token", "jwt", "security", "permission"]):
        intent = "security_architecture_query"
    elif any(term in question.lower() for term in ["db", "database", "table", "schema", "model"]):
        intent = "data_layer_query"

    return {
        "intent": intent,
        "target_keywords": keywords[:8],
        "token_count": len(raw_tokens),
    }


def _impact_analyzer_agent(
    chunks: list[CodeChunk],
    chunk_scores: dict[int, float],
    keywords: list[str],
) -> tuple[dict[str, Any], list[EvaluatedCitation]]:
    if not chunks:
        return {"risk_points": 0, "top_files": [], "symbols": []}, []

    risk_points = 0
    symbols: list[str] = []
    file_paths: set[str] = set()
    citations: list[EvaluatedCitation] = []

    for chunk in chunks:
        text = chunk.chunk_text.lower()
        if "todo" in text:
            risk_points += 1
        if "deprecated" in text:
            risk_points += 2
        if "breaking" in text:
            risk_points += 3

        if chunk.symbol_name != "global" and chunk.symbol_name not in symbols:
            symbols.append(chunk.symbol_name)
        file_paths.add(chunk.file_path)

        # Confidence Calibration per citation
        raw_score = chunk_scores.get(chunk.chunk_id, 0.75)

        # Keyword match boost
        kw_matches = sum(1 for kw in keywords if kw in text)
        calibrated_score = min(0.98, max(0.40, raw_score + (0.04 * kw_matches)))

        if calibrated_score >= 0.85:
            tier = "high"
        elif calibrated_score >= 0.65:
            tier = "medium"
        else:
            tier = "low"

        snippet = chunk.chunk_text[:220].replace("\n", " ")
        citations.append(
            EvaluatedCitation(
                repo_id=chunk.repo_id,
                file_path=chunk.file_path,
                chunk_id=chunk.chunk_id,
                snippet=snippet,
                symbol_name=chunk.symbol_name,
                confidence_score=round(calibrated_score, 3),
                confidence_tier=tier,
            )
        )

    citations.sort(key=lambda c: c.confidence_score, reverse=True)

    impact_meta = {
        "risk_points": risk_points,
        "top_files": sorted(file_paths)[:5],
        "symbols": symbols[:8],
    }

    return impact_meta, citations


def _doc_generator_agent(
    question: str,
    chunks: list[CodeChunk],
    parser_output: dict[str, Any],
    impact_output: dict[str, Any],
    citations: list[EvaluatedCitation],
) -> tuple[str, float]:
    if not chunks:
        return (
            "I could not find relevant indexed code chunks for this workspace question.\n"
            "Please ensure the target repository is indexed via `POST /repos/index`.",
            0.0,
        )

    top_files = impact_output["top_files"]
    symbols = impact_output["symbols"]
    intent = parser_output["intent"]

    high_conf_citations = [c for c in citations if c.confidence_tier == "high"]
    avg_conf = sum(c.confidence_score for c in citations) / len(citations) if citations else 0.5
    relevance = min(0.99, max(0.60, round(avg_conf + (0.02 * len(high_conf_citations)), 2)))

    answer_lines = [
        f"### Architecture Query Analysis",
        f"**Question:** {question}",
        f"**Detected Query Intent:** `{intent}`",
        "",
        "Architecture summary:",
        f"- **Primary Modules Affected:** {', '.join(top_files) if top_files else 'Root workspace'}",
        f"- **Key Exported Symbols Identified:** {', '.join(symbols[:5]) if symbols else 'Global module scope'}",
        f"- **Risk & Debt Score Markers:** {impact_output['risk_points']} warning signals detected across context chunks",
        "",
        "#### Synthesis Recommendation",
        f"Based on `{len(citations)}` retrieved code citation(s) (Overall Relevance: `{relevance*100:.0f}%`), review the high-confidence code locations listed in the citations below for full dependency context.",
    ]

    return "\n".join(answer_lines), relevance
