import os
from flask import Flask, jsonify, request
from dotenv import load_dotenv
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
load_dotenv() 

app.config["SQLALCHEMY_DATABASE_URI"] = os.environ["SQLALCHEMY_DATABASE_URI"]
db = SQLAlchemy(app)

class Question(db.Model):
    __tablename__ = "Questions"

    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.Text(), nullable=False)
    answer = db.Column(db.Text(), nullable=False)
    difficulty = db.Column(db.Integer, nullable=False)  # 1-10 scale
    category = db.Column(db.String(50), nullable=False)

    def __init__(self, text, answer, difficulty, category):
        self.text = text
        self.answer = answer
        self.difficulty = difficulty
        self.category = category
    
    def map(self):
        return {
            'id': self.id,
            'text': self.text,
            'difficulty': self.difficulty,
            'category': self.category
        }

@app.route('/api/questions/random', methods=['GET'])
def get_random_question():
    # Get difficulty from query params, default to 5
    difficulty = request.args.get('difficulty', 5, type=int)
    
    # Get question near the requested difficulty level
    question = Question.query.filter(
        Question.difficulty.between(difficulty - 1, difficulty + 1)
    ).order_by(db.func.random()).first()
    
    if not question:
        return jsonify({'error': 'No questions found'}), 404
    
    return jsonify(question.map())

@app.route('/api/questions/check/<int:id>', methods=['POST'])
def check_answer(id):
    data = request.get_json()
    user_answer = data.get('answer', '').strip().lower()
    
    question = Question.query.get_or_404(id)
    correct = user_answer == question.answer.strip().lower()
    
    return jsonify({
        'correct': correct,
        'correctAnswer': question.answer if not correct else None
    })

# Initialize some sample questions
def init_db():
    with app.app_context():
        db.create_all()
        if Question.query.count() == 0:
            sample_questions = [
                Question(
                    "What is 2 + 2?",
                    "4",
                    1,
                    "math"
                ),
                Question(
                    "What is the capital of France?",
                    "paris",
                    3,
                    "geography"
                ),
                Question(
                    "What is the square root of 144?",
                    "12",
                    5,
                    "math"
                ),
                Question(
                    "Who wrote 'Romeo and Juliet'?",
                    "william shakespeare",
                    4,
                    "literature"
                ),
                Question(
                    "What is the chemical symbol for gold?",
                    "au",
                    6,
                    "science"
                )
            ]
            for question in sample_questions:
                db.session.add(question)
            db.session.commit()

init_db()

if __name__ == "__main__":
    app.run(debug=True, port=5000)
