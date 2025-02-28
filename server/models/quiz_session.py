from datetime import datetime
from typing import Dict, Set, List, Optional
from services.adaptive_selector import AdaptiveSelector
from services.analysis_service import AnalysisService
from config.mongodb import MongoDB
from bson.objectid import ObjectId

class QuizSession:
    def __init__(self, session_id: int, total_questions: int = 10):
        self.session_id = session_id
        self.selector = AdaptiveSelector()
        self.questions_asked = set()
        self.current_streak = 0
        self.total_questions = total_questions
        self.questions_answered = 0
        self.correct_answers = 0
        self.topic_performance = {
            "Basic Python Syntax": {"attempts": 0, "correct": 0},
            "Data Types": {"attempts": 0, "correct": 0},
            "Control Flow": {"attempts": 0, "correct": 0},
            "Functions": {"attempts": 0, "correct": 0},
            "OOP": {"attempts": 0, "correct": 0}
        }
        self.start_time = datetime.now()
        self.response_times = []
        self.current_question = None
        self.knowledge_state = self.selector.knowledge_state
        self.analysis_service = AnalysisService()

    @property
    def is_completed(self) -> bool:
        """Check if the quiz is completed based on questions answered"""
        # Only consider the quiz completed when we've answered the required number of questions
        return self.questions_answered >= self.total_questions

    @property
    def accuracy(self) -> float:
        if self.questions_answered == 0:
            return 0.0
        return self.correct_answers / self.questions_answered

    def update_performance(self, topic: str, is_correct: bool, response_time: float):
        """Update session performance metrics"""
        self.questions_answered += 1
        self.response_times.append(response_time)

        if is_correct:
            self.correct_answers += 1
            self.current_streak += 1
        else:
            self.current_streak = 0

        if topic in self.topic_performance:
            self.topic_performance[topic]["attempts"] += 1
            if is_correct:
                self.topic_performance[topic]["correct"] += 1

        # Update knowledge state
        if topic in self.knowledge_state:
            current_level = self.knowledge_state[topic]["level"]
            impact = 0.1 if is_correct else -0.05
            new_level = max(0.0, min(1.0, current_level + impact))
            self.knowledge_state[topic]["level"] = new_level
            self.knowledge_state[topic]["status"] = self._get_status(new_level)

    def get_session_stats(self) -> Dict:
        """Get comprehensive session statistics"""
        base_stats = {
            "total_questions": self.total_questions,
            "questions_answered": self.questions_answered,
            "correct_answers": self.correct_answers,
            "accuracy": self.accuracy,
            "current_streak": self.current_streak,
            "avg_response_time": sum(self.response_times) / len(self.response_times) if self.response_times else 0,
            "topic_performance": self.topic_performance,
            "knowledge_state": self.knowledge_state,
            "time_elapsed": (datetime.now() - self.start_time).total_seconds(),
            "response_times": self.response_times  # Add this for analysis
        }

        # Add detailed analysis
        analysis = self.analysis_service.analyze_session(base_stats)
        base_stats["analysis"] = analysis

        return base_stats

    async def process_answer(self, is_correct: bool, selected_answer: int):
        try:
            if not self.current_question:
                raise Exception("No current question set")

            # Add current question to asked set
            if '_id' in self.current_question:
                self.questions_asked.add(str(self.current_question['_id']))

            # Update streak but don't increment questions_answered here
            # since update_performance already does that
            if is_correct:
                self.current_streak += 1
            else:
                self.current_streak = 0

            # Get next question if not completed
            if not self.is_completed:
                next_question = await self._get_next_question()
                if next_question:
                    self.current_question = next_question
                return next_question
            return None

        except Exception as e:
            print(f"Error in process_answer: {e}")
            return None

    def _get_status(self, level: float) -> str:
        if level >= 0.8:
            return "Mastered"
        elif level >= 0.5:
            return "Learning"
        else:
            return "New"

    async def _get_next_question(self):
        try:
            db = await MongoDB.get_db()
            # Get a question that hasn't been asked yet
            next_question = await db.questions.aggregate([
                {"$match": {"_id": {"$nin": [ObjectId(id) for id in self.questions_asked]}}},
                {"$sample": {"size": 1}}
            ]).to_list(length=1)

            if next_question:
                question = next_question[0]
                question["_id"] = str(question["_id"])
                return question
            return None

        except Exception as e:
            print(f"Error getting next question: {e}")
            return None 