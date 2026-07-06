from sqlalchemy.orm import Session
from app.models.user import User
# Note : En pratique, on utiliserait pwd_context.hash() d'une lib de sécurité
# Ici on schématise la logique pure du contrôleur
import hashlib 

class AuthController:

    @staticmethod
    def _hash_password(password: str) -> str:
        """Méthode interne pour simuler le hashage du mot de passe."""
        return hashlib.sha256(password.encode()).hexdigest()

    @staticmethod
    def register_user(username: str, email: str, password: str, role: str, db: Session):
        # 1. Normalisation des rôles et validation des rôles autorisés
        role_mapping = {
            'citoyen': 'citizen',
            'citizen': 'citizen',
            'collecteur': 'collector',
            'collector': 'collector',
            'ong': 'ong',
            'authority': 'authority',
            'admin': 'admin'
        }
        normalized_role = role_mapping.get(role.lower())
        if normalized_role is None:
            return {"error": "Rôle utilisateur non valide", "status_code": 400}

        # 2. Vérification si l'utilisateur existe déjà
        existing_user = db.query(User).filter((User.email == email) | (User.username == username)).first()
        if existing_user:
            return {"error": "L'utilisateur ou l'email existe déjà", "status_code": 400}

        # 3. Création et hashage
        hashed_password = AuthController._hash_password(password)
        new_user = User(
            username=username,
            email=email,
            password_hash=hashed_password,
            role=normalized_role
        )
        
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        return {
            "data": {"message": "Utilisateur créé avec succès", "user_id": new_user.user_id, "role": new_user.role},
            "status_code": 201
        }

    @staticmethod
    def login_user(email: str, password: str, db: Session):
        user = db.query(User).filter(User.email == email).first()
        if not user:
            return {"error": "Identifiants invalides", "status_code": 401}

        # Vérification du hash
        if user.password_hash != AuthController._hash_password(password):
            return {"error": "Identifiants invalides", "status_code": 401}

        # Logique métier : En production, on génère un Token JWT ici
        return {
            "data": {
                "message": "Connexion réussie",
                "token_type": "bearer",
                "access_token": f"simulated-jwt-token-for-user-{user.user_id}",
                "role": user.role
            },
            "status_code": 200
        }