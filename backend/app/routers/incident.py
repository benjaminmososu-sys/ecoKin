from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.controllers.incident import IncidentController

router = APIRouter(prefix="/api/incidents", tags=["Incidents"])

@router.post("/")
async def create_incident(
    response: Response,
    title: str = Form(...),
    description: str = Form(None),
    incident_type: str = Form(...),
    longitude: float = Form(...),
    latitude: float = Form(...),
    photo: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    # Le router passe le bébé au contrôleur
    result = await IncidentController.create_new_incident(
        title, description, incident_type, longitude, latitude, photo, db
    )
    
    # Si le contrôleur a détecté une erreur métier, le router lève l'exception HTTP
    if "error" in result:
        raise HTTPException(status_code=result["status_code"], detail=result["error"])
        
    response.status_code = result["status_code"]
    return result["data"]


from pydantic import BaseModel


class IncidentCreateSchema(BaseModel):
    title: str
    description: str | None = None
    incident_type: str
    longitude: float
    latitude: float


@router.post("/json")
async def create_incident_json(payload: IncidentCreateSchema, response: Response, db: Session = Depends(get_db)):
    result = await IncidentController.create_new_incident(
        payload.title,
        payload.description,
        payload.incident_type,
        payload.longitude,
        payload.latitude,
        None,
        db,
    )

    if "error" in result:
        raise HTTPException(status_code=result["status_code"], detail=result["error"])

    response.status_code = result["status_code"]
    return result["data"]


@router.get("/")
def read_incidents(db: Session = Depends(get_db)):
    # Le router demande les données au contrôleur et les renvoie directement
    return IncidentController.get_all_incidents(db)
