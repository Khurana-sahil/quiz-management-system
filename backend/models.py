from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship, JSON
from sqlalchemy import Column

class Quiz(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str

    questions: List["Question"] = Relationship(back_populates="quiz")


class Question(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    quiz_id: Optional[int] = Field(default=None, foreign_key="quiz.id")

    question_text: str
    question_type: str

    options: Optional[List[str]] = Field(default=None, sa_column=Column(JSON))
    correct_answer: Optional[str] = None

    quiz: Optional["Quiz"] = Relationship(back_populates="questions")