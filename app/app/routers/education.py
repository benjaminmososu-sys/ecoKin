from fastapi import APIRouter, Depends, HTTPException, Response
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.database import get_db
from app.controllers.education import EducationController

router = APIRouter(prefix="/api/education", tags=["Éducation Environnementale"])

class CourseCreateSchema(BaseModel):
    title: str
    content: str
    category: str

class UserAnswerSchema(BaseModel):
    question_id: int
    selected_option_id: int

@router.post("/courses")
def add_course(data: CourseCreateSchema, response: Response, db: Session = Depends(get_db)):
    result = EducationController.create_course(data.title, data.content, data.category, db)
    response.status_code = result["status_code"]
    return result["data"]

@router.get("/courses")
def list_courses(db: Session = Depends(get_db)):
    return EducationController.get_all_courses(db)

@router.get("/quiz")
def start_quiz(db: Session = Depends(get_db)):
    return EducationController.get_quiz(db)

@router.post("/quiz/submit")
def check_quiz(answers: list[UserAnswerSchema], response: Response, db: Session = Depends(get_db)):
    # Transformation du schéma pydantic en liste de dictionnaires pour le contrôleur
    answers_dict = [a.model_dump() for a in answers]
    result = EducationController.submit_quiz_answers(answers_dict, db)
    
    if "error" in result:
        raise HTTPException(status_code=result["status_code"], detail=result["error"])
        
    response.status_code = result["status_code"]
    return result["data"]