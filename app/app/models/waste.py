from sqlalchemy import Column, Integer, String, Date, ForeignKey
from geoalchemy2 import Geometry
from app.database import Base

class WastePoint(Base):
    __tablename__ = "waste_points"

    point_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    capacity_kg = Column(Integer, nullable=True)
    status = Column(String(20), default="operational") # operational, full, damaged
    geom = Column(Geometry(geometry_type="POINT", srid=4326), nullable=False)


class CollectionRoute(Base):
    __tablename__ = "collection_routes"

    route_id = Column(Integer, primary_key=True, index=True)
    collector_id = Column(Integer, ForeignKey("users.user_id", ondelete="SET NULL"), nullable=True)
    route_name = Column(String(100), nullable=False)
    scheduled_date = Column(Date, nullable=False)
    status = Column(String(20), default="planned") # planned, in_transit, completed
    
    # LineString permet de stocker une suite de coordonnées GPS (le tracé de la route)
    geom = Column(Geometry(geometry_type="LINESTRING", srid=4326), nullable=True)