from __future__ import annotations

from dataclasses import dataclass

from app.models import CodeChunk


@dataclass
class GraphResult:
    answer: str
    relevance: float
    trace: list[dict[str, str]]


def run_graph(question: str, retrieved_chunks: list[CodeChunk]) -> GraphResult:
    parser_context = _parser_agent(question)
    impact_context = _impact_analyzer_agent(retrieved_chunks)
    answer, relevance = _doc_generator_agent(question, retrieved_chunks, parser_context, impact_context)

    trace = [
        {"agent": "parser", "status": "ok", "detail": parser_context},
        {"agent": "impact_analyzer", "status": "ok", "detail": impact_context},
        {"agent": "doc_generator", "status": "ok", "detail": "response_synthesized"},
    ]

    return GraphResult(answer=answer, relevance=relevance, trace=trace)


def _parser_agent(question: str) -> str:
    keywords = [token.strip(".,:;!?()[]{}") for token in question.split() if len(token) > 3]
    unique_keywords = sorted({token.lower() for token in keywords})[:8]
    if not unique_keywords:
        return "no_keywords_detected"
    return "keywords=" + ",".join(unique_keywords)


def _impact_analyzer_agent(chunks: list[CodeChunk]) -> str:
    if not chunks:
        return "no_context_chunks"

    risk_points = 0
    for chunk in chunks:
        text = chunk.chunk_text.lower()
        if "todo" in text:
            risk_points += 1
        if "deprecated" in text:
            risk_points += 2
        if "breaking" in text:
            risk_points += 3

    return f"context_chunks={len(chunks)};risk_points={risk_points}"


def _doc_generator_agent(
    question: str,
    chunks: list[CodeChunk],
    parser_context: str,
    impact_context: str,
) -> tuple[str, float]:
    if not chunks:
        return (
            "I could not find relevant indexed code for this workspace question. "
            "Run /repos/index first for the target repository.",
            0.0,
        )

    top_paths = sorted({chunk.file_path for chunk in chunks})[:5]
    answer_lines = [
        f"Question: {question}",
        "Architecture summary:",
        f"- Most relevant files: {', '.join(top_paths)}",
        f"- Parser context: {parser_context}",
        f"- Impact context: {impact_context}",
        "- Recommendation: focus refactoring and review on the cited files first.",
    ]

    relevance = min(0.99, 0.55 + (0.08 * len(chunks)))
    return "\n".join(answer_lines), relevance
