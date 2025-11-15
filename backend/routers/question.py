from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from ..database import get_session
from ..models import Question, Quiz
from pydantic import BaseModel
from typing import Optional, List

router = APIRouter()

class QuestionCreate(BaseModel):
    question_text: str
    question_type: str
    options: Optional[List[str]] = None
    correct_answer: Optional[str] = None

@router.post("/quiz/{quiz_id}/questions")
def add_question(quiz_id: int, payload: QuestionCreate, session: Session = Depends(get_session)):
    quiz = session.get(Quiz, quiz_id)
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")

    question_type = payload.question_type.lower()

    # Validation rules
    if question_type == "mcq":
        if not payload.options or len(payload.options) < 2:
            raise HTTPException(status_code=400, detail="MCQ must contain at least two options.")
        if payload.correct_answer not in payload.options:
            raise HTTPException(status_code=400, detail="Correct answer must be one of the options.")

    if question_type == "true_false":
        if payload.correct_answer not in ["true", "false"]:
            raise HTTPException(status_code=400, detail="Correct answer must be 'true' or 'false'")

    question = Question(
        quiz_id=quiz_id,
        question_text=payload.question_text,
        question_type=payload.question_type,
        options=payload.options,
        correct_answer=payload.correct_answer,
    )

    session.add(question)
    session.commit()
    session.refresh(question)

    return {"message": "Question added", "id": question.id}
