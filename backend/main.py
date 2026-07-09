# Dans main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
import app.models.user as user_model
import app.models.incident as incident_model
import app.models.waste as waste_model
from app.routers import incident, auth, waste, education, collaboration  # <-- On importe le nouveau routeur

# Crée toutes les tables (users et incidents)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Eco-Kinshasa API")

# Allow CORS for local development (frontend dev server and previews)
origins = [
	"http://localhost:3000",
	"http://127.0.0.1:3000",
	"http://localhost:5173",
	"http://127.0.0.1:5173",
	"http://localhost",
	"http://127.0.0.1",
	"*",
]

app.add_middleware(
	CORSMiddleware,
	allow_origins=origins,
	allow_credentials=True,
	allow_methods=["*"],
	allow_headers=["*"],
)

# Inclusion des routeurs séparés
app.include_router(incident.router)
app.include_router(auth.router)  # <-- On inclut le routeur d'authentification
app.include_router(waste.router)
app.include_router(education.router)
app.include_router(collaboration.router)
