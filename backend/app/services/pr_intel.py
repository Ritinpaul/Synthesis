from __future__ import annotations

import re
from dataclasses import dataclass
from datetime import UTC, datetime
from typing import Any

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import CodeChunk, PullRequest, PrRiskSignal, Repository


@dataclass
class DiffSymbolImpact:
    file_path: str
    changed_symbols: list[str]
    change_type: str  # "added" | "modified" | "deleted"


@dataclass
class PRAnalysisResult:
    pr_id: int
    repo_id: int
    pr_number: int
    title: str
    author: str
    breaking_change_score: float
    debt_score: float
    summary_text: str
    risk_level: str
    blast_radius_count: int
    impacted_files: list[str]
    debt_markers: list[str]
    generated_at: datetime


def analyze_pr_diff(
    db: Session,
    repo_id: int,
    pr_number: int,
    title: str,
    author: str,
    diff_text: str | None = None,
) -> PRAnalysisResult:
    # 1. Fetch or create PullRequest record
    pr = db.execute(
        select(PullRequest).where(
            PullRequest.repo_id == repo_id,
            PullRequest.pr_number == pr_number,
        )
    ).scalar_one_or_none()

    if pr is None:
        pr = PullRequest(
            repo_id=repo_id,
            pr_number=pr_number,
            title=title,
            author=author,
        )
        db.add(pr)
        db.flush()
    else:
        pr.title = title
        pr.author = author

    effective_diff = diff_text or _generate_mock_diff(title)

    # 2. Extract changed files and symbols
    impacts = _parse_diff_symbols(effective_diff)
    changed_files = [imp.file_path for imp in impacts]
    all_changed_symbols = [sym for imp in impacts for sym in imp.changed_symbols]

    # 3. Blast radius analysis (how many existing code chunks reference changed symbols)
    blast_radius_count = 0
    if all_changed_symbols:
        ref_chunks = db.execute(
            select(CodeChunk).where(
                CodeChunk.repo_id == repo_id,
            )
        ).scalars().all()
        for chunk in ref_chunks:
            for sym in all_changed_symbols:
                if sym != "global" and sym in chunk.chunk_text and chunk.file_path not in changed_files:
                    blast_radius_count += 1

    # 4. Compute Breaking Change Score (0.0 to 100.0)
    breaking_score = _calculate_breaking_change_score(title, effective_diff, impacts, blast_radius_count)

    # 5. Compute Technical Debt Score (0.0 to 100.0) & markers
    debt_score, debt_markers = _calculate_debt_score(effective_diff, changed_files)

    # 6. Risk Level
    risk_level = "low"
    if breaking_score >= 75.0 or debt_score >= 75.0:
        risk_level = "critical"
    elif breaking_score >= 50.0 or debt_score >= 50.0:
        risk_level = "high"
    elif breaking_score >= 25.0 or debt_score >= 25.0:
        risk_level = "medium"

    # 7. Generate markdown summary
    summary_text = _generate_summary_md(
        title=title,
        author=author,
        pr_number=pr_number,
        risk_level=risk_level,
        breaking_score=breaking_score,
        debt_score=debt_score,
        changed_files=changed_files,
        all_changed_symbols=all_changed_symbols,
        blast_radius_count=blast_radius_count,
        debt_markers=debt_markers,
    )

    # 8. Persist PrRiskSignal
    now = datetime.now(UTC).replace(tzinfo=None)
    signal = db.execute(
        select(PrRiskSignal).where(PrRiskSignal.pr_id == pr.pr_id)
    ).scalar_one_or_none()

    if signal is None:
        signal = PrRiskSignal(
            pr_id=pr.pr_id,
            breaking_change_score=breaking_score,
            debt_score=debt_score,
            summary_text=summary_text,
            generated_at=now,
        )
        db.add(signal)
    else:
        signal.breaking_change_score = breaking_score
        signal.debt_score = debt_score
        signal.summary_text = summary_text
        signal.generated_at = now

    db.commit()

    return PRAnalysisResult(
        pr_id=pr.pr_id,
        repo_id=repo_id,
        pr_number=pr_number,
        title=title,
        author=author,
        breaking_change_score=breaking_score,
        debt_score=debt_score,
        summary_text=summary_text,
        risk_level=risk_level,
        blast_radius_count=blast_radius_count,
        impacted_files=changed_files,
        debt_markers=debt_markers,
        generated_at=now,
    )


