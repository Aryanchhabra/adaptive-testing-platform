from fastapi import APIRouter, HTTPException, Body, Depends, Request
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
import random
import traceback
import json
import uuid
from bson import ObjectId
from datetime import datetime

from services.question_service import QuestionService
from middlewares.auth import get_current_user, get_optional_user
from services.user_service import UserService

router = APIRouter(tags=["quiz"])
question_service = QuestionService()
user_service = UserService()

class AnswerSubmission(BaseModel):
    question_id: Optional[str] = None
    selected_option: Optional[int] = None
    session_id: Optional[str] = None
    time_taken: Optional[float] = None
    
    # Legacy fields for backward compatibility
    question: Optional[Dict[str, Any]] = None
    answer: Optional[int] = None
    knowledgeState: Optional[Dict[str, Any]] = None

@router.post("/api/quiz/start")
async def quiz_start(request: Request):
    """Start a new adaptive quiz session with optional user authentication"""
    try:
        print("Received request to start quiz")
        
        # Get user if authenticated (optional)
        user = await get_optional_user(request)
        if user:
            print(f"Authenticated user: {user['email']}")
        else:
            print("Anonymous user")
        
        # Get a random question to start with
        all_questions = question_service.get_questions()
        print(f"Found {len(all_questions)} questions in database")
        
        if not all_questions:
            print("No questions found in database")
            raise HTTPException(status_code=404, detail="No questions available")
            
        # Select a random question
        question = random.choice(all_questions)
        print(f"Selected question: {question.get('id', 'unknown')}")
        
        # Create a new session ID
        session_id = str(uuid.uuid4())
        print(f"Created new session: {session_id}")
        
        # Get unique topics from questions
        topics = set(q.get('topic', 'General') for q in all_questions)
        print(f"Available topics: {topics}")
        
        # Custom JSON encoder for MongoDB types
        class MongoJSONEncoder(json.JSONEncoder):
            def default(self, obj):
                if isinstance(obj, ObjectId):
                    return str(obj)
                return super().default(obj)
        
        # Create a serializable copy of the question
        import copy
        serializable_question = copy.deepcopy(question)
        
        # Convert any ObjectId to strings
        for key, value in serializable_question.items():
            if isinstance(value, ObjectId):
                serializable_question[key] = str(value)
        
        # Initialize knowledge state or load from user profile
        knowledge_state = {
            'level': 1,
            'score': 0,
            'correct_streak': 0,
            'incorrect_streak': 0,
            'answered_questions': []
        }
        
        # If user is authenticated, try to get their existing knowledge state
        if user and 'knowledge_state' in user and user['knowledge_state']:
            knowledge_state = user['knowledge_state']
            print(f"Loaded knowledge state from user profile")
        
        # Add topic-based progress for any missing topics
        for topic in topics:
            if topic and topic != 'null' and topic not in knowledge_state:
                knowledge_state[topic] = {
                    'level': 0.1,  # Start with 10% knowledge
                    'status': 'Beginner',
                    'explanation': f'Starting to learn about {topic}',
                    'correct_count': 0,  # Initialize counts
                    'incorrect_count': 0 # Initialize counts
                }
            elif topic and topic != 'null' and topic in knowledge_state and 'correct_count' not in knowledge_state[topic]:
                knowledge_state[topic]['correct_count'] = 0
                knowledge_state[topic]['incorrect_count'] = 0
        
        # Store quiz session in database (TODO: implement session storage)
        # If we had a session_service:
        # session_id = await session_service.create_session({
        #     'user_id': user['id'] if user else None,
        #     'started_at': datetime.utcnow(),
        #     'knowledge_state': knowledge_state
        # })
        
        # If user is authenticated, add this session to their history
        if user:
            await user_service.add_quiz_session(user['id'], session_id)
        
        response_data = {
            "session_id": session_id,
            "question": serializable_question,
            "knowledge_state": knowledge_state,
            "quizStarted": True
        }
        
        print(f"Returning response with session_id: {session_id}")
        
        # Test serialization before returning to catch any issues
        try:
            # This will raise an error if there are non-serializable objects
            json_str = json.dumps(response_data, cls=MongoJSONEncoder)
            print(f"Response successfully serialized, length: {len(json_str)} characters")
        except Exception as json_err:
            print(f"Serialization error: {json_err}")
            raise ValueError(f"Failed to serialize response: {json_err}")
            
        return response_data
        
    except Exception as e:
        print(f"Error starting quiz: {e}")
        traceback.print_exc()
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/api/quiz/submit")
async def quiz_submit(submission: AnswerSubmission, request: Request):
    """Submit an answer and get the next question"""
    try:
        print("Received answer submission")
        
        # Get user if authenticated (optional)
        user = await get_optional_user(request)
        if user:
            print(f"Authenticated user: {user['email']}")
        else:
            print("Anonymous user")
        
        # Handle both old and new request formats
        if submission.question:
            # Old format
            question = submission.question
            selected_answer = submission.answer
            knowledge_state = submission.knowledgeState
        else:
            # New format
            # Fetch the question from the database using question_id
            question_id = submission.question_id
            selected_answer = submission.selected_option
            
            # Get the question from the database
            all_questions = question_service.get_questions()
            question = next((q for q in all_questions if q['id'] == question_id), None)
            
            # Initialize knowledge state if it doesn't exist
            knowledge_state = {
                'level': 1,
                'score': 0,
                'correct_streak': 0,
                'incorrect_streak': 0,
                'answered_questions': []
            }
        
        print(f"Question ID: {question.get('id') if question else 'None'}")
        print(f"Selected answer: {selected_answer}")
        
        if not question or selected_answer is None:
            print("Missing required fields in request")
            raise HTTPException(status_code=400, detail="Missing required fields")
            
        # Initialize knowledge state if it doesn't exist
        if not knowledge_state:
            knowledge_state = {
                'level': 1,
                'score': 0,
                'correct_streak': 0,
                'incorrect_streak': 0,
                'answered_questions': []
            }
            
        # Check if answer is correct
        is_correct = selected_answer == question.get('correctAnswer')
        print(f"Answer is {'correct' if is_correct else 'incorrect'}")
        
        # Initialize answered_questions if it doesn't exist
        if 'answered_questions' not in knowledge_state:
            knowledge_state['answered_questions'] = []
            
        # Add current question to answered questions if not already there
        if question['id'] not in knowledge_state['answered_questions']:
            knowledge_state['answered_questions'].append(question['id'])
        
        # Get the topic of the current question
        topic = question.get('topic', 'General')
        
        # Initialize topic in knowledge state if it doesn't exist
        if topic and topic != 'null' and topic not in knowledge_state:
            knowledge_state[topic] = {
                'level': 0.1, 
                'status': 'Beginner',
                'explanation': f'Starting to learn about {topic}',
                'correct_count': 0,
                'incorrect_count': 0
            }
        elif topic and topic != 'null' and topic in knowledge_state and 'correct_count' not in knowledge_state[topic]:
            knowledge_state[topic]['correct_count'] = 0
            knowledge_state[topic]['incorrect_count'] = 0
            
        # Update knowledge state based on answer
        if is_correct:
            # Increase score
            knowledge_state['score'] = knowledge_state.get('score', 0) + 10
            
            # Update streaks
            knowledge_state['correct_streak'] = knowledge_state.get('correct_streak', 0) + 1
            knowledge_state['incorrect_streak'] = 0
            
            # Increase difficulty if on a streak
            if knowledge_state['correct_streak'] >= 2 and knowledge_state.get('level', 1) < 3:
                knowledge_state['level'] = knowledge_state.get('level', 1) + 1
                knowledge_state['correct_streak'] = 0
                print(f"Increased difficulty level to {knowledge_state['level']}")
                
            # Update topic-specific knowledge for correct answer
            if topic and topic != 'null' and topic in knowledge_state:
                topic_data = knowledge_state[topic]
                topic_data['correct_count'] = topic_data.get('correct_count', 0) + 1
                topic_data['level'] = min(topic_data.get('level', 0.1) + 0.1, 1.0)
                 # Update status based on level
                if topic_data['level'] < 0.33:
                    topic_data['status'] = 'Beginner'
                    topic_data['explanation'] = f'You are starting to understand {topic}'
                elif topic_data['level'] < 0.66:
                    topic_data['status'] = 'Intermediate'
                    topic_data['explanation'] = f'You have a good grasp of {topic}'
                else:
                    topic_data['status'] = 'Advanced'
                    topic_data['explanation'] = f'You have mastered {topic}'
                knowledge_state[topic] = topic_data

        else: # Incorrect answer
            # Update streaks
            knowledge_state['incorrect_streak'] = knowledge_state.get('incorrect_streak', 0) + 1
            knowledge_state['correct_streak'] = 0
            
            # Decrease difficulty if struggling
            if knowledge_state['incorrect_streak'] >= 2 and knowledge_state.get('level', 1) > 1:
                knowledge_state['level'] = knowledge_state.get('level', 1) - 1
                knowledge_state['incorrect_streak'] = 0
                print(f"Decreased difficulty level to {knowledge_state['level']}")

            # Update topic-specific knowledge for incorrect answer
            if topic and topic != 'null' and topic in knowledge_state:
                topic_data = knowledge_state[topic]
                topic_data['incorrect_count'] = topic_data.get('incorrect_count', 0) + 1
                topic_data['level'] = max(topic_data.get('level', 0.1) - 0.05, 0.0)
                # Update status based on level (copied from correct block for consistency)
                if topic_data['level'] < 0.33:
                    topic_data['status'] = 'Beginner'
                    topic_data['explanation'] = f'Still building fundamentals in {topic}'
                elif topic_data['level'] < 0.66:
                    topic_data['status'] = 'Intermediate'
                    topic_data['explanation'] = f'Making progress in {topic}'
                else:
                    topic_data['status'] = 'Advanced'
                    topic_data['explanation'] = f'Solid understanding of {topic}'
                knowledge_state[topic] = topic_data
        
        # If user is authenticated, update their knowledge state
        if user:
            await user_service.update_knowledge_state(user['id'], knowledge_state)
            print(f"Updated knowledge state for user {user['email']}")
        
        # Check if quiz is complete (10 questions)
        if len(knowledge_state['answered_questions']) >= 10:
            print("Quiz complete - reached 10 questions")
            
            # Generate a comprehensive analysis
            total_score = knowledge_state['score']
            total_questions = len(knowledge_state['answered_questions'])
            correct_answers = total_score // 10  # Each correct answer is worth 10 points
            accuracy = correct_answers / total_questions if total_questions > 0 else 0
            
            # Extract topics that were actually covered in this quiz session
            attempted_topics = set()
            for question_id in knowledge_state['answered_questions']:
                # Find the question to get its topic
                question_obj = next((q for q in all_questions if q.get('id') == question_id), None)
                if question_obj and 'topic' in question_obj:
                    topic = question_obj.get('topic')
                    if topic and topic != 'null':
                        attempted_topics.add(topic)
            
            # Get the proficiency breakdown only for attempted topics
            proficiency_breakdown = {}
            strengths = []
            weaknesses = []
            recommendations = []
            
            for topic in attempted_topics:
                if topic in knowledge_state:
                    # Calculate proficiency percentage
                    level = knowledge_state[topic].get('level', 0) * 100
                    proficiency_breakdown[topic] = f"{level:.1f}%"
                    
                    # Determine strengths and weaknesses based on final level
                    if level >= 70:
                        strengths.append(f"Strong understanding of {topic}")
                    # Track weaknesses based on final level for reporting, but generate recommendations based on session performance
                    elif level <= 40:
                         weaknesses.append(f"Proficiency in {topic} is still developing (Level: {level:.0f}%). Consider reviewing fundamentals.")

                    # Generate recommendations based on session performance for this topic
                    correct_in_session = knowledge_state[topic].get('correct_count', 0)
                    incorrect_in_session = knowledge_state[topic].get('incorrect_count', 0)
                    
                    if incorrect_in_session > 0 and incorrect_in_session >= correct_in_session:
                        recommendations.append(f"Focus on practicing {topic}. You had {incorrect_in_session} incorrect answer(s) in this session.")
                    elif incorrect_in_session > 0 and correct_in_session == 0: # Handle case where only incorrect answers were given for a topic
                         recommendations.append(f"Review the basics of {topic}. You encountered difficulties with it in this session.")
                 
            
            # If no specific recommendations were generated based on errors
            if not recommendations and accuracy < 0.8: # Add a general tip if accuracy wasn't high but no specific topic stood out as problematic
                 recommendations.append("Continue practicing consistently to solidify your understanding across topics.")
            elif not recommendations and accuracy >= 0.8:
                 recommendations.append("Great job! Keep challenging yourself with more complex problems.")

            # Clean up: remove session counts from the knowledge state sent back (optional, depends if FE needs it)
            final_knowledge_state = {}
            for k, v in knowledge_state.items():
                if isinstance(v, dict):
                    final_knowledge_state[k] = {key: val for key, val in v.items() if key not in ['correct_count', 'incorrect_count']}
                else:
                    final_knowledge_state[k] = v

            # Analysis generation with only attempted topics
            analysis = {
                "strengths": strengths,
                "weaknesses": weaknesses, # Now includes proficiency level
                "recommendations": recommendations, # Generated based on session performance
                "accuracy": accuracy,
                "total_questions": total_questions,
                "correct_answers": correct_answers,
                "score": total_score,
                "proficiency_breakdown": proficiency_breakdown,
                "overall_proficiency": f"{sum([float(p.replace('%', '')) for p in proficiency_breakdown.values()]) / len(proficiency_breakdown):.1f}%" if proficiency_breakdown else "0%",
                "performance_level": "Advanced" if accuracy >= 0.8 else "Intermediate" if accuracy >= 0.6 else "Beginner",
                "topics_covered": list(attempted_topics)
            }
            
            return {
                "correct": is_correct,
                "feedback": {
                    "isCorrect": is_correct,
                    "explanation": question.get('explanation', '')
                },
                "completed": True,
                "score": knowledge_state['score'], # Return original score
                "knowledge_state": final_knowledge_state, # Return knowledge state without session counts
                "progress": {
                    "score": total_score,
                    "questionsAnswered": total_questions,
                    "totalQuestions": 10,
                    "accuracy": accuracy,
                    "current": total_questions,
                    "total": 10
                },
                "analysis": analysis
            }
            
        # Get next question based on updated knowledge state
        all_questions = question_service.get_questions()
        print(f"Found {len(all_questions)} total questions")
        
        # Filter out already answered questions
        available_questions = [
            q for q in all_questions 
            if q['id'] not in knowledge_state['answered_questions']
        ]
        
        print(f"Found {len(available_questions)} available questions")
        
        if not available_questions:
            # If no more questions, end the quiz
            print("No more available questions, ending quiz")
            return {
                "correct": is_correct,
                "feedback": {
                    "isCorrect": is_correct,
                    "explanation": question.get('explanation', '')
                },
                "completed": True,
                "score": knowledge_state['score'],
                "knowledge_state": knowledge_state
            }
            
        # Filter by current difficulty level
        level_questions = [
            q for q in available_questions 
            if q['difficulty'] == knowledge_state.get('level', 1)
        ]
        
        print(f"Found {len(level_questions)} questions at current difficulty level {knowledge_state.get('level', 1)}")
        
        if level_questions:
            next_question = random.choice(level_questions)
        else:
            # Fall back to any available question
            next_question = random.choice(available_questions)
            
        print(f"Selected next question: {next_question['id']}")
        
        # Make a serializable copy of the question
        import copy
        serializable_question = copy.deepcopy(next_question)
        
        # Convert any ObjectId to strings
        for key, value in serializable_question.items():
            if isinstance(value, ObjectId):
                serializable_question[key] = str(value)
        
        return {
            "correct": is_correct,
            "feedback": {
                "isCorrect": is_correct,
                "explanation": question.get('explanation', '')
            },
            "next_question": serializable_question,
            "knowledge_state": knowledge_state,
            "progress": {
                "score": knowledge_state['score'],
                "questionsAnswered": len(knowledge_state['answered_questions']),
                "totalQuestions": 10,
                "current": len(knowledge_state['answered_questions']),
                "total": 10
            }
        }
        
    except Exception as e:
        print(f"Error processing answer submission: {e}")
        traceback.print_exc()
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e)) 