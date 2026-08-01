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


def test_incremental_indexing_delta_tracking(client, tmp_path: Path) -> None:
    token = _register(client, "delta_user@example.com", "password123")
    workspace_id = _create_workspace(client, token, "Delta Workspace")

    repo_path = tmp_path / "delta_repo"
    repo_path.mkdir()

    f1 = repo_path / "module_a.py"
    f2 = repo_path / "module_b.py"

    f1.write_text("def fn_a():\n    return 1\n", encoding="utf-8")
    f2.write_text("def fn_b():\n    return 2\n", encoding="utf-8")

    # First indexing (Full)
    res1 = client.post(
        "/repos/index",
        json={
            "workspace_id": workspace_id,
            "repo_url": str(repo_path),
            "branch": "main",
            "incremental": True,
        },
        headers={"Authorization": f"Bearer {token}", "X-Workspace-Id": str(workspace_id)},
    )
    assert res1.status_code == 200
    d1 = res1.json()
    assert d1["indexed_chunks"] == 2
    assert d1["added_chunks"] == 2
    assert d1["reused_chunks"] == 0

    # Second indexing without changes (Incremental reuse)
    res2 = client.post(
        "/repos/index",
        json={
            "workspace_id": workspace_id,
            "repo_url": str(repo_path),
            "branch": "main",
            "incremental": True,
        },
        headers={"Authorization": f"Bearer {token}", "X-Workspace-Id": str(workspace_id)},
    )
    assert res2.status_code == 200
    d2 = res2.json()
    assert d2["indexed_chunks"] == 2
    assert d2["reused_chunks"] == 2
    assert d2["added_chunks"] == 0

    # Modify module_b.py and add module_c.py
    f2.write_text("def fn_b_modified():\n    return 200\n", encoding="utf-8")
    f3 = repo_path / "module_c.py"
    f3.write_text("def fn_c():\n    return 3\n", encoding="utf-8")

    res3 = client.post(
        "/repos/index",
        json={
            "workspace_id": workspace_id,
            "repo_url": str(repo_path),
            "branch": "main",
            "incremental": True,
        },
        headers={"Authorization": f"Bearer {token}", "X-Workspace-Id": str(workspace_id)},
    )
    assert res3.status_code == 200
    d3 = res3.json()
    assert d3["indexed_chunks"] == 3
    assert d3["reused_chunks"] == 1  # module_a reused
    assert d3["added_chunks"] == 2   # modified module_b + new module_c
    assert d3["deleted_chunks"] == 1  # old module_b removed
