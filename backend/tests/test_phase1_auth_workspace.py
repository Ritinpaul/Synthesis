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


def test_workspace_isolation_enforced(client, tmp_path: Path) -> None:
    user1_token = _register(client, "owner@example.com", "password123")
    user2_token = _register(client, "guest@example.com", "password123")

    workspace_id = _create_workspace(client, user1_token, "Workspace A")

    repo_path = tmp_path / "repo"
    repo_path.mkdir()
    (repo_path / "service.py").write_text("def run():\n    return 'ok'\n", encoding="utf-8")

    owner_response = client.post(
        "/repos/index",
        json={"workspace_id": workspace_id, "repo_url": str(repo_path), "branch": "main"},
        headers={
            "Authorization": f"Bearer {user1_token}",
            "X-Workspace-Id": str(workspace_id),
        },
    )
    assert owner_response.status_code == 200

    denied_response = client.post(
        "/repos/index",
        json={"workspace_id": workspace_id, "repo_url": str(repo_path), "branch": "main"},
        headers={
            "Authorization": f"Bearer {user2_token}",
            "X-Workspace-Id": str(workspace_id),
        },
    )
    assert denied_response.status_code == 403
    assert denied_response.json()["detail"] == "Workspace access denied"
