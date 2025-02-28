from flask import Blueprint, request, jsonify
from services.ai_question_generator import AIQuestionGenerator
from database.mongodb import get_db

admin_bp = Blueprint('admin', __name__)
question_generator = AIQuestionGenerator()

@admin_bp.route('/generate-questions', methods=['POST'])
def generate_questions():
    """Generate AI questions and add them to the database"""
    try:
        data = request.get_json()
        topic = data.get("topic", "Basic Python Syntax")
        difficulty = data.get("difficulty", 1)
        count = data.get("count", 5)
        
        # Generate questions
        questions = question_generator.generate_questions(topic, difficulty, count)
        
        # Save to database if questions were generated
        if questions:
            db = get_db()
            result = db.questions.insert_many(questions)
            
            return jsonify({
                "status": "success",
                "message": f"Generated {len(result.inserted_ids)} questions",
                "questions": questions
            })
        else:
            return jsonify({
                "status": "error",
                "message": "Failed to generate questions"
            }), 500
            
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500 