from fastapi import APIRouter, Depends, HTTPException, Response
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.database import get_db
from app.controllers.collaboration import CollaborationController

router = APIRouter(prefix="/api/collaboration", tags=["Portail Collaboratif"])

class ProjectCreateSchema(BaseModel):
    title: str
    description: str
    organization_name: str
    project_type: str
    target_commune: str
    author_id: int
    author_role: str # Simule le rôle de l'utilisateur connecté pour le test

@router.post("/projects")
def add_project(data: ProjectCreateSchema, response: Response, db: Session = Depends(get_db)):
    result = CollaborationController.create_project(
        title=data.title,
        description=data.description,
        organization_name=data.organization_name,
        project_type=data.project_type,
        target_commune=data.target_commune,
        author_id=data.author_id,
        author_role=data.author_role,
        db=db
    )
    if "error" in result:
        raise HTTPException(status_code=result["status_code"], detail=result["error"])
        
    response.status_code = result["status_code"]
    return result["data"]

@router.get("/projects")
def list_projects(db: Session = Depends(get_db)):
    return CollaborationController.get_all_projects(db)