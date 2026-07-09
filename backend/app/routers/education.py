from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from app.database import get_db
from app.controllers.education import EducationController

router = APIRouter(prefix="/api/education", tags=["Education"])

@router.get("/courses")
def list_courses(db: Session = Depends(get_db)):
    return EducationController.get_all_courses(db)

@router.get("/quiz")
def get_quiz(db: Session = Depends(get_db)):
    return EducationController.get_quiz(db)

@router.post("/quiz/submit")
def submit_quiz(answers: list[dict], response: Response, db: Session = Depends(get_db)):
    result = EducationController.submit_quiz_answers(answers, db)
    if "error" in result:
        raise HTTPException(status_code=result["status_code"], detail=result["error"])
    response.status_code = result["status_code"]
    return result["data"]
