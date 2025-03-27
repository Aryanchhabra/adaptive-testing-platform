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
            for doc in cursor:
                # Convert MongoDB _id to string
                if '_id' in doc:
                    doc['_id'] = str(doc['_id'])
                    
                # Convert question_id back to id for client
                if 'question_id' in doc:
                    doc['id'] = doc.pop('question_id')
                elif '_id' in doc and 'id' not in doc:
                    doc['id'] = doc['_id']
                    
                # Ensure correct field names for client
                if 'correct_answer' in doc and 'correctAnswer' not in doc:
                    doc['correctAnswer'] = doc['correct_answer']
                    
                questions.append(doc)
                
            return questions
            
        except Exception as e:
            print(f"Error getting questions: {e}")
            traceback.print_exc()
            return []
            
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
                
            # Convert MongoDB _id to string
            if '_id' in doc:
                doc['_id'] = str(doc['_id'])
                
            # Convert question_id back to id for client
            if 'question_id' in doc:
                doc['id'] = doc.pop('question_id')
            elif '_id' in doc and 'id' not in doc:
                doc['id'] = doc['_id']
                
            # Ensure correct field names for client
            if 'correct_answer' in doc and 'correctAnswer' not in doc:
                doc['correctAnswer'] = doc['correct_answer']
                
            return doc
            
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