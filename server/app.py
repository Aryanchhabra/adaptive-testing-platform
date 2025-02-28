from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from config.mongodb import MongoDB
from database.operations import QuestionOperations
from models.question import Question
from data.python_questions import PYTHON_QUESTIONS
from models.quiz_session import QuizSession
from models.request_models import AnswerSubmission
from typing import Dict, Optional
from motor.motor_asyncio import AsyncIOMotorClient
import random
from services.ai_question_generator import AIQuestionGenerator
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
import sys
from pathlib import Path
from database.mongodb import init_db
from routes.admin_routes import admin_bp

# Load environment variables from root directory
root_dir = Path(__file__).resolve().parent.parent
dotenv_path = root_dir / '.env'
load_dotenv(dotenv_path=dotenv_path)

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React app URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# Store active sessions with their state
active_sessions = {}

# Initialize the generator
ai_question_generator = AIQuestionGenerator()

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Initialize database
init_db()

# Register blueprints
app.register_blueprint(admin_bp, url_prefix='/api/admin')

@app.on_event("startup")
async def startup_db_client():
    """Initialize database connection and load questions if needed"""
    try:
        # Connect to database
        db = await MongoDB.connect_db()
        
        # Initialize questions if none exist
        count = await db.questions.count_documents({})
        
        if count == 0:
            print("No questions found, initializing database...")
            await db.questions.insert_many(PYTHON_QUESTIONS)
            print(f"Loaded {len(PYTHON_QUESTIONS)} questions")
            
    except Exception as e:
        print(f"Failed to initialize database: {e}")

@app.on_event("shutdown")
async def shutdown_db_client():
    """Close database connection on shutdown"""
    await MongoDB.close_db()

@app.get("/api/health")
async def health_check():
    """Check if server and database are running"""
    try:
        db = await MongoDB.get_db()
        if db is None:
            return {
                "status": "unhealthy",
                "database": "disconnected"
            }
            
        count = await db.questions.count_documents({})
        return {
            "status": "healthy",
            "questions_count": count,
            "database": "connected"
        }
    except Exception as e:
        return {
            "status": "error",
            "detail": str(e),
            "database": "error"
        }

