from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import init_db
from . import models   # ensure models are registered
from .routers.quiz import router as quiz_router
from .routers.question import router as question_router

app = FastAPI(title="Quiz Management System")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # allow frontend
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(quiz_router, prefix="/api")
app.include_router(question_router, prefix="/api")

# Startup — init DB
@app.on_event("startup")
def on_startup():
    init_db()

@app.get("/")
def root():
    return {"message": "Quiz API running"}
