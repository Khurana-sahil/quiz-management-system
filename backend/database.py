from sqlmodel import SQLModel, create_engine, Session
from backend import models  # absolute import so Render recognizes package


# Use sqlite file in project root
DATABASE_URL = "sqlite:///./quiz.db"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}
)


def init_db():
    """Create database tables."""
    SQLModel.metadata.create_all(engine)


def get_session():
    """Provide a database session for FastAPI dependency injection."""
    with Session(engine) as session:
        yield session
