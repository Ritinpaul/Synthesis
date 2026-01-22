from __future__ import annotations

from pathlib import Path


def _register(client, email: str, password: str) -> str:
    response = client.post("/auth/register", json={"email": email, "password": password})
    assert response.status_code == 200
    return response.json()["access_token"]


def _create_workspace(client, token: str, name: str) -> int:
    response = client.post(
        "/workspaces",
        json={"name": name},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    return response.json()["workspace_id"]


def test_phase2_index_and_architecture_query_flow(client, tmp_path: Path) -> None:
    token = _register(client, "dev@example.com", "password123")
    workspace_id = _create_workspace(client, token, "Core Platform")

    repo_path = tmp_path / "sample_repo"
    repo_path.mkdir()

    (repo_path / "architecture.py").write_text(
        "class Orchestrator:\n"
        "    def route(self, events):\n"
        "        return [event for event in events]\n\n"
        "def summarize(changes):\n"
        "    # TODO: improve scoring\n"
        "    return len(changes)\n",
        encoding="utf-8",
    )

    (repo_path / "README.md").write_text(
        "# Service\nThis service parses repositories and answers architecture questions.\n",
        encoding="utf-8",
    )

    index_response = client.post(
        "/repos/index",
        json={"workspace_id": workspace_id, "repo_url": str(repo_path), "branch": "main"},
        headers={"Authorization": f"Bearer {token}", "X-Workspace-Id": str(workspace_id)},
    )

    assert index_response.status_code == 200
    index_payload = index_response.json()
    assert index_payload["status"] == "completed"
    assert index_payload["indexed_chunks"] > 0

    query_response = client.post(
        "/query/architecture",
        json={"workspace_id": workspace_id, "question": "How is routing orchestrated?"},
        headers={"Authorization": f"Bearer {token}", "X-Workspace-Id": str(workspace_id)},
    )

    assert query_response.status_code == 200
    payload = query_response.json()
    assert "Architecture summary" in payload["answer"]
    assert payload["relevance_estimate"] > 0
    assert len(payload["citations"]) >= 1
    assert {trace["agent"] for trace in payload["trace"]} == {
        "parser",
        "impact_analyzer",
        "doc_generator",
    }


def test_ready_health_endpoint(client) -> None:
    response = client.get("/health/ready")
    assert response.status_code == 200
    payload = response.json()
    assert payload["db"] in {"ok", "down"}
    assert payload["status"] in {"ok", "degraded"}
