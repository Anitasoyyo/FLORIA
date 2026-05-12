import os

# Must be set before any app import — database.py reads this at module load time
os.environ["DATABASE_URL"] = "sqlite:///:memory:"

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
import pytest
from fastapi.testclient import TestClient

# Patch the database module before main.py imports it
import app.db.database as _db

_engine = create_engine(
    "sqlite:///:memory:",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,  # All connections share the same in-memory DB
)
_Session = sessionmaker(autocommit=False, autoflush=False, bind=_engine)

_db.engine = _engine
_db.SessionLocal = _Session

# Create tables before main.py runs Base.metadata.create_all
from app.db.database import Base
Base.metadata.create_all(bind=_engine)

# Now import app — main.py will bind to our patched engine and seed the DB
from app.main import app
from app.db.database import get_db


def _override_get_db():
    db = _Session()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = _override_get_db


@pytest.fixture(scope="session")
def client():
    with TestClient(app) as c:
        yield c
