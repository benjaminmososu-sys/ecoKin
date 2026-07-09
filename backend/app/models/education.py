from sqlalchemy import Column, Integer, String, Text, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from app.database import Base

class Course(Base):
    __tablename__ = "courses"

    course_id = Column(Integer, primary_key=True, index=True)
    title = Column(String(150), nullable=False)
    content = Column(Text, nullable=False)
    category = Column(String(50), nullable=False) # ex: 'dechets', 'eau', 'assainissement'

class QuizQuestion(Base):
    __tablename__ = "quiz_questions"

    question_id = Column(Integer, primary_key=True, index=True)
    question_text = Column(Text, nullable=False)
    
    # Relaion avec les options (choix multiples)
    options = relationship("QuizOption", back_populates="question", cascade="all, delete-orphan")

class QuizOption(Base):
    __tablename__ = "quiz_options"

    option_id = Column(Integer, primary_key=True, index=True)
    question_id = Column(Integer, ForeignKey("quiz_questions.question_id", ondelete="CASCADE"), nullable=False)
    option_text = Column(String(255), nullable=False)
    is_correct = Column(Boolean, default=False, nullable=False)

    question = relationship("QuizQuestion", back_populates="options")
