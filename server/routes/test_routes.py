from fastapi import APIRouter, HTTPException, Body
from pydantic import BaseModel
from services.question_service import QuestionService
from typing import Dict, Any, List, Optional
import random
import traceback
import json
import uuid
from bson import ObjectId

router = APIRouter(tags=["test"])
question_service = QuestionService()

@router.post("/api/start-test")
async def start_test():
    """Start a new adaptive test session"""
    return await start_quiz()

@router.post("/api/start-quiz")
async def start_quiz():
    """Start a new adaptive quiz session (alias for start-test)"""
    return await quiz_start()

@router.post("/api/quiz/start")
async def quiz_start():
    """Start a new adaptive quiz session (main implementation)"""
    try:
        print("Received request to start quiz")
        
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
        
        # Ensure ObjectId is converted to string
        # Create deep copy of question to avoid modifying the original
        import copy
        
        # Custom JSON encoder for MongoDB types
        class MongoJSONEncoder(json.JSONEncoder):
            def default(self, obj):
                if isinstance(obj, ObjectId):
                    return str(obj)
                return super().default(obj)
        
        # Create a serializable copy of the question
        serializable_question = copy.deepcopy(question)
        
        # Convert any ObjectId to strings
        for key, value in serializable_question.items():
            if isinstance(value, ObjectId):
                serializable_question[key] = str(value)
        
        # Initialize knowledge state with topic-based progress
        knowledge_state = {
            'level': 1,
            'score': 0,
            'correct_streak': 0,
            'incorrect_streak': 0,
            'answered_questions': []
        }
        
        # Add topic-based progress
        for topic in topics:
            if topic and topic != 'null':
                knowledge_state[topic] = {
                    'level': 0.1,  # Start with 10% knowledge
                    'status': 'Beginner',
                    'explanation': f'Starting to learn about {topic}'
                }
        
        response_data = {
            "session_id": session_id,
            "question": serializable_question,
            "knowledge_state": knowledge_state,
            "quizStarted": True  # Add this flag to control whether the quiz begins immediately
        }
        
        print(f"Returning response with session_id: {session_id}")
        print(f"Response question ID: {serializable_question.get('id', 'unknown')}")
        
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
        
class AnswerSubmission(BaseModel):
    session_id: Optional[str] = None
    question_id: Optional[str] = None
    selected_option: Optional[int] = None
    answer_data: Optional[Dict[str, Any]] = None
    # Keep the old fields for backward compatibility
    question: Optional[Dict[str, Any]] = None
    answer: Optional[int] = None
    knowledgeState: Optional[Dict[str, Any]] = None
        
@router.post("/api/submit-answer")
async def submit_answer(submission: AnswerSubmission):
    """Submit an answer and get the next question"""
    return await quiz_submit(submission)

