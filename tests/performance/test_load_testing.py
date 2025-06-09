from locust import HttpUser, task, between
import json
import random
import time


class QuizUser(HttpUser):
    """Simulates a user taking the adaptive quiz"""
    
    wait_time = between(1, 3)  # Wait 1-3 seconds between requests
    
    def on_start(self):
        """Called when a user starts - initialize session"""
        self.session_id = None
        self.knowledge_state = None
        self.current_question = None
        self.questions_answered = 0
        self.max_questions = 10
    
    @task(10)
    def start_quiz(self):
        """Start a new quiz session - highest weight as entry point"""
        if self.session_id is None:  # Only start if not already started
            with self.client.post("/api/quiz/start", catch_response=True) as response:
                if response.status_code == 200:
                    data = response.json()
                    self.session_id = data.get("session_id")
                    self.knowledge_state = data.get("knowledge_state")
                    self.current_question = data.get("question")
                    self.questions_answered = 0
                    response.success()
                else:
                    response.failure(f"Failed to start quiz: {response.status_code}")
    
    @task(20)
    def submit_answer(self):
        """Submit an answer to the current question"""
        if self.current_question and self.questions_answered < self.max_questions:
            # Simulate realistic user behavior - mix of correct/incorrect answers
            accuracy_rate = 0.7  # 70% accuracy simulation
            is_correct = random.random() < accuracy_rate
            
            if is_correct:
                selected_answer = self.current_question["correctAnswer"]
            else:
                # Choose a random wrong answer
                options_count = len(self.current_question["options"])
                correct = self.current_question["correctAnswer"]
                wrong_options = [i for i in range(options_count) if i != correct]
                selected_answer = random.choice(wrong_options) if wrong_options else correct
            
            submission_data = {
                "question": self.current_question,
                "answer": selected_answer,
                "knowledgeState": self.knowledge_state
            }
            
            with self.client.post("/api/quiz/submit", 
                                json=submission_data, 
                                catch_response=True) as response:
                if response.status_code == 200:
                    data = response.json()
                    self.knowledge_state = data.get("knowledge_state")
                    self.questions_answered += 1
                    
                    if data.get("completed", False):
                        # Quiz completed, reset for next session
                        self.session_id = None
                        self.current_question = None
                        response.success()
                    else:
                        self.current_question = data.get("next_question")
                        response.success()
                else:
                    response.failure(f"Failed to submit answer: {response.status_code}")
    
    @task(2)
    def check_health(self):
        """Periodically check system health"""
        with self.client.get("/api/health", catch_response=True) as response:
            if response.status_code in [200, 500]:  # 500 is acceptable for health check
                response.success()
            else:
                response.failure(f"Health check failed: {response.status_code}")
    
    @task(1)
    def test_connection(self):
        """Test connection endpoint"""
        with self.client.get("/api/test-connection", catch_response=True) as response:
            if response.status_code == 200:
                response.success()
            else:
                response.failure(f"Connection test failed: {response.status_code}")


class FastQuizUser(HttpUser):
    """Simulates a fast user (expert level) for stress testing"""
    
    wait_time = between(0.5, 1.5)  # Faster response times
    
    def on_start(self):
        self.session_id = None
        self.knowledge_state = None
        self.current_question = None
        self.questions_answered = 0
    
    @task
    def rapid_quiz_completion(self):
        """Complete quiz rapidly to test system under high frequency requests"""
        if self.session_id is None:
            # Start quiz
            response = self.client.post("/api/quiz/start")
            if response.status_code == 200:
                data = response.json()
                self.session_id = data.get("session_id")
                self.knowledge_state = data.get("knowledge_state")
                self.current_question = data.get("question")
        
        if self.current_question and self.questions_answered < 10:
            # Always choose correct answer (expert behavior)
            submission_data = {
                "question": self.current_question,
                "answer": self.current_question["correctAnswer"],
                "knowledgeState": self.knowledge_state
            }
            
            response = self.client.post("/api/quiz/submit", json=submission_data)
            if response.status_code == 200:
                data = response.json()
                self.knowledge_state = data.get("knowledge_state")
                self.questions_answered += 1
                
                if data.get("completed", False):
                    self.session_id = None
                    self.questions_answered = 0
                else:
                    self.current_question = data.get("next_question")


class SlowQuizUser(HttpUser):
    """Simulates a slow user (beginner level) for testing patience scenarios"""
    
    wait_time = between(5, 15)  # Much slower response times
    
    def on_start(self):
        self.session_id = None
        self.knowledge_state = None
        self.current_question = None
        self.questions_answered = 0
    
    @task
    def slow_quiz_completion(self):
        """Complete quiz slowly with more incorrect answers"""
        if self.session_id is None:
            response = self.client.post("/api/quiz/start")
            if response.status_code == 200:
                data = response.json()
                self.session_id = data.get("session_id")
                self.knowledge_state = data.get("knowledge_state")
                self.current_question = data.get("question")
        
        if self.current_question and self.questions_answered < 10:
            # Lower accuracy (beginner behavior)
            accuracy_rate = 0.4  # 40% accuracy
            is_correct = random.random() < accuracy_rate
            
            if is_correct:
                selected_answer = self.current_question["correctAnswer"]
            else:
                options_count = len(self.current_question["options"])
                correct = self.current_question["correctAnswer"]
                wrong_options = [i for i in range(options_count) if i != correct]
                selected_answer = random.choice(wrong_options) if wrong_options else correct
            
            submission_data = {
                "question": self.current_question,
                "answer": selected_answer,
                "knowledgeState": self.knowledge_state
            }
            
            response = self.client.post("/api/quiz/submit", json=submission_data)
            if response.status_code == 200:
                data = response.json()
                self.knowledge_state = data.get("knowledge_state")
                self.questions_answered += 1
                
                if data.get("completed", False):
                    self.session_id = None
                    self.questions_answered = 0
                else:
                    self.current_question = data.get("next_question")


# Performance test configuration
class PerformanceTestConfig:
    """Configuration for different performance test scenarios"""
    
    @staticmethod
    def light_load():
        """Light load test configuration"""
        return {
            "users": 10,
            "spawn_rate": 2,
            "run_time": "2m"
        }
    
    @staticmethod
    def medium_load():
        """Medium load test configuration"""
        return {
            "users": 50,
            "spawn_rate": 5,
            "run_time": "5m"
        }
    
    @staticmethod
    def heavy_load():
        """Heavy load test configuration"""
        return {
            "users": 100,
            "spawn_rate": 10,
            "run_time": "10m"
        }
    
    @staticmethod
    def stress_test():
        """Stress test configuration"""
        return {
            "users": 200,
            "spawn_rate": 20,
            "run_time": "5m"
        }


# Custom metrics collection
from locust.env import Environment
from locust.stats import stats_printer
import gevent


def collect_performance_metrics():
    """Collect and analyze performance metrics during load test"""
    metrics = {
        "response_times": [],
        "failure_rate": 0,
        "requests_per_second": 0,
        "concurrent_users": 0
    }
    
    return metrics


# Example usage and test scenarios
if __name__ == "__main__":
    """
    Run with:
    locust -f test_load_testing.py --host=http://localhost:5000
    
    Or programmatically:
    locust -f test_load_testing.py --host=http://localhost:5000 --users 50 --spawn-rate 5 --run-time 2m --headless
    """
    pass 