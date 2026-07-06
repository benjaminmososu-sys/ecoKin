from fastapi import APIRouter, Depends, HTTPException, Response, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.database import get_db
from app.controllers.waste import WasteController
from datetime import date

router = APIRouter(prefix="/api/waste", tags=["Gestion des Déchets"])

class CoordinateSchema(BaseModel):
    lng: float
    lat: float

class RouteCreateSchema(BaseModel):
    route_name: str
    collector_id: int | None = None
    scheduled_date: date
    # Une liste de points géographiques
    path: list[list[float]]

class WastePointSchema(BaseModel):
    name: str
    capacity_kg: int
    longitude: float
    latitude: float

@router.post("/points")
def add_point(data: WastePointSchema, response: Response, db: Session = Depends(get_db)):
    result = WasteController.create_waste_point(data.name, data.capacity_kg, data.longitude, data.latitude, db)
    response.status_code = result["status_code"]
    return result["data"]

@router.get("/points/nearby")
def get_nearby(longitude: float, latitude: float, limit: int = 5, db: Session = Depends(get_db)):
    return WasteController.get_nearby_points(longitude, latitude, limit, db)

@router.post("/routes")
def plan_route(data: RouteCreateSchema, response: Response, db: Session = Depends(get_db)):
    result = WasteController.create_collection_route(
        route_name=data.route_name,
        collector_id=data.collector_id,
        scheduled_date=data.scheduled_date,
        coordinates=data.path,
        db=db
    )
    if "error" in result:
        raise HTTPException(status_code=result["status_code"], detail=result["error"])
        
    response.status_code = result["status_code"]
    return result["data"]