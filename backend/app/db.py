from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.config import get_settings
from app.models import Base

settings = get_settings()

connect_args = {}
if "supabase.co" in settings.database_url or "sslmode=require" in settings.database_url:
    connect_args["sslmode"] = "require"

engine = create_engine(
    settings.database_url,
    connect_args=connect_args,
    pool_pre_ping=True,
    pool_recycle=300,
    future=True,
)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False, future=True)


def init_db() -> None:
    Base.metadata.create_all(bind=engine)
    # Seed default data on startup
    from app.services.seed import seed_database_if_empty
    db = SessionLocal()
    try:
        seed_database_if_empty(db)
    finally:
        db.close()


def get_db_session() -> Generator[Session, None, None]:
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()
