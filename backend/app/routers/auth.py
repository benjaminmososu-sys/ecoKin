from fastapi import APIRouter, Depends, HTTPException, Response, status
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from app.database import get_db
from app.controllers.auth import AuthController

router = APIRouter(prefix="/api/auth", tags=["Authentification"])

# Schémas de validation Pydantic pour les requêtes JSON d'authentification
class UserRegisterSchema(BaseModel):
    username: str
    email: EmailStr
    password: str
    role: str

class UserLoginSchema(BaseModel):
    email: EmailStr
    password: str

@router.post("/register")
def register(user_data: UserRegisterSchema, response: Response, db: Session = Depends(get_db)):
    result = AuthController.register_user(
        username=user_data.username,
        email=user_data.email,
        password=user_data.password,
        role=user_data.role,
        db=db
    )
    if "error" in result:
        raise HTTPException(status_code=result["status_code"], detail=result["error"])
    
    response.status_code = result["status_code"]
    return result["data"]

@router.post("/login")
def login(credentials: UserLoginSchema, response: Response, db: Session = Depends(get_db)):
    result = AuthController.login_user(email=credentials.email, password=credentials.password, db=db)
    if "error" in result:
        raise HTTPException(status_code=result["status_code"], detail=result["error"])
    
    response.status_code = result["status_code"]
    return result["data"]
