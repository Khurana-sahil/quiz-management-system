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
    # Be explicit to avoid edge cases with some hosts/proxies dropping wildcard CORS on redirects/errors
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://localhost:5173",
        "https://127.0.0.1:5173",
    ],
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=False,
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
