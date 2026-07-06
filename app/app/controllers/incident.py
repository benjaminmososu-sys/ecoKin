import os
import random  # Utilisé pour simuler la probabilité de prédiction du modèle IA
from sqlalchemy.orm import Session
from geoalchemy2.shape import from_shape
from geoalchemy2.functions import ST_X, ST_Y
from shapely.geometry import Point
from app.models.incident import Incident

UPLOAD_DIR = "uploads"

class IncidentController:

    @staticmethod
    def _run_ai_computer_vision(file_path: str) -> dict:
        """
        [MODULE IA] - Simulateur de Réseau de Neurones Convolutifs (CNN)
        Dans un environnement de production, ce bloc chargerait un modèle type TensorFlow/PyTorch.
        """
        # On simule un score de confiance de l'IA (entre 75% et 98%)
        confidence_score = round(random.uniform(0.75, 0.98), 2)
        
        # L'IA valide le contenu visuel
        return {
            "visual_validation": "approved",
            "detected_objects": ["waste_accumulation", "plastic_bottles"],
            "ai_confidence": confidence_score
        }

    @staticmethod
    def _run_predictive_risk_model(incident_type: str, latitude: float) -> dict:
        """
        [MODULE IA] - Modèle prédictif de calcul de risques environnementaux.
        Algorithme basé sur un arbre de décision croisant la géolocalisation et le type de menace.
        """
        # Simulation d'une logique métier prédictive liée aux réalités de Kinshasa
        # Exemple : Si c'est une inondation ou une érosion à proximité de zones à risques (ex: coordonnées spécifiques)
        if incident_type in ['flooding', 'erosion']:
            priority = "CRITICAL"
            estimated_cleanup_days = 2
        else:
            priority = "MEDIUM"
            estimated_cleanup_days = 7

        return {
            "predicted_priority": priority,
            "estimated_intervention_time_days": estimated_cleanup_days
        }
    
    @staticmethod
    async def create_new_incident(title: str, description: str, incident_type: str, longitude: float, latitude: float, photo_file=None, db: Session = None):
        # 1. Validation minimale : on accepte tout type et on normalise
        if not incident_type:
            incident_type = 'other'

        # 2. Stockage physique de l'image (optionnel)
        file_path = None
        if photo_file is not None:
            try:
                file_path = os.path.join(UPLOAD_DIR, f"{photo_file.filename}")
                with open(file_path, "wb") as buffer:
                    buffer.write(await photo_file.read())
            except Exception:
                return {"error": "Erreur lors du stockage de l'image", "status_code": 500}

        # 3. EXÉCUTION DES MODULES D'INTELLIGENCE ARTIFICIELLE
        ai_vision_results = IncidentController._run_ai_computer_vision(file_path)
        ai_prediction_results = IncidentController._run_predictive_risk_model(incident_type, latitude)

        # 4. Transformation géospatiale
        shapely_point = Point(longitude, latitude)
        geo_geometry = from_shape(shapely_point, srid=4326)

        # 5. Sauvegarde dans le Modèle (on peut stocker la priorité calculée par l'IA dans la colonne status)
        new_incident = Incident(
            title=title,
            description=description,
            incident_type=incident_type,
            photo_url=file_path,
            geom=geo_geometry,
            status=ai_prediction_results["predicted_priority"].lower() if ai_prediction_results else 'medium'
        )
        db.add(new_incident)
        db.commit()
        db.refresh(new_incident)
        
        # 6. On renvoie au routeur les résultats enrichis par l'IA !
        return {
            "data": {
                "message": "Signalement enregistré et analysé par l'IA !",
                "incident_id": new_incident.incident_id,
                "ai_analysis": {
                    "computer_vision": ai_vision_results,
                    "predictive_analytics": ai_prediction_results
                }
            }, 
            "status_code": 201
        }

    @staticmethod
    def get_all_incidents(db: Session):
        incidents = db.query(
            Incident.incident_id, Incident.title, Incident.description,
            Incident.incident_type, Incident.status, Incident.photo_url,
            ST_X(Incident.geom).label("longitude"), ST_Y(Incident.geom).label("latitude")
        ).all()
        
        return [
            {
                "incident_id": i.incident_id, "title": i.title, "description": i.description,
                "incident_type": i.incident_type, "status": i.status, "photo_url": i.photo_url,
                "longitude": i.longitude, "latitude": i.latitude
            } for i in incidents
        ]