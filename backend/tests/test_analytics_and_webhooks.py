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


def test_workspace_analytics_endpoint(client, tmp_path: Path) -> None:
    token = _register(client, "analytics_user@example.com", "password123")
    workspace_id = _create_workspace(client, token, "Analytics Workspace")

    repo_path = tmp_path / "analytics_repo"
    repo_path.mkdir()
    (repo_path / "core.py").write_text("def core_function():\n    return 'ok'\n", encoding="utf-8")

    client.post(
        "/repos/index",
        json={"workspace_id": workspace_id, "repo_url": str(repo_path), "branch": "main"},
        headers={"Authorization": f"Bearer {token}", "X-Workspace-Id": str(workspace_id)},
    )

    # Perform a few architecture queries to populate query logs
    client.post(
        "/query/architecture",
        json={"workspace_id": workspace_id, "question": "Where is the core_function defined?"},
        headers={"Authorization": f"Bearer {token}", "X-Workspace-Id": str(workspace_id)},
    )

    analytics_res = client.get(
        f"/workspaces/{workspace_id}/analytics",
        headers={"Authorization": f"Bearer {token}", "X-Workspace-Id": str(workspace_id)},
    )

    assert analytics_res.status_code == 200
    data = analytics_res.json()
    assert data["workspace_id"] == workspace_id
    assert data["total_queries"] >= 1
    assert data["avg_relevance_score"] > 0
    assert len(data["top_search_keywords"]) >= 1


def test_github_webhook_endpoint(client) -> None:
    webhook_payload = {
        "action": "opened",
        "number": 101,
        "pull_request": {
            "title": "feat: add user authentication layer",
            "user": {"login": "dev_bot"},
        },
        "repository": {
            "clone_url": "https://github.com/org/repo.git",
        },
    }

    res = client.post(
        "/webhooks/github",
        json=webhook_payload,
        headers={"X-GitHub-Event": "pull_request"},
    )

    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "processed"
    assert data["event"] == "pull_request"
    assert data["pr_number"] == 101
    assert data["analysis"]["breaking_change_score"] >= 0
