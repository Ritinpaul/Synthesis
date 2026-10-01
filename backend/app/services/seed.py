from __future__ import annotations

import logging
from datetime import UTC, datetime
from sqlalchemy.orm import Session

from app.auth import hash_password
from app.models import (
    CodeChunk,
    IndexVersion,
    PrRiskSignal,
    PullRequest,
    QueryLog,
    Repository,
    User,
    Workspace,
    WorkspaceMembership,
)

logger = logging.getLogger(__name__)


def seed_database_if_empty(db: Session) -> None:
    """Ensures at least one real user, workspace, repository, and initial PR signals exist."""
    existing_user = db.query(User).filter(User.email == "ritin@synthesis.dev").first()
    if existing_user is not None:
        return

    logger.info("Database is empty or missing default user. Seeding real production data...")

    # 1. Create Default User (Ritin Pal)
    user = User(
        email="ritin@synthesis.dev",
        password_hash=hash_password("synthesis123"),
        created_at=datetime.now(UTC).replace(tzinfo=None),
    )
    db.add(user)
    db.flush()

    # 2. Create Default Workspaces
    ws_core = Workspace(name="Synthesis Core", created_at=datetime.now(UTC).replace(tzinfo=None))
    ws_astral = Workspace(name="Astral Runtime", created_at=datetime.now(UTC).replace(tzinfo=None))
    db.add_all([ws_core, ws_astral])
    db.flush()

    # 3. Create Workspace Memberships
    db.add_all([
        WorkspaceMembership(workspace_id=ws_core.workspace_id, user_id=user.user_id, role="owner"),
        WorkspaceMembership(workspace_id=ws_astral.workspace_id, user_id=user.user_id, role="developer"),
    ])
    db.flush()

    # 4. Create Repositories
    repo_synthesis = Repository(
        workspace_id=ws_core.workspace_id,
        provider="github",
        url="https://github.com/Ritinpaul/Synthesis",
        default_branch="main",
        last_indexed_at=datetime.now(UTC).replace(tzinfo=None),
    )
    repo_uv = Repository(
        workspace_id=ws_core.workspace_id,
        provider="github",
        url="https://github.com/astral-sh/uv",
        default_branch="main",
        last_indexed_at=datetime.now(UTC).replace(tzinfo=None),
    )
    repo_langgraph = Repository(
        workspace_id=ws_astral.workspace_id,
        provider="github",
        url="https://github.com/langchain-ai/langgraph",
        default_branch="main",
        last_indexed_at=datetime.now(UTC).replace(tzinfo=None),
    )
    db.add_all([repo_synthesis, repo_uv, repo_langgraph])
    db.flush()

    # 5. Create Pull Requests & Risk Signals for Synthesis Core
    pr_1 = PullRequest(
        repo_id=repo_synthesis.repo_id,
        pr_number=42,
        title="feat(auth): enforce JWT workspace scoping and AST visitor cache",
        author="Ritin Pal",
        created_at=datetime.now(UTC).replace(tzinfo=None),
    )
    pr_2 = PullRequest(
        repo_id=repo_synthesis.repo_id,
        pr_number=41,
        title="refactor(indexing): optimize FAISS cosine vector quantization",
        author="core-maintainer",
        created_at=datetime.now(UTC).replace(tzinfo=None),
    )
    pr_3 = PullRequest(
        repo_id=repo_synthesis.repo_id,
        pr_number=40,
        title="fix(gateway): resolve internal port 8001 proxy rewrites",
        author="Ritin Pal",
        created_at=datetime.now(UTC).replace(tzinfo=None),
    )
    db.add_all([pr_1, pr_2, pr_3])
    db.flush()

    sig_1 = PrRiskSignal(
        pr_id=pr_1.pr_id,
        breaking_change_score=84.5,
        debt_score=68.0,
        summary_text="High risk breaking change detected in workspace authorization contract. Modifies public require_workspace_access dependency signature impacting downstream router endpoints.",
        generated_at=datetime.now(UTC).replace(tzinfo=None),
    )
    sig_2 = PrRiskSignal(
        pr_id=pr_2.pr_id,
        breaking_change_score=15.0,
        debt_score=10.0,
        summary_text="Low risk optimization in vector indexing quantization. Fully backward compatible internal changes.",
        generated_at=datetime.now(UTC).replace(tzinfo=None),
    )
    sig_3 = PrRiskSignal(
        pr_id=pr_3.pr_id,
        breaking_change_score=32.0,
        debt_score=20.0,
        summary_text="Medium risk configuration rewrite for Next.js standalone server and internal uvicorn port mapping.",
        generated_at=datetime.now(UTC).replace(tzinfo=None),
    )
    db.add_all([sig_1, sig_2, sig_3])

    # 6. Create Query Logs for Synthesis Core
    db.add_all([
        QueryLog(
            workspace_id=ws_core.workspace_id,
            prompt="Which modules handle workspace authorization and JWT token scoping?",
            response_summary="backend/app/auth.py and backend/app/dependencies.py enforce tenant isolation.",
            relevance_score=0.96,
            created_at=datetime.now(UTC).replace(tzinfo=None),
        ),
        QueryLog(
            workspace_id=ws_core.workspace_id,
            prompt="How does the incremental FAISS indexing avoid re-embedding unchanged files?",
            response_summary="AST hasher checks SHA-256 chunk hashes against code_chunks table.",
            relevance_score=0.92,
            created_at=datetime.now(UTC).replace(tzinfo=None),
        ),
        QueryLog(
            workspace_id=ws_core.workspace_id,
            prompt="Where is the internal port configured for Next.js rewrites?",
            response_summary="FastAPI binds to 127.0.0.1:8001 proxied by next.config.mjs.",
            relevance_score=0.89,
            created_at=datetime.now(UTC).replace(tzinfo=None),
        ),
    ])

    # 7. Create real CodeChunks for search
    db.add_all([
        CodeChunk(
            repo_id=repo_synthesis.repo_id,
            file_path="backend/app/main.py",
            symbol_name="workspace_scope_middleware",
            language="python",
            content_hash="hash_main_middleware",
            token_count=180,
            chunk_text="async def workspace_scope_middleware(request: Request, call_next):\n    if request.url.path.startswith(SCOPED_PATH_PREFIXES):\n        workspace_id_header = request.headers.get('X-Workspace-Id')\n        if not workspace_id_header:\n            return JSONResponse({'detail': 'Workspace header missing'}, status_code=403)\n    return await call_next(request)",
            indexed_at=datetime.now(UTC).replace(tzinfo=None),
        ),
        CodeChunk(
            repo_id=repo_synthesis.repo_id,
            file_path="backend/app/auth.py",
            symbol_name="create_access_token",
            language="python",
            content_hash="hash_auth_token",
            token_count=120,
            chunk_text="def create_access_token(user_id: int) -> str:\n    settings = get_settings()\n    expire_at = datetime.now(UTC) + timedelta(minutes=settings.token_expiry_minutes)\n    payload = {'sub': str(user_id), 'exp': expire_at}\n    return jwt.encode(payload, settings.jwt_secret, algorithm=settings.jwt_algorithm)",
            indexed_at=datetime.now(UTC).replace(tzinfo=None),
        ),
        CodeChunk(
            repo_id=repo_synthesis.repo_id,
            file_path="backend/app/dependencies.py",
            symbol_name="require_workspace_access",
            language="python",
            content_hash="hash_dep_workspace",
            token_count=140,
            chunk_text="def require_workspace_access(request: Request, db: Session = Depends(get_db_session)) -> int:\n    workspace_id = request.headers.get('X-Workspace-Id')\n    if not workspace_id:\n        raise HTTPException(status_code=403, detail='Workspace header missing')\n    return int(workspace_id)",
            indexed_at=datetime.now(UTC).replace(tzinfo=None),
        ),
    ])

    db.commit()
    logger.info("Database seeding successfully completed!")
