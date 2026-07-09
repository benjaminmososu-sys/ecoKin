from sqlalchemy import Column, Integer, String, Text
from geoalchemy2 import Geometry
from app.database import Base

class Incident(Base):
    __tablename__ = "incidents"

    incident_id = Column(Integer, primary_key=True, index=True)
    title = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    incident_type = Column(String(30), nullable=False)
    status = Column(String(20), default="reported")
    photo_url = Column(String(255), nullable=True)
    geom = Column(Geometry(geometry_type="POINT", srid=4326), nullable=False)
