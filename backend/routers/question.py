from fastapi import APIRouter, Depends, HTTPException, Header
from sqlmodel import Session
from pydantic import BaseModel
from typing import Optional, List
import jwt

from ..database import get_session
from ..models import Question, Quiz
from ..auth_config import SECRET_KEY

router = APIRouter()


# ADMIN CHECK
def require_admin(x_token: str = Header(None)):
    if not x_token:
        raise HTTPException(401, "Missing admin token")

    try:
        data = jwt.decode(x_token, SECRET_KEY, algorithms=["HS256"])
        return data["email"]
    except:
        raise HTTPException(403, "Admin only")


class QuestionCreate(BaseModel):
    text: str
    type: str
    options: Optional[List[str]] = None
    correct_answer: Optional[str] = None


@router.post("/quiz/{quiz_id}/questions", dependencies=[Depends(require_admin)])
def add_question(quiz_id: int, payload: QuestionCreate, session: Session = Depends(get_session)):
    quiz = session.get(Quiz, quiz_id)
    if not quiz:
        raise HTTPException(404, "Quiz not found")

    if payload.type == "mcq":
        if not payload.options or len(payload.options) < 2:
            raise HTTPException(400, "MCQ needs at least 2 options")
        if payload.correct_answer not in payload.options:
            raise HTTPException(400, "Correct answer must be one of the options")

    if payload.type == "true_false":
        if payload.correct_answer not in ["true", "false", "True", "False"]:
            raise HTTPException(400, "Correct answer must be true/false")

    question = Question(
        quiz_id=quiz_id,
        question_text=payload.text,
        question_type=payload.type,
        options=payload.options,
        correct_answer=payload.correct_answer
    )

    session.add(question)
    session.commit()
    session.refresh(question)

    return {"message": "Question added", "id": question.id}
