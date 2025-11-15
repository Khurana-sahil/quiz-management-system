from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List
from ..database import get_session
from ..models import Quiz, Question
from pydantic import BaseModel

router = APIRouter()

class QuizCreate(BaseModel):
    title: str

class QuizOut(BaseModel):
    id: int
    title: str

@router.post("/quiz", response_model=QuizOut)
def create_quiz(payload: QuizCreate, session: Session = Depends(get_session)):
    quiz = Quiz(title=payload.title)
    session.add(quiz)
    session.commit()
    session.refresh(quiz)
    return QuizOut(id=quiz.id, title=quiz.title)

@router.get("/quiz", response_model=List[QuizOut])
def list_quizzes(session: Session = Depends(get_session)):
    q = session.exec(select(Quiz)).all()
    return [QuizOut(id=quiz.id, title=quiz.title) for quiz in q]

@router.get("/quiz/{quiz_id}")
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
                "text": q.text,
                "type": q.type,
                "options": q.options,
                "correct_answer": q.correct_answer,
            }
            for q in questions
        ],
    }
