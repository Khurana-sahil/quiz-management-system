from fastapi import APIRouter, Depends, HTTPException, Header
from sqlmodel import Session, select
from typing import List
from pydantic import BaseModel
from database import get_session
from models import Quiz, Question
import jwt
from ..auth_config import SECRET_KEY

router = APIRouter()


# -----------------------------
# ADMIN AUTH VALIDATION
# -----------------------------
def require_admin(x_token: str = Header(None)):
    if not x_token:
        raise HTTPException(status_code=401, detail="Missing admin token")

    try:
        data = jwt.decode(x_token, SECRET_KEY, algorithms=["HS256"])
        return data["email"]
    except:
        raise HTTPException(status_code=403, detail="Admin only")


# -----------------------------
# SCHEMAS
# -----------------------------
class QuizCreate(BaseModel):
    title: str


class QuizOut(BaseModel):
    id: int
    title: str


# -----------------------------
# ADMIN: Create Quiz
# -----------------------------
@router.post("/quiz", response_model=QuizOut, dependencies=[Depends(require_admin)])
def create_quiz(payload: QuizCreate, session: Session = Depends(get_session)):
    quiz = Quiz(title=payload.title)
    session.add(quiz)
    session.commit()
    session.refresh(quiz)
    return QuizOut(id=quiz.id, title=quiz.title)


# -----------------------------
# PUBLIC: List Quizzes
# -----------------------------
@router.get("/quiz", response_model=List[QuizOut])
def list_quizzes(session: Session = Depends(get_session)):
    q = session.exec(select(Quiz)).all()
    return [QuizOut(id=quiz.id, title=quiz.title) for quiz in q]


# -----------------------------
# ADMIN: Full Quiz Details (Dashboard)
# -----------------------------
@router.get("/quiz/{quiz_id}", dependencies=[Depends(require_admin)])
def get_quiz_admin(quiz_id: int, session: Session = Depends(get_session)):
    quiz = session.get(Quiz, quiz_id)
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")

    questions = session.exec(select(Question).where(Question.quiz_id == quiz.id)).all()

    return {
        "id": quiz.id,
        "title": quiz.title,
        "questions": [
            {
                "id": q.id,
                "text": q.question_text,
                "type": q.question_type,
                "options": q.options,
                "correct_answer": q.correct_answer,
            }
            for q in questions
        ],
    }


# -----------------------------
# PUBLIC: Safe Quiz (for taking)
# -----------------------------
@router.get("/quiz/{quiz_id}/public")
def get_quiz_public(quiz_id: int, session: Session = Depends(get_session)):
    quiz = session.get(Quiz, quiz_id)
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")

    questions = session.exec(select(Question).where(Question.quiz_id == quiz.id)).all()

    return {
        "id": quiz.id,
        "title": quiz.title,
        "questions": [
            {
                "id": q.id,
                "text": q.question_text,
                "type": q.question_type,
                "options": q.options,
                "correct_answer": q.correct_answer,
            }
            for q in questions
        ],
    }
