from sqlalchemy.orm import Session
from app.database import SessionLocal, engine, Base
from app.models.education import Course, QuizQuestion, QuizOption

def seed_educational_data():
    db: Session = SessionLocal()
    print("🔄 Connexion à la base de données réussie. Début du peuplement...")

    try:
        # 1. Nettoyage des anciennes données (pour pouvoir rejouer le script sans erreur)
        db.query(QuizOption).delete()
        db.query(QuizQuestion).delete()
        db.query(Course).delete()
        db.commit()
        print("🗑️  Anciennes données éducatives nettoyées.")

        # 2. Insertion des Cours / Fiches Pédagogiques
        cours_data = [
            Course(
                title="Le tri des déchets à Kinshasa",
                content="Trier ses déchets permet de réduire les décharges sauvages. Séparez le plastique (bouteilles) des déchets organiques (restes de nourriture) pour faciliter le recyclage ou le compostage.",
                category="dechets"
            ),
            Course(
                title="Prévenir les inondations en saison des pluies",
                content="Le jet d'ordures dans les rivières et les caniveaux bloque l'évacuation des eaux de pluie. C'est la cause principale des inondations stagnantes sur les grands boulevards de Kinshasa.",
                category="assainissement"
            )
        ]
        db.add_all(cours_data)
        print("📚 Fiches pédagogiques insérées.")

        # 3. Insertion du Quiz
        # Question 1
        q1 = QuizQuestion(question_text="Quel type de déchet doit-on éviter de jeter dans les caniveaux pour empêcher les inondations ?")
        q1.options = [
            QuizOption(option_text="Les restes d'aliments biodégradables", is_correct=False),
            QuizOption(option_text="Les bouteilles et sacs en plastique", is_correct=True),
            QuizOption(option_text="L'eau de vaisselle", is_correct=False)
        ]

        # Question 2
        q2 = QuizQuestion(question_text="Quelle est la meilleure action pour valoriser les déchets organiques (épluchures, restes de repas) ?")
        q2.options = [
            QuizOption(option_text="Les brûler dans la parcelle", is_correct=False),
            QuizOption(option_text="Les enterrer ou en faire du compost pour le jardin", is_correct=True),
            QuizOption(option_text="Les jeter dans une décharge sauvage", is_correct=False)
        ]

        # Question 3
        q3 = QuizQuestion(question_text="Que signifie le statut 'full' (plein) sur une borne ou un bac à ordures public de l'application ?")
        q3.options = [
            QuizOption(option_text="Le bac est endommagé", is_correct=False),
            QuizOption(option_text="Le bac a atteint sa capacité maximale et doit être vidé par un collecteur", is_correct=True),
            QuizOption(option_text="Le bac est totalement vide et propre", is_correct=False)
        ]

        db.add_all([q1, q2, q3])
        db.commit()
        print("🎯 Quiz de test (3 questions) inséré avec succès.")
        print("✅ Tout est prêt ! Vous pouvez fermer ce script.")

    except Exception as e:
        db.rollback()
        print(f"❌ Erreur lors de l'insertion : {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_educational_data()
