from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

try:  # Support running as package (backend.*) and top-level for local dev
    from .database import init_db
    from .routers import quiz, question, auth
    from . import models  # noqa: F401
except ImportError:  # pragma: no cover
    from database import init_db  # type: ignore
    from routers import quiz, question, auth  # type: ignore
    import models  # type: ignore  # noqa: F401

app = FastAPI(title="Quiz Management System")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api")
app.include_router(quiz.router, prefix="/api")
app.include_router(question.router, prefix="/api")

@app.on_event("startup")
def startup():
    init_db()

@app.get("/")
def root():
    return {"message": "Quiz API running"}
