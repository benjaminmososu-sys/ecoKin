from sqlalchemy.orm import Session
from geoalchemy2.functions import ST_X, ST_Y, ST_Distance
from geoalchemy2.shape import from_shape
from shapely.geometry import Point
from app.models.waste import WastePoint
from app.models.waste import CollectionRoute
from datetime import date
from shapely.geometry import LineString

class WasteController:

    @staticmethod
    def create_waste_point(name: str, capacity_kg: int, longitude: float, latitude: float, db: Session):
        shapely_point = Point(longitude, latitude)
        geo_geometry = from_shape(shapely_point, srid=4326)

        new_point = WastePoint(name=name, capacity_kg=capacity_kg, geom=geo_geometry)
        db.add(new_point)
        db.commit()
        db.refresh(new_point)
        
        return {"data": {"message": "Point de dépôt enregistré !", "point_id": new_point.point_id}, "status_code": 201}

    @staticmethod
    def get_nearby_points(longitude: float, latitude: float, limit: int, db: Session):
        """Algorithme spatial : Trouve les points de dépôt les plus proches d'un utilisateur."""
        user_point = from_shape(Point(longitude, latitude), srid=4326)
        
        # On trie directement les points par distance par rapport à l'utilisateur (<-> en PostGIS)
        # ST_Distance calcule la distance géométrique entre deux points
        query_results = db.query(
            WastePoint.point_id,
            WastePoint.name,
            WastePoint.status,
            ST_X(WastePoint.geom).label("longitude"),
            ST_Y(WastePoint.geom).label("latitude"),
            ST_Distance(WastePoint.geom, user_point).label("distance")
        ).order_by(WastePoint.geom.distance_box(user_point)).limit(limit).all()

        return [
            {
                "point_id": p.point_id,
                "name": p.name,
                "status": p.status,
                "longitude": p.longitude,
                "latitude": p.latitude,
                "distance_deg": p.distance # Distance brute en degrés (convertible en mètres si besoin)
            } for p in query_results
        ]
    @staticmethod
    def create_collection_route(route_name: str, collector_id: int, scheduled_date: date, coordinates: list[list[float]], db: Session):
        """
        Crée un itinéraire de collecte.
        coordinates doit être une liste de points : [[long1, lat1], [long2, lat2], ...]
        """
        # 1. Validation métier : Il faut au moins 2 points pour faire une ligne/un trajet
        if len(coordinates) < 2:
            return {"error": "Une tournée doit comporter au moins 2 coordonnées (départ et arrivée).", "status_code": 400}

        # 2. Transformation de la liste en LineString Shapely
        try:
            points_list = [Point(coords[0], coords[1]) for coords in coordinates]
            shapely_line = LineString(points_list)
            geo_geometry = from_shape(shapely_line, srid=4326)
        except Exception:
            return {"error": "Format des coordonnées invalide.", "status_code": 400}

        # 3. Persistance dans le Modèle
        new_route = CollectionRoute(
            route_name=route_name,
            collector_id=collector_id,
            scheduled_date=scheduled_date,
            geom=geo_geometry
        )
        
        db.add(new_route)
        db.commit()
        db.refresh(new_route)

        return {
            "data": {
                "message": "Tournée de collecte planifiée avec succès !",
                "route_id": new_route.route_id,
                "status": new_route.status
            },
            "status_code": 201
        }