@app.get("/api/questions/count")
async def get_question_count():
    """Get total number of questions and breakdown by topic"""
    try:
        db = await MongoDB.get_db()
        total = await db.questions.count_documents({})
        
        # Get count by topic
        pipeline = [
            {"$group": {"_id": "$topic", "count": {"$sum": 1}}}
        ]
        topics = await db.questions.aggregate(pipeline).to_list(None)
        
        return {
            "total": total,
            "by_topic": {doc["_id"]: doc["count"] for doc in topics}
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/load-questions")
async def load_questions():
    """Load initial questions into database"""
    try:
        db = await MongoDB.get_db()
        if db is None:
            return {
                "status": "error",
                "message": "Failed to connect to MongoDB"
            }
        
        # Clear existing questions
        await db.questions.delete_many({})
        
        # Insert questions
        result = await db.questions.insert_many(PYTHON_QUESTIONS)
        
        return {
            "status": "success",
            "questions_loaded": len(result.inserted_ids),
            "message": f"Successfully loaded {len(result.inserted_ids)} questions"
        }
        
    except Exception as e:
        print(f"Error loading questions: {e}")
        return {
            "status": "error",
            "message": str(e)
        }

@app.post("/api/start-quiz")
async def start_quiz():
    """Start a new quiz session"""
    try:
        # Get database connection
        db = await MongoDB.get_db()
        
        try:
            # Check if we have questions
            question_count = await db.questions.count_documents({})
            print(f"Current question count: {question_count}")  # Debug log
            
            if question_count == 0:
                print("No questions found, attempting to load questions...")
                # Load questions
                try:
                    result = await db.questions.insert_many(PYTHON_QUESTIONS)
                    question_count = len(result.inserted_ids)
                    print(f"Successfully loaded {question_count} questions")
                except Exception as e:
                    print(f"Error loading questions: {e}")
                    return {
                        "status": "error",
                        "message": "Failed to load initial questions"
                    }
            
            # Get a random question
            try:
                random_question = await db.questions.aggregate([
                    { "$sample": { "size": 1 } }
                ]).to_list(length=1)
                
                if not random_question:
                    return {
                        "status": "error",
                        "message": "No questions available"
                    }
                    
                question = random_question[0]
                # Convert ObjectId to string for JSON serialization
                question["_id"] = str(question["_id"])
                
                # Create new session
                session_id = len(active_sessions)
                session = QuizSession(session_id)
                session.current_question = question  # Set the current question
                active_sessions[session_id] = session
                
                return {
                    "status": "success",
                    "session_id": session_id,
                    "question": question,
                    "total_questions": session.total_questions
                }
                
            except Exception as e:
                print(f"Error getting random question: {e}")
                return {
                    "status": "error",
                    "message": "Failed to retrieve question"
                }
            
        except Exception as e:
            print(f"Error processing quiz start: {e}")
            return {
                "status": "error",
                "message": str(e)
            }
            
    except Exception as e:
        print(f"Database connection error: {e}")
        return {
            "status": "error",
            "message": str(e)
        }

@app.post("/api/quiz/submit")
async def submit_answer(submission: AnswerSubmission):
    try:
        session = active_sessions.get(submission.session_id)
        if not session:
            return {
                "status": "error",
                "message": "Session not found"
            }

        print(f"Processing answer for session {submission.session_id}, questions answered: {session.questions_answered}/{session.total_questions}")
        
        # Get the current question from the session
        current_question = session.current_question
        if not current_question:
            return {
                "status": "error",
                "message": "No current question found"
            }
            
        selected_answer = submission.answer_data.get('selected_answer')
        response_time = submission.answer_data.get('response_time', 0)
        
        if selected_answer is None:
            return {
                "status": "error",
                "message": "No answer provided"
            }
        
        # Get correct answer with fallback
        correct_answer = current_question.get('correctAnswer', current_question.get('correct_answer'))
        if correct_answer is None:
            return {
                "status": "error",
                "message": "Question has no correct answer defined"
            }
            
        is_correct = selected_answer == correct_answer
        
        # Get topic from question
        topic = current_question.get('topic', 'General')

        # Update session with topic and response time
        session.update_performance(topic, is_correct, response_time)
        
        # Check if we've reached the total questions limit
        completed = session.is_completed
        print(f"Quiz completion status: {completed}, questions answered: {session.questions_answered}/{session.total_questions}")

        # Get next question
        next_question = None if completed else await session.process_answer(
            is_correct=is_correct,
            selected_answer=selected_answer
        )

        # Safely get the correct option
        options = current_question.get('options', [])
        correct_option = options[correct_answer] if 0 <= correct_answer < len(options) else "Unknown"

        # Get analysis if quiz is completed
        analysis = None
        if completed:
            analysis = session.analysis_service.analyze_session(session.get_session_stats())

        return {
            "status": "success",
            "feedback": {
                "is_correct": is_correct,
                "explanation": current_question.get('explanation', ''),
                "correct_answer": correct_answer,
                "selected_answer": selected_answer,
                "correct_option": correct_option
            },
            "completed": completed,
            "knowledge_state": session.knowledge_state,
            "progress": {
                "current": session.questions_answered,
                "total": session.total_questions,
                "accuracy": session.accuracy
            },
            "next_question": next_question if next_question else None,
            "analysis": analysis
        }

    except Exception as e:
        print(f"Error processing answer: {e}")
        return {
            "status": "error",
            "message": str(e)
        }

@app.get("/api/debug/questions")
async def debug_questions():
    """Debug endpoint to check questions in database"""
    try:
        db = await MongoDB.get_db()
        questions = await db.questions.find({}).to_list(None)
        return {
            "total_count": len(questions),
            "questions": [
                {
                    "_id": str(q.get("_id")),
                    "text": q.get("text"),
                    "topic": q.get("topic"),
                    "options": q.get("options"),
                    "correctAnswer": q.get("correctAnswer")
                } for q in questions
            ]
        }
    except Exception as e:
        print(f"Error in debug_questions: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/debug/status")
async def debug_status():
    """Debug endpoint to check system status"""
    try:
        db = await MongoDB.get_db()
        questions_count = await db.questions.count_documents({})
        sessions_count = len(active_sessions)
        
        # Get a sample question
        sample = await db.questions.find_one({})
        
        return {
            "database_connected": MongoDB.is_connected(),
            "questions_count": questions_count,
            "active_sessions": sessions_count,
            "sample_question": sample is not None,
            "topics": list(set(q['topic'] for q in await db.questions.find({}).to_list(None)))
        }
    except Exception as e:
        return {
            "error": str(e),
            "database_connected": False
        }

@app.get("/api/debug/session/{session_id}")
async def debug_session(session_id: int):
    """Debug endpoint to check session state"""
    try:
        session = active_sessions.get(session_id)
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")
            
        return {
            "questions_answered": session.questions_answered,
            "questions_asked": list(session.questions_asked),
            "current_question": session.current_question,
            "is_completed": session.is_completed,
            "total_questions": session.total_questions,
            "knowledge_state": session.knowledge_state
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/questions")
async def get_questions():
    try:
        client = AsyncIOMotorClient("mongodb+srv://Admin:Adaptive%40123@cluster0.qv2dg.mongodb.net/adaptive_quiz?retryWrites=true&w=majority")
        db = client.adaptive_quiz
        questions = await db.questions.find({}).to_list(None)
        return {"count": len(questions), "questions": questions}
    except Exception as e:
        return {"error": str(e)}
    finally:
        client.close()

@app.get("/api/test-connection")
async def test_connection():
    """Test database connection and return detailed status"""
    try:
        # Test MongoDB connection
        db = await MongoDB.get_db()
        if db is None:
            return {
                "status": "error",
                "message": "Failed to connect to MongoDB",
                "database_connected": False
            }
            
        # Try to perform a test operation
        count = await db.questions.count_documents({})
        
        return {
            "status": "success",
            "message": "Successfully connected to MongoDB",
            "database_connected": True,
            "questions_count": count,
            "database_name": db.name
        }
    except Exception as e:
        print(f"Database connection error: {e}")  # Server-side logging
        return {
            "status": "error",
            "message": str(e),
            "database_connected": False
        }

@app.post("/api/admin/generate-questions")
async def generate_questions(request: Dict):
    """Generate AI questions and add them to the database"""
    try:
        topic = request.get("topic", "Basic Python Syntax")
        difficulty = request.get("difficulty", 1)
        count = request.get("count", 5)
        
        # Generate questions
        questions = await ai_question_generator.generate_question_batch(topic, difficulty, count)
        
        # Save to database
        if questions:
            db = await MongoDB.get_db()
            result = await db.questions.insert_many(questions)
            return {
                "status": "success",
                "message": f"Generated {len(result.inserted_ids)} questions",
                "questions": questions
            }
        else:
            return {
                "status": "error",
                "message": "Failed to generate questions or daily limit reached"
            }
            
    except Exception as e:
        print(f"Error generating questions: {e}")
        return {
            "status": "error",
            "message": str(e)
        }

@app.route('/')
def index():
    return jsonify({"message": "AdaptiveTestAI API is running"})

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
