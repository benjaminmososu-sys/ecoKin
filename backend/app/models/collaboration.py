from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.database import Base

class CollaborationProject(Base):
    __tablename__ = "collaboration_projects"

    project_id = Column(Integer, primary_key=True, index=True)
    title = Column(String(150), nullable=False)
    description = Column(Text, nullable=False)
    organization_name = Column(String(100), nullable=False)
    project_type = Column(String(50), nullable=False) # ex: 'clean_up', 'conference', 'funding'
    target_commune = Column(String(50), nullable=True)  # ex: 'Gombe', 'Bandalungwa'
    
    # Lien vers l'utilisateur (ONG, Autorité, etc.) qui a créé l'annonce
    author_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    
    created_at = Column(DateTime, server_default=func.now())
