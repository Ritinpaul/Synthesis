import os
from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


def get_default_db_url() -> str:
    env_url = os.getenv("SYNTHESIS_DATABASE_URL") or os.getenv("DATABASE_URL")
    if env_url:
        # Standardize prefix for psycopg3
        if env_url.startswith("postgres://"):
            env_url = env_url.replace("postgres://", "postgresql+psycopg://", 1)
        elif env_url.startswith("postgresql://") and not env_url.startswith("postgresql+psycopg://"):
            env_url = env_url.replace("postgresql://", "postgresql+psycopg://", 1)
        return env_url
    raise RuntimeError(
        "No database URL configured. Set the SYNTHESIS_DATABASE_URL or DATABASE_URL environment variable."
    )


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        env_prefix="SYNTHESIS_",
    )

    app_name: str = "Synthesis API"
    environment: str = "development"
    database_url: str = get_default_db_url()
    jwt_secret: str  # Required — set via SYNTHESIS_JWT_SECRET env var
    jwt_algorithm: str = "HS256"
    token_expiry_minutes: int = 43200  # 30 days
    index_dir: str = "./data/indexes"
    max_file_size_bytes: int = 2_000_000
    chunk_lines: int = 80
    embedding_dimensions: int = 128


@lru_cache
def get_settings() -> Settings:
    return Settings()
