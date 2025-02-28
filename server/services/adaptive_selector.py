from typing import Dict, List, Optional
import numpy as np
from database.operations import QuestionOperations
from models.question import Question, DifficultyLevel
from scipy.stats import norm
from functools import lru_cache
import asyncio
from config.mongodb import MongoDB
import random

class AdaptiveSelector:
    def __init__(self, db_operations=None):
        self.db = db_operations
        self.difficulty_weights = {
            DifficultyLevel.BEGINNER: 1.0,
            DifficultyLevel.INTERMEDIATE: 1.5,
            DifficultyLevel.ADVANCED: 2.0
        }
        self.knowledge_state = {
            "Basic Python Syntax": {
                "level": 0.5,
                "status": "Learning",
                "explanation": "Building basic knowledge"
            },
            "Data Types": {
                "level": 0.5,
                "status": "Learning",
                "explanation": "Building basic knowledge"
            },
            "Control Flow": {
                "level": 0.5,
                "status": "Learning",
                "explanation": "Building basic knowledge"
            },
            "Functions": {
                "level": 0.5,
                "status": "Learning",
                "explanation": "Building basic knowledge"
            },
            "OOP": {
                "level": 0.5,
                "status": "Learning",
                "explanation": "Building basic knowledge"
            }
        }
        self._topic_cache = {}

    @lru_cache(maxsize=128)
    def _calculate_topic_weights(self, knowledge_state_tuple) -> Dict[str, float]:
        # Convert tuple back to dict for processing
        knowledge_state = dict(knowledge_state_tuple)
        weights = {}
        for topic, level in knowledge_state.items():
            gap = 1.0 - level
            weights[topic] = 1 / (1 + np.exp(-5 * gap))
        
        total = sum(weights.values())
        return {k: v/total for k, v in weights.items()}

    async def get_next_question(self, previous_response=None, excluded_questions=None) -> Dict:
        """Get next question based on current knowledge state"""
        try:
            db = await MongoDB.get_db()
            if not db:
                raise Exception("Database not connected")

            # Build query to exclude already asked questions
            query = {}
            if excluded_questions:
                query['_id'] = {'$nin': list(excluded_questions)}

            # Get all available questions that haven't been asked
            available_questions = await db.questions.find(query).to_list(None)
            
            # Check if we have any questions left
            if not available_questions:
                print("No more available questions")
                return None

            # Select question based on current knowledge state
            selected_question = None
            max_score = -1

            for question in available_questions:
                topic = question.get('topic')
                if not topic:
                    continue
                
                current_level = self.knowledge_state.get(topic, {}).get('level', 0.5)
                
                # Calculate selection score
                difficulty_match = 1 - abs(current_level - question.get('difficulty', 1)/3)
                score = difficulty_match + random.uniform(0, 0.2)  # Add some randomness
                
                if score > max_score:
                    max_score = score
                    selected_question = question

            if not selected_question:
                print("No suitable question found")
                return None

            return {
                'question': selected_question,
                'knowledge_state': self.knowledge_state
            }

        except Exception as e:
            print(f"Error in get_next_question: {e}")
            return None

    def _select_topic(self, weights: Dict[str, float]) -> str:
        topics = list(weights.keys())
        probabilities = list(weights.values())
        return np.random.choice(topics, p=probabilities)

    def _determine_difficulty(self, knowledge_level: float) -> DifficultyLevel:
        if knowledge_level < 0.4:
            return DifficultyLevel.BEGINNER
        elif knowledge_level < 0.7:
            return DifficultyLevel.INTERMEDIATE
        else:
            return DifficultyLevel.ADVANCED 

    def _generate_topic_feedback(self, topic: str, level: float) -> str:
        if level >= 0.8:
            return f"Excellent understanding of {topic}! Ready for advanced concepts."
        elif level >= 0.6:
            return f"Good grasp of {topic}. Focus on mastering complex scenarios."
        elif level >= 0.4:
            return f"Making progress in {topic}. Keep practicing fundamentals."
        else:
            return f"Building basic knowledge of {topic}. Focus on core concepts." 