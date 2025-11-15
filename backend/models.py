from typing import List, Optional
from sqlmodel import SQLModel, Field, Relationship

class Question(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    quiz_id: int = Field(foreign_key="quiz.id")
    text: str
    type: str
    options: Optional[str] = None
    correct_answer: Optional[str] = None

class Quiz(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    questions: List[Question] = Relationship(back_populates="quiz")

Quiz.update_forward_refs()