@router.post("/api/quiz/submit")
async def quiz_submit(submission: AnswerSubmission):
    """Submit an answer and get the next question (main implementation)"""
    try:
        print("Received answer submission")
        
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
        print(f"Knowledge state: {json.dumps(knowledge_state)[:100] if knowledge_state else 'None'}...")
        
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
                'explanation': f'Starting to learn about {topic}'
            }
        
        # Update overall knowledge state
        if is_correct:
            knowledge_state['correct_streak'] = knowledge_state.get('correct_streak', 0) + 1
            knowledge_state['incorrect_streak'] = 0
            knowledge_state['score'] = knowledge_state.get('score', 0) + 10
            
            # Increase difficulty after 2 correct answers in a row
            if knowledge_state['correct_streak'] >= 2 and knowledge_state.get('level', 1) < 3:
                knowledge_state['level'] = knowledge_state.get('level', 1) + 1
                knowledge_state['correct_streak'] = 0
                print(f"Increasing difficulty to level {knowledge_state['level']}")
        else:
            knowledge_state['incorrect_streak'] = knowledge_state.get('incorrect_streak', 0) + 1
            knowledge_state['correct_streak'] = 0
            
            # Decrease difficulty after 2 incorrect answers in a row
            if knowledge_state['incorrect_streak'] >= 2 and knowledge_state.get('level', 1) > 1:
                knowledge_state['level'] = knowledge_state.get('level', 1) - 1
                knowledge_state['incorrect_streak'] = 0
                print(f"Decreasing difficulty to level {knowledge_state['level']}")
        
        # Update topic-specific knowledge
        if topic and topic != 'null' and topic in knowledge_state:
            topic_data = knowledge_state[topic]
            current_level = topic_data.get('level', 0.1)
            
            # Update level based on answer
            if is_correct:
                # Increase knowledge level (max 1.0)
                new_level = min(current_level + 0.1, 1.0)
            else:
                # Decrease knowledge level (min 0.0)
                new_level = max(current_level - 0.05, 0.0)
                
            topic_data['level'] = new_level
            
            # Update status based on level
            if new_level < 0.33:
                topic_data['status'] = 'Beginner'
                topic_data['explanation'] = f'You are starting to understand {topic}'
            elif new_level < 0.66:
                topic_data['status'] = 'Intermediate'
                topic_data['explanation'] = f'You have a good grasp of {topic}'
            else:
                topic_data['status'] = 'Advanced'
                topic_data['explanation'] = f'You have mastered {topic}'
                
            knowledge_state[topic] = topic_data
        
        # Check if quiz is complete (10 questions)
        if len(knowledge_state['answered_questions']) >= 10:
            print("Quiz complete - reached 10 questions")
            
            # Generate a comprehensive analysis
            total_score = knowledge_state['score']
            total_questions = len(knowledge_state['answered_questions'])
            correct_answers = total_score // 10  # Each correct answer is worth 10 points
            accuracy = correct_answers / total_questions if total_questions > 0 else 0
            
            # Calculate topic-specific proficiency
            topic_proficiencies = {}
            strengths = []
            weaknesses = []
            recommendations = []
            
            # Get all topics from the knowledge state
            topics = [k for k in knowledge_state.keys() if k not in [
                'level', 'score', 'correct_streak', 'incorrect_streak', 'answered_questions'
            ]]
            
            for topic in topics:
                if isinstance(knowledge_state[topic], dict) and 'level' in knowledge_state[topic]:
                    level = knowledge_state[topic]['level']
                    topic_proficiencies[topic] = f"{int(level * 100)}%"
                    
                    # Identify strengths (topics with proficiency > 70%)
                    if level > 0.7:
                        strengths.append({
                            "topic": topic,
                            "proficiency": f"{int(level * 100)}%",
                            "details": f"You demonstrate strong understanding of {topic} concepts.",
                            "description": f"Your mastery of {topic} is impressive. You can confidently apply these concepts in complex scenarios and likely explain them to others."
                        })
                    elif level > 0.5:
                        strengths.append({
                            "topic": topic,
                            "proficiency": f"{int(level * 100)}%",
                            "details": f"You have a good grasp of {topic} fundamentals.",
                            "description": f"Your knowledge of {topic} is solid. You understand the core principles and can apply them in standard situations."
                        })
                    
                    # Identify weaknesses (topics with proficiency < 50%)
                    if level < 0.4:
                        weaknesses.append({
                            "topic": topic,
                            "proficiency": f"{int(level * 100)}%",
                            "details": f"You may need additional practice with {topic} concepts.",
                            "description": f"Your understanding of {topic} shows room for improvement. Focusing on the fundamentals will help strengthen your knowledge base."
                        })
                    elif level < 0.6:
                        weaknesses.append({
                            "topic": topic,
                            "proficiency": f"{int(level * 100)}%",
                            "details": f"Your knowledge of {topic} is developing but needs refinement.",
                            "description": f"While you grasp some aspects of {topic}, there are gaps in your understanding that would benefit from targeted practice."
                        })
                    
                    # Generate topic-specific recommendations with learning resources
                    if level < 0.3:
                        recommendations.append({
                            "topic": topic,
                            "priority": "High",
                            "action": f"Focus on building fundamental knowledge in {topic}.",
                            "resources": [
                                "Review introductory tutorials and documentation",
                                "Practice with basic exercises",
                                "Use interactive learning platforms for guided practice"
                            ]
                        })
                    elif level < 0.6:
                        recommendations.append({
                            "topic": topic,
                            "priority": "Medium",
                            "action": f"Continue practicing intermediate {topic} concepts.",
                            "resources": [
                                "Complete practical coding challenges",
                                "Build small projects using these concepts",
                                "Read articles on best practices"
                            ]
                        })
                    else:
                        recommendations.append({
                            "topic": topic,
                            "priority": "Low",
                            "action": f"Challenge yourself with advanced {topic} problems.",
                            "resources": [
                                "Tackle complex projects",
                                "Study implementation details and optimizations",
                                "Explore advanced use cases and edge scenarios"
                            ]
                        })
            
            # If no specific strengths found, add a general one
            if not strengths:
                strengths.append({
                    "topic": "General Knowledge",
                    "proficiency": f"{int(accuracy * 100)}%",
                    "details": "You're making progress in your learning journey.",
                    "description": "You're showing potential in your understanding of the material. Continue building your foundation across all topics."
                })
            
            # If no specific weaknesses found but accuracy is low, add a general one
            if not weaknesses and accuracy < 0.6:
                weaknesses.append({
                    "topic": "Overall Performance",
                    "proficiency": f"{int(accuracy * 100)}%",
                    "details": "You may benefit from reviewing core concepts across all topics.",
                    "description": "Your overall performance suggests there are fundamental concepts you need to strengthen. Consider a structured review of key principles."
                })
            
            # If no recommendations, add general ones
            if not recommendations:
                recommendations.append({
                    "topic": "General Study",
                    "priority": "Medium",
                    "action": "Continue practicing with a variety of problems.",
                    "resources": [
                        "Use diverse learning resources to expose yourself to different perspectives",
                        "Focus on understanding concepts rather than memorizing solutions",
                        "Schedule regular review sessions to reinforce learning"
                    ]
                })
                recommendations.append({
                    "topic": "Learning Strategy",
                    "priority": "Medium",
                    "action": "Review the explanations for questions you answered incorrectly.",
                    "resources": [
                        "Keep a learning journal to track your progress",
                        "Join study groups or forums to discuss challenging concepts",
                        "Apply spaced repetition techniques to improve retention"
                    ]
                })
            
            # Calculate overall proficiency
            overall_proficiency = f"{int(accuracy * 100)}%"
            
            # Determine performance level with detailed description
            performance_level = ""
            performance_description = ""
            
            if accuracy >= 0.8:
                performance_level = "Expert"
                performance_description = "You demonstrate advanced proficiency across most topics. Your understanding is comprehensive and nuanced, allowing you to tackle complex problems with confidence. You're ready for advanced challenges and may consider mentoring others."
            elif accuracy >= 0.6:
                performance_level = "Advanced"
                performance_description = "Your knowledge is solid with strong understanding of core concepts. You can apply principles effectively in various situations. Focus on refining your skills in areas of weakness to reach expert level."
            elif accuracy >= 0.4:
                performance_level = "Intermediate"
                performance_description = "You have a moderate grasp of the material with some areas of strength. Continue building your knowledge foundation and practice applying concepts in different contexts to deepen your understanding."
            else:
                performance_level = "Beginner"
                performance_description = "You're at the beginning of your learning journey. Focus on mastering foundational concepts first, and don't be discouraged - consistent practice will lead to improvement. Break down complex topics into smaller, manageable parts."
            
            # Generate performance insights with actionable advice
            performance_insights = []
            
            # Add learning style insight
            if accuracy >= 0.7:
                performance_insights.append({
                    "category": "Learning Strategy",
                    "insight": "You excel at conceptual understanding and application.",
                    "action": "Challenge yourself with complex problems that require combining multiple concepts."
                })
            elif accuracy >= 0.5:
                performance_insights.append({
                    "category": "Learning Strategy",
                    "insight": "You understand key concepts but may need more practice applying them.",
                    "action": "Focus on hands-on exercises that reinforce theoretical knowledge."
                })
            else:
                performance_insights.append({
                    "category": "Learning Strategy",
                    "insight": "You may benefit from a more structured learning approach.",
                    "action": "Break down complex topics into smaller parts and master fundamentals before moving on."
                })
            
            # Add consistency insight
            consistent_performance = True  # This would ideally be calculated from actual performance data
            if consistent_performance:
                performance_insights.append({
                    "category": "Performance Pattern",
                    "insight": "Your performance is consistent across different question types.",
                    "action": "This balanced approach is effective. Continue with your current study methods."
                })
            else:
                performance_insights.append({
                    "category": "Performance Pattern",
                    "insight": "Your performance varies significantly between topics.",
                    "action": "Allocate more time to weaker areas while maintaining your strengths."
                })
            
            # Add improvement-focused insight
            performance_insights.append({
                "category": "Growth Opportunity",
                "insight": "Regular practice is key to continuous improvement.",
                "action": "Set aside dedicated time for focused learning sessions and track your progress."
            })
            
            # Generate a summary paragraph
            summary = f"Your assessment results show that you're performing at a {performance_level.lower()} level with an overall proficiency of {overall_proficiency}. "
            
            if strengths:
                topics = ", ".join([s["topic"] for s in strengths[:2]])
                if len(strengths) > 2:
                    topics += f", and {len(strengths)-2} other area{'s' if len(strengths)-2 > 1 else ''}"
                summary += f"You show particular strength in {topics}. "
                
            if weaknesses:
                topics = ", ".join([w["topic"] for w in weaknesses[:2]])
                if len(weaknesses) > 2:
                    topics += f", and {len(weaknesses)-2} other area{'s' if len(weaknesses)-2 > 1 else ''}"
                summary += f"Focus on improving your understanding of {topics} to enhance your overall proficiency. "
                
            summary += performance_description
            
            # Create the final analysis object
            analysis = {
                "overall_proficiency": overall_proficiency,
                "proficiency_breakdown": topic_proficiencies,
                "strengths": strengths,
                "weaknesses": weaknesses,
                "recommendations": recommendations,
                "performance_insights": performance_insights,
                "accuracy": accuracy,
                "total_questions": total_questions,
                "correct_answers": correct_answers,
                "score": total_score,
                "performance_level": performance_level,
                "performance_description": performance_description,
                "summary": summary
            }
            
            return {
                "correct": is_correct,
                "feedback": {
                    "isCorrect": is_correct,
                    "explanation": question.get('explanation', '')
                },
                "completed": True,
                "score": knowledge_state['score'],
                "knowledge_state": knowledge_state,
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
                "knowledge_state": knowledge_state,
                "progress": {
                    "score": knowledge_state['score'],
                    "questionsAnswered": len(knowledge_state['answered_questions']),
                    "totalQuestions": 10
                },
                "analysis": {
                    "strengths": ["Topic mastery analysis would go here"],
                    "weaknesses": ["Areas for improvement would go here"],
                    "overallScore": knowledge_state['score'] / 10
                }
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
        
        return {
            "correct": is_correct,
            "feedback": {
                "isCorrect": is_correct,
                "explanation": question.get('explanation', '')
            },
            "next_question": next_question,
            "knowledge_state": knowledge_state,
            "completed": False,
            "progress": {
                "score": knowledge_state['score'],
                "questionsAnswered": len(knowledge_state['answered_questions']),
                "totalQuestions": 10,
                "currentDifficulty": knowledge_state['level']
            }
        }
        
    except Exception as e:
        print(f"Error submitting answer: {e}")
        traceback.print_exc()
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/api/test-connection")
async def test_connection():
    """Test the API connection"""
    return {"status": "connected", "message": "API connection successful"}

@router.get("/api/load-questions")
async def load_questions():
    """Load all questions"""
    try:
        questions = question_service.get_questions()
        return {"questions": questions, "count": len(questions)}
    except Exception as e:
        print(f"Error loading questions: {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/api/demo")
async def demo():
    """Demo endpoint for feature showcase"""
    return {
        "status": "success",
        "message": "Demo endpoint accessed successfully",
        "features": [
            "Adaptive question selection",
            "AI-powered question generation",
            "Real-time feedback",
            "Performance analytics"
        ]
    } 