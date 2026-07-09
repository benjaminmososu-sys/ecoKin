from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from app.database import get_db
from app.controllers.collaboration import CollaborationController

router = APIRouter(prefix="/api/collaboration", tags=["Collaboration"])

@router.post("/projects")
def create_project(data: dict, response: Response, db: Session = Depends(get_db)):
    result = CollaborationController.create_project(
        title=data.get("title"),
        description=data.get("description"),
        organization_name=data.get("organization_name"),
        project_type=data.get("project_type"),
        target_commune=data.get("target_commune"),
        author_id=data.get("author_id"),
        author_role=data.get("author_role"),
        db=db
    )
    if "error" in result:
        raise HTTPException(status_code=result["status_code"], detail=result["error"])
    response.status_code = result["status_code"]
    return result["data"]

@router.get("/projects")
def list_projects(db: Session = Depends(get_db)):
    return CollaborationController.get_all_projects(db)
