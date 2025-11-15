from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import init_db
from .routers import quiz, question, auth
from . import models

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