def _parse_diff_symbols(diff_text: str) -> list[DiffSymbolImpact]:
    impacts: list[DiffSymbolImpact] = []
    current_file = "unknown"
    current_symbols: list[str] = []
    change_type = "modified"

    for line in diff_text.splitlines():
        if line.startswith("+++ b/") or line.startswith("--- a/"):
            file_candidate = line[6:].strip()
            if file_candidate and file_candidate != "/dev/null":
                current_file = file_candidate
        elif line.startswith("new file"):
            change_type = "added"
        elif line.startswith("deleted file"):
            change_type = "deleted"
        elif line.startswith("+") and not line.startswith("+++"):
            code_line = line[1:]
            sym = _extract_symbol_from_line(code_line)
            if sym and sym not in current_symbols:
                current_symbols.append(sym)

        if current_file != "unknown" and current_file not in [imp.file_path for imp in impacts]:
            impacts.append(
                DiffSymbolImpact(
                    file_path=current_file,
                    changed_symbols=current_symbols,
                    change_type=change_type,
                )
            )

    return impacts or [
        DiffSymbolImpact(file_path="src/main.py", changed_symbols=["handle_request"], change_type="modified")
    ]


def _extract_symbol_from_line(line: str) -> str | None:
    match = re.search(r"(?:def|class|function|interface|type)\s+([a-zA-Z_][a-zA-Z0-9_]*)", line)
    return match.group(1) if match else None


def _calculate_breaking_change_score(
    title: str, diff_text: str, impacts: list[DiffSymbolImpact], blast_radius: int
) -> float:
    score = 10.0  # base
    title_lower = title.lower()
    diff_lower = diff_text.lower()

    if "breaking" in title_lower or "major" in title_lower or "refactor!" in title_lower:
        score += 40.0
    if "api" in title_lower or "schema" in title_lower or "auth" in title_lower:
        score += 15.0

    if "removed" in diff_lower or "deleted" in diff_lower or "-def " in diff_text or "-class " in diff_text:
        score += 25.0

    # blast radius contribution
    score += min(25.0, blast_radius * 5.0)

    # file count multiplier
    file_count = len(impacts)
    if file_count > 10:
        score += 15.0
    elif file_count > 5:
        score += 8.0

    return min(99.0, max(5.0, round(score, 1)))


def _calculate_debt_score(diff_text: str, changed_files: list[str]) -> tuple[float, list[str]]:
    score = 5.0
    markers: list[str] = []

    diff_lower = diff_text.lower()
    if "todo" in diff_lower:
        score += 20.0
        markers.append("Contains TODO items")
    if "fixme" in diff_lower or "hack" in diff_lower:
        score += 25.0
        markers.append("Contains HACK / FIXME workarounds")
    if "deprecated" in diff_lower:
        score += 15.0
        markers.append("Uses or adds deprecated symbols")
    if "except exception:" in diff_lower or "except:" in diff_lower or "catch (e)" in diff_lower:
        score += 15.0
        markers.append("Broad exception handling without logging")
    if "any" in diff_lower and any(f.endswith(".ts") or f.endswith(".tsx") for f in changed_files):
        score += 10.0
        markers.append("Type safety evasion (`any` type)")

    if not markers:
        markers.append("Clean implementation with no explicit technical debt tags")

    return min(95.0, max(5.0, round(score, 1))), markers


def _generate_summary_md(
    title: str,
    author: str,
    pr_number: int,
    risk_level: str,
    breaking_score: float,
    debt_score: float,
    changed_files: list[str],
    all_changed_symbols: list[str],
    blast_radius_count: int,
    debt_markers: list[str],
) -> str:
    files_str = ", ".join(changed_files[:5]) if changed_files else "None"
    symbols_str = ", ".join(all_changed_symbols[:5]) if all_changed_symbols else "global"
    debt_markers_str = "".join(f"- {m}\n" for m in debt_markers)
    recommendation = "Requires senior engineering review before merge due to potential API breaking changes." if breaking_score >= 50 else "Safe to merge after standard automated test validation."

    return f"""### Synthesis PR Risk & Debt Summary — PR #{pr_number}

**Title:** {title}
**Author:** {author}
**Overall Risk Level:** `{risk_level.upper()}`

---

#### 📊 Risk Metrics
- **Breaking Change Score:** `{breaking_score} / 100`
- **Technical Debt Score:** `{debt_score} / 100`
- **Dependency Blast Radius:** `{blast_radius_count} external caller module(s)`

#### 🔍 Changed Scope
- **Modified Files:** `{files_str}`
- **Exported Symbols Changed:** `{symbols_str}`

#### ⚠️ Technical Debt & Quality Signals
{debt_markers_str}

#### 🤖 AI Recommendation
{recommendation}
"""


def _generate_mock_diff(title: str) -> str:
    return f"""--- a/app/core.py
+++ b/app/core.py
@@ -10,6 +10,8 @@
 def process_data(payload: dict):
+    # TODO: refactor legacy pipeline
+    # FIXME: check for null keys
     return payload
"""
