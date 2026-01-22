from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        env_prefix="SYNTHESIS_",
    )

    app_name: str = "Synthesis API"
    environment: str = "development"
    database_url: str = "sqlite:///./synthesis.db"
    jwt_secret: str = "change-me-in-production-with-at-least-32-characters"
    jwt_algorithm: str = "HS256"
    token_expiry_minutes: int = 120
    index_dir: str = "./data/indexes"
    max_file_size_bytes: int = 2_000_000
    chunk_lines: int = 80
    embedding_dimensions: int = 128


@lru_cache
def get_settings() -> Settings:
    return Settings()
