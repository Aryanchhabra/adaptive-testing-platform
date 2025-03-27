from fastapi import APIRouter, HTTPException, Query, Body
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import traceback
import time
import uuid

from models.question import Question
from services.question_service import QuestionService
from services.ai_question_generator import AIQuestionGenerator

router = APIRouter(tags=["questions"])

# Initialize services
question_service = QuestionService()
ai_generator = AIQuestionGenerator()

@router.get("/api/questions")
async def get_questions(
    topic: Optional[str] = None,
    difficulty: Optional[int] = None
):
    try:
        questions = question_service.get_questions(topic, difficulty)
        return questions
    except Exception as e:
        print(f"Error getting questions: {e}")
        raise HTTPException(status_code=500, detail=str(e))

class QuestionGenerateRequest(BaseModel):
    topic: str
    difficulty: int
    count: int = 5

@router.post("/api/questions/generate")
async def generate_questions(request: QuestionGenerateRequest):
    """Generate questions using the AI generator"""
    return await admin_generate_questions(request)

@router.post("/api/admin/generate-questions")
async def admin_generate_questions(request: QuestionGenerateRequest):
    """Generate questions using AI and save them to the database"""
    try:
        # Validate request
        if not request.topic:
            raise HTTPException(status_code=400, detail="Topic is required")
            
        if request.difficulty < 1 or request.difficulty > 3:
            raise HTTPException(status_code=400, detail="Difficulty must be between 1 and 3")
            
        if request.count < 1 or request.count > 10:
            raise HTTPException(status_code=400, detail="Count must be between 1 and 10")
            
        print(f"Generating {request.count} questions on {request.topic} with difficulty {request.difficulty}")
        
        # Generate questions using AI
        start_time = time.time()
        generated_questions = ai_generator.generate_questions(
            topic=request.topic,
            difficulty=request.difficulty,
            count=request.count
        )
        
        if not generated_questions:
            raise HTTPException(status_code=500, detail="Failed to generate questions")
            
        print(f"Generated {len(generated_questions)} questions in {time.time() - start_time:.2f} seconds")
        
        # Save questions to database
        saved_questions = []
        for q in generated_questions:
            # Validate question
            if not all(key in q for key in ['text', 'options', 'correctAnswer', 'explanation']):
                print(f"Skipping invalid question: {q}")
                continue
                
            # Create question object
            question = Question(
                id=str(uuid.uuid4()),
                text=q['text'],
                options=q['options'],
                correct_answer=q['correctAnswer'],
                explanation=q['explanation'],
                topic=request.topic,
                difficulty=request.difficulty
            )
            
            # Save to database
            question_id = question_service.add_question(question)
            if question_id:
                saved_question = question_service.get_question_by_id(question_id)
                if saved_question:
                    saved_questions.append(saved_question)
        
        print(f"Saved {len(saved_questions)} questions to MongoDB database")
        
        # Return success response with saved questions
        return {
            "message": f"Successfully generated and saved {len(saved_questions)} questions",
            "questions": saved_questions
        }
        
    except Exception as e:
        print(f"Error generating questions: {e}")
        traceback.print_exc()
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/api/questions/{question_id}")
async def get_question(question_id: str):
    try:
        question = question_service.get_question_by_id(question_id)
        if question:
            return question
        else:
            raise HTTPException(status_code=404, detail="Question not found")
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/api/questions/{question_id}")
async def delete_question(question_id: str):
    try:
        success = question_service.delete_question(question_id)
        if success:
            return {"message": "Question deleted successfully"}
        else:
            raise HTTPException(status_code=404, detail="Question not found")
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/api/questions/difficulty/{difficulty}")
async def get_questions_by_difficulty(difficulty: int):
    """Get questions by difficulty level"""
    try:
        # Convert string to int if needed
        difficulty_level = int(difficulty)
        
        # Validate difficulty level
        if difficulty_level < 1 or difficulty_level > 3:
            raise HTTPException(status_code=400, detail="Difficulty must be between 1 and 3")
            
        # Get questions by difficulty
        questions = question_service.get_questions(difficulty=difficulty_level)
        
        if not questions:
            return []
            
        return questions
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid difficulty value")
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e)) 