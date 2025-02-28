from typing import List, Dict, Optional
from models.question import Question, DifficultyLevel
from config.mongodb import MongoDB
from bson import ObjectId
import asyncio
from functools import lru_cache

class QuestionOperations:
    def __init__(self, db):
        self.db = db
        self._question_cache = {}
        self._stats_cache = {}
        self.cache_ttl = 300  # 5 minutes cache

    @staticmethod
    async def load_questions(questions: List[Dict]):
        try:
            db = await MongoDB.get_db()
            if db is None:
                raise Exception("Database connection not established")

            # Clear existing questions
            await db.questions.delete_many({})
            
            if questions:
                # Insert new questions
                result = await db.questions.insert_many(questions)
                return len(result.inserted_ids)
            return 0
        except Exception as e:
            print(f"Error in load_questions: {e}")
            raise

    @staticmethod
    async def get_questions_by_topic_and_difficulty(topic: str, difficulty: int, limit: int = 5):
        try:
            db = await MongoDB.get_db()
            if db is None:
                raise Exception("Database connection not established")

            cursor = db.questions.find({
                "topic": topic,
                "difficulty": difficulty
            }).limit(limit)
            
            questions = await cursor.to_list(length=limit)
            # Convert ObjectId to string
            for q in questions:
                if '_id' in q:
                    q['_id'] = str(q['_id'])
            return questions
            
        except Exception as e:
            print(f"Error in get_questions_by_topic_and_difficulty: {e}")
            raise

    @staticmethod
    async def get_random_question_by_criteria(topic: str, difficulty: int):
        try:
            db = await MongoDB.get_db()
            if db is None:
                raise Exception("Database connection not established")

            pipeline = [
                {"$match": {"topic": topic, "difficulty": difficulty}},
                {"$sample": {"size": 1}}
            ]
            cursor = db.questions.aggregate(pipeline)
            questions = await cursor.to_list(length=1)
            
            if questions:
                question = questions[0]
                # Convert ObjectId to string
                if '_id' in question:
                    question['_id'] = str(question['_id'])
                return question
            return None
            
        except Exception as e:
            print(f"Error in get_random_question_by_criteria: {e}")
            raise

    @staticmethod
    async def get_question_stats():
        try:
            db = await MongoDB.get_db()
            if db is None:
                raise Exception("Database connection not established")

            pipeline = [
                {
                    "$group": {
                        "_id": {
                            "topic": "$topic",
                            "difficulty": "$difficulty"
                        },
                        "count": {"$sum": 1}
                    }
                },
                {
                    "$group": {
                        "_id": "$_id.topic",
                        "difficulties": {
                            "$push": {
                                "level": "$_id.difficulty",
                                "count": "$count"
                            }
                        },
                        "total": {"$sum": "$count"}
                    }
                }
            ]
            return await db.questions.aggregate(pipeline).to_list(length=None)
        except Exception as e:
            print(f"Error in get_question_stats: {e}")
            raise

    @lru_cache(maxsize=32)
    async def get_question(
        self, 
        topic: str, 
        difficulty: DifficultyLevel,
        excluded_ids: tuple,  # Changed from List to tuple for caching
        knowledge_level: float
    ) -> Optional[Question]:
        cache_key = f"{topic}:{difficulty}:{knowledge_level}"
        
        # Check cache first
        if cache_key in self._question_cache:
            cached_data = self._question_cache[cache_key]
            if cached_data['timestamp'] + self.cache_ttl > asyncio.get_event_loop().time():
                questions = cached_data['data']
                # Filter out excluded questions
                valid_questions = [q for q in questions if str(q['_id']) not in excluded_ids]
                if valid_questions:
                    return Question(**valid_questions[0])

        # If not in cache or cache expired, query database
        pipeline = [
            {
                "$match": {
                    "topic": topic,
                    "difficulty": difficulty,
                    "_id": {"$nin": [ObjectId(id) for id in excluded_ids]},
                }
            },
            {
                "$addFields": {
                    "relevance_score": {
                        "$multiply": [
                            {"$abs": {"$subtract": ["$success_rate", knowledge_level]}},
                            {"$divide": [1, {"$add": ["$times_used", 1]}]}
                        ]
                    }
                }
            },
            {"$sort": {"relevance_score": -1}},
            {"$limit": 5}  # Cache more questions for future use
        ]

        results = await self.db.questions.aggregate(pipeline).to_list(5)
        if results:
            # Update cache
            self._question_cache[cache_key] = {
                'data': results,
                'timestamp': asyncio.get_event_loop().time()
            }
            return Question(**results[0])
        return None

    async def update_question_stats(
        self,
        question_id: str,
        is_correct: bool,
        response_time: float
    ):
        """Update question statistics after each attempt"""
        try:
            await self.db.questions.update_one(
                {"_id": question_id},
                {
                    "$inc": {
                        "times_attempted": 1,
                        "times_correct": 1 if is_correct else 0
                    },
                    "$push": {
                        "response_times": response_time
                    },
                    "$set": {
                        "success_rate": {
                            "$divide": [
                                "$times_correct",
                                "$times_attempted"
                            ]
                        }
                    }
                }
            )
        except Exception as e:
            print(f"Error updating question stats: {e}")

    async def get_random_question_by_criteria(
        self,
        topic: str,
        difficulty: int,
        excluded_ids: set = None,
        knowledge_level: float = 0.5
    ) -> Optional[Dict]:
        try:
            # Build advanced query
            pipeline = [
                {
                    "$match": {
                        "topic": topic,
                        "difficulty": difficulty,
                        "_id": {"$nin": list(excluded_ids)} if excluded_ids else {"$exists": True}
                    }
                },
                {
                    "$addFields": {
                        "adaptiveScore": {
                            "$add": [
                                # Weight based on question success rate vs student level
                                {"$multiply": [
                                    {"$subtract": [{"$ifNull": ["$success_rate", 0.5]}, knowledge_level]},
                                    2
                                ]},
                                # Prefer less frequently used questions
                                {"$multiply": [
                                    {"$divide": [1, {"$add": [{"$ifNull": ["$times_attempted", 0]}, 1]}]},
                                    0.5
                                ]}
                            ]
                        }
                    }
                },
                {"$sort": {"adaptiveScore": -1}},
                {"$limit": 3},  # Get top 3 most suitable questions
                {"$sample": {"size": 1}}  # Randomly select one of them
            ]

            async for question in self.db.questions.aggregate(pipeline):
                return question

            return None

        except Exception as e:
            print(f"Error getting random question: {e}")
            return None 

    async def get_questions_by_topic(self, topic: str) -> List[Dict]:
        """Get all questions for a specific topic"""
        try:
            cursor = self.db.questions.find({"topic": topic})
            questions = await cursor.to_list(length=None)
            return questions
        except Exception as e:
            print(f"Error getting questions by topic: {e}")
            return [] 