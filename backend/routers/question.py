from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import Optional, List
from ..database import get_session
from ..models import Quiz, Question
from pydantic import BaseModel
import json

router = APIRouter()

class QuestionCreate(BaseModel):
    text: str
    type: str
    options: Optional[List[str]] = None
    correct_answer: Optional[str] = None

@router.post("/quiz/{quiz_id}/questions")
def add_question(quiz_id: int, payload: QuestionCreate, session: Session = Depends(get_session)):
    quiz = session.get(Quiz, quiz_id)
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    options_serialized = json.dumps(payload.options) if payload.options else None
    q = Question(
        quiz_id=quiz_id,
        text=payload.text,
        type=payload.type,
        options=options_serialized,
        correct_answer=payload.correct_answer
    )
    session.add(q)
    session.commit()
    session.refresh(q)
    return {"id": q.id}

class AnswerItem(BaseModel):
    question_id: int
    answer: Optional[str] = None

class SubmitPayload(BaseModel):
    answers: List[AnswerItem]

@router.get("/public/quiz/{quiz_id}")
def get_quiz_public(quiz_id: int, session: Session = Depends(get_session)):
    quiz = session.get(Quiz, quiz_id)
    if not quiz: raise HTTPException(status_code=404, detail="Quiz not found")
    questions = session.exec(select(Question).where(Question.quiz_id == quiz.id)).all()
    out = []
    for q in questions:
        out.append({
            "id": q.id,
            "text": q.text,
            "type": q.type,
            "options": json.loads(q.options) if q.options else None
        })
    return {"id": quiz.id, "title": quiz.title, "questions": out}

@router.post("/public/quiz/{quiz_id}/submit")
def submit_quiz(quiz_id: int, payload: SubmitPayload, session: Session = Depends(get_session)):
    quiz = session.get(Quiz, quiz_id)
    if not quiz: raise HTTPException(status_code=404, detail="Quiz not found")
    questions = session.exec(select(Question).where(Question.quiz_id == quiz.id)).all()
    qmap = {q.id: q for q in questions}
    total = len(questions)
    correct = 0
    details = []
    for ans in payload.answers:
        q = qmap.get(ans.question_id)
        user_ans = (ans.answer or "").strip().lower()
        is_correct = q and q.correct_answer and (q.correct_answer.lower() == user_ans)
        if is_correct: correct += 1
        details.append({
            "question_id": ans.question_id,
            "your_answer": user_ans,
            "correct_answer": q.correct_answer if q else None,
            "correct": is_correct
        })
    return {"score": {"total": total, "correct": correct, "percentage": correct/total*100}, "details": details}
