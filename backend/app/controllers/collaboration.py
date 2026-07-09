from sqlalchemy.orm import Session
from app.models.collaboration import CollaborationProject

class CollaborationController:

    @staticmethod
    def create_project(title: str, description: str, organization_name: str, project_type: str, target_commune: str, author_id: int, author_role: str, db: Session):
        # Règle métier : Restriction d'accès selon le rôle issu de l'authentification
        allowed_roles = ['ong', 'authority', 'admin', 'collector']
        if author_role not in allowed_roles:
            return {"error": "Seules les organisations et autorités peuvent publier des projets collaboratifs.", "status_code": 403}

        new_project = CollaborationProject(
            title=title,
            description=description,
            organization_name=organization_name,
            project_type=project_type,
            target_commune=target_commune,
            author_id=author_id
        )
        db.add(new_project)
        db.commit()
        db.refresh(new_project)
        
        return {"data": {"message": "Action collaborative publiée !", "project_id": new_project.project_id}, "status_code": 201}

    @staticmethod
    def get_all_projects(db: Session):
        return db.query(CollaborationProject).order_by(CollaborationProject.created_at.desc()).all()
