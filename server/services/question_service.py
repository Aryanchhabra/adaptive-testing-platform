import os
import json
from typing import List, Dict, Optional, Any
from models.question import Question
from database.mongodb import get_db
from bson import ObjectId
import traceback

class QuestionService:
    def __init__(self):
        """Initialize the question service with MongoDB connection"""
        self.db = get_db()
        self.collection = self.db.questions
        print(f"QuestionService initialized with MongoDB collection: questions")
        
    def add_question(self, question: Question) -> str:
        """Add a question to the database"""
        try:
            # Convert question to dictionary
            question_dict = question.to_dict()
            
            # MongoDB doesn't like IDs with special characters, so we'll use our own
            if 'id' in question_dict:
                question_dict['question_id'] = question_dict.pop('id')
                
            # Insert the question
            result = self.collection.insert_one(question_dict)
            
            # Return the inserted ID
            return question.id
            
        except Exception as e:
            print(f"Error adding question: {e}")
            traceback.print_exc()
            return None
            
    def get_questions(self, topic: Optional[str] = None, difficulty: Optional[int] = None) -> List[Dict[str, Any]]:
        """Get questions with optional filtering"""
        try:
            # Build query
            query = {}
            
            if topic:
                query['topic'] = topic
                
            if difficulty:
                query['difficulty'] = difficulty
                
            # Execute query
            cursor = self.collection.find(query)
            
            # Convert to list of dictionaries
            questions = []
            question_count = 0
            for doc in cursor:
                question_count += 1
                try:
                    sanitized_doc = self._sanitize_document(doc)
                    questions.append(sanitized_doc)
                    # Test JSON serialization
                    json.dumps(sanitized_doc)
                except Exception as serialization_error:
                    print(f"Error sanitizing question {doc.get('_id', 'unknown')}: {serialization_error}")
                    # Skip this document if it cannot be serialized
            
            print(f"Processed {question_count} questions, returning {len(questions)} valid questions")
            return questions
            
        except Exception as e:
            print(f"Error getting questions: {e}")
            traceback.print_exc()
            return []
    
    def _sanitize_document(self, doc: Dict[str, Any]) -> Dict[str, Any]:
        """Convert MongoDB document to JSON-serializable dict"""
        # Make a copy to avoid modifying the original
        result = {}
        
        # Process each field
        for key, value in doc.items():
            # Convert ObjectId to string
            if isinstance(value, ObjectId):
                result[key] = str(value)
            # Handle nested dictionaries
            elif isinstance(value, dict):
                result[key] = self._sanitize_document(value)
            # Handle lists (which might contain dictionaries or ObjectIds)
            elif isinstance(value, list):
                result[key] = [
                    self._sanitize_document(item) if isinstance(item, dict) 
                    else str(item) if isinstance(item, ObjectId)
                    else item
                    for item in value
                ]
            else:
                result[key] = value
        
        # Convert MongoDB _id to string
        if '_id' in result:
            result['_id'] = str(result['_id'])
            
        # Convert question_id back to id for client
        if 'question_id' in result:
            result['id'] = result.pop('question_id')
        elif '_id' in result and 'id' not in result:
            result['id'] = result['_id']
            
        # Ensure correct field names for client
        if 'correct_answer' in result and 'correctAnswer' not in result:
            result['correctAnswer'] = result['correct_answer']
            
        return result
            
    def get_question_by_id(self, question_id: str) -> Optional[Dict[str, Any]]:
        """Get a question by ID"""
        try:
            # Try to find by question_id field
            doc = self.collection.find_one({'question_id': question_id})
            
            # If not found, try by _id
            if not doc:
                # Try to convert to ObjectId if it's in that format
                try:
                    obj_id = ObjectId(question_id)
                    doc = self.collection.find_one({'_id': obj_id})
                except:
                    # Not a valid ObjectId, try as string
                    doc = self.collection.find_one({'_id': question_id})
                    
            if not doc:
                return None
                
            return self._sanitize_document(doc)
            
        except Exception as e:
            print(f"Error getting question by ID: {e}")
            traceback.print_exc()
            return None
            
    def delete_question(self, question_id: str) -> bool:
        """Delete a question by ID"""
        try:
            # Try to delete by question_id field
            result = self.collection.delete_one({'question_id': question_id})
            
            # If not found, try by _id
            if result.deleted_count == 0:
                # Try to convert to ObjectId if it's in that format
                try:
                    obj_id = ObjectId(question_id)
                    result = self.collection.delete_one({'_id': obj_id})
                except:
                    # Not a valid ObjectId, try as string
                    result = self.collection.delete_one({'_id': question_id})
                    
            # Return True if a document was deleted
            return result.deleted_count > 0
            
        except Exception as e:
            print(f"Error deleting question: {e}")
            traceback.print_exc()
            return False 