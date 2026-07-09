from sqlalchemy.orm import Session
from app.models.education import Course, QuizQuestion, QuizOption

class EducationController:

    @staticmethod
    def create_course(title: str, content: str, category: str, db: Session):
        new_course = Course(title=title, content=content, category=category)
        db.add(new_course)
        db.commit()
        db.refresh(new_course)
        return {"data": {"message": "Cours créé avec succès !", "course_id": new_course.course_id}, "status_code": 201}

    @staticmethod
    def get_all_courses(db: Session):
        return db.query(Course).all()

    @staticmethod
    def get_quiz(db: Session):
        """Récupère les questions avec leurs options (sans révéler les réponses correctes)."""
        questions = db.query(QuizQuestion).all()
        return [
            {
                "question_id": q.question_id,
                "question_text": q.question_text,
                "options": [{"option_id": o.option_id, "option_text": o.option_text} for o in q.options]
            }
            for q in questions
        ]

    @staticmethod
    def submit_quiz_answers(user_answers: list[dict], db: Session):
        """
        Logique métier : Calcule le score de l'utilisateur.
        Format attendu : [{"question_id": 1, "selected_option_id": 3}, ...]
        """
        score = 0
        total_questions = len(user_answers)
        
        if total_questions == 0:
            return {"error": "Aucune réponse fournie.", "status_code": 400}

        details = []
        for answer in user_answers:
            q_id = answer.get("question_id")
            opt_id = answer.get("selected_option_id")
            
            # On cherche l'option correcte pour cette question en BDD
            correct_option = db.query(QuizOption).filter(
                QuizOption.question_id == q_id, 
                QuizOption.is_correct == True
            ).first()
            
            is_user_correct = (correct_option and correct_option.option_id == opt_id)
            if is_user_correct:
                score += 1
                
            details.append({
                "question_id": q_id,
                "correct": is_user_correct,
                "correct_option_id": correct_option.option_id if correct_option else None
            })

        return {
            "data": {
                "message": "Quiz corrigé !",
                "score": f"{score}/{total_questions}",
                "percentage": (score / total_questions) * 100,
                "details": details
            },
            "status_code": 200
        }
