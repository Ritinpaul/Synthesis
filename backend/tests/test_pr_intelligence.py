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


def test_pr_analysis_and_retrieval_flow(client, tmp_path: Path) -> None:
    token = _register(client, "pr_tester@example.com", "password123")
    workspace_id = _create_workspace(client, token, "PR Workspace")

    repo_path = tmp_path / "pr_repo"
    repo_path.mkdir()
    (repo_path / "payment.py").write_text(
        "def process_payment(amount, token):\n"
        "    # TODO: add retry logic\n"
        "    return True\n",
        encoding="utf-8",
    )

    # Index repository first
    index_res = client.post(
        "/repos/index",
        json={"workspace_id": workspace_id, "repo_url": str(repo_path), "branch": "main"},
        headers={"Authorization": f"Bearer {token}", "X-Workspace-Id": str(workspace_id)},
    )
    assert index_res.status_code == 200
    repo_id = index_res.json()["repo_id"]

    # Test /pr/analyze endpoint
    pr_res = client.post(
        "/pr/analyze",
        json={
            "workspace_id": workspace_id,
            "repo_id": repo_id,
            "pr_number": 42,
            "title": "Refactor! Breaking API changes in payment gateway",
            "author": "octocat",
            "diff_text": (
                "--- a/payment.py\n"
                "+++ b/payment.py\n"
                "@@ -1,3 +1,4 @@\n"
                "-def process_payment(amount, token):\n"
                "+def process_payment_v2(amount, token, currency='USD'):\n"
                "+    # FIXME: quick workaround for legacy callers\n"
            ),
        },
        headers={"Authorization": f"Bearer {token}", "X-Workspace-Id": str(workspace_id)},
    )

    assert pr_res.status_code == 200
    pr_data = pr_res.json()
    assert pr_data["pr_number"] == 42
    assert pr_data["breaking_change_score"] >= 50.0
    assert pr_data["debt_score"] > 0
    assert pr_data["risk_level"] in {"medium", "high", "critical"}
    assert len(pr_data["debt_markers"]) >= 1

    pr_id = pr_data["pr_id"]

    # Test GET /pr/{pr_id} endpoint
    get_res = client.get(
        f"/pr/{pr_id}",
        headers={"Authorization": f"Bearer {token}", "X-Workspace-Id": str(workspace_id)},
    )
    assert get_res.status_code == 200
    detail_data = get_res.json()
    assert detail_data["pr_id"] == pr_id
    assert detail_data["latest_signal"]["breaking_change_score"] == pr_data["breaking_change_score"]
