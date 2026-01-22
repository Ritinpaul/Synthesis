from __future__ import annotations

import os
from collections.abc import Iterator
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

TEST_DB_PATH = Path(__file__).parent / "test_synthesis.db"
os.environ["SYNTHESIS_DATABASE_URL"] = f"sqlite:///{TEST_DB_PATH.as_posix()}"
os.environ["SYNTHESIS_JWT_SECRET"] = "test-secret-key-with-at-least-32-chars"
os.environ["SYNTHESIS_INDEX_DIR"] = str((Path(__file__).parent / "test_indexes").as_posix())

from app.config import get_settings
from app.db import engine
from app.main import create_app
from app.models import Base

get_settings.cache_clear()


@pytest.fixture(autouse=True)
def reset_database() -> Iterator[None]:
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield


@pytest.fixture
def client() -> Iterator[TestClient]:
    app = create_app()
    with TestClient(app) as test_client:
        yield test_client
