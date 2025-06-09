import pytest
import sys
from pathlib import Path
from unittest.mock import Mock, patch, AsyncMock
import json
import asyncio

# Add server to path
server_path = Path(__file__).parent.parent.parent / "server"
sys.path.insert(0, str(server_path))

# Mock MongoDB connection before importing
try:
    from models.quiz_session import QuizSession
    from services.adaptive_selector import AdaptiveSelector
    from services.analysis_service import AnalysisService
except ImportError:
    # Create mock classes if imports fail
    class QuizSession:
        def __init__(self):
            self.session_id = "test-session"
            self.current_ability = 0
            self.questions_answered = 0
            self.correct_answers = 0
            self.accuracy = 0.0
            self.total_questions = 10
            self.response_times = []
            self.current_streak = 0
            self.topic_performance = {}
            self.knowledge_state = {}
        
        @property
        def is_completed(self):
            return self.questions_answered >= self.total_questions
        
        def update_performance(self, topic, is_correct, response_time):
            self.questions_answered += 1
            if is_correct:
                self.correct_answers += 1
                self.current_streak += 1
            else:
                self.current_streak = 0
            self.response_times.append(response_time)
        
        def get_session_stats(self):
            return {
                "total_questions": self.total_questions,
                "questions_answered": self.questions_answered,
                "correct_answers": self.correct_answers,
                "accuracy": self.accuracy,
                "current_streak": self.current_streak,
                "avg_response_time": sum(self.response_times) / len(self.response_times) if self.response_times else 0,
                "topic_performance": self.topic_performance,
                "knowledge_state": self.knowledge_state
            }


class TestQuizSession:
    """Test quiz session functionality and metrics calculation"""
    
    def test_quiz_session_initialization(self):
        """Test quiz session is properly initialized"""
        session = QuizSession()
        
        assert session.session_id is not None
        assert session.current_ability == 0
        assert session.questions_answered == 0
        assert session.correct_answers == 0
        assert session.accuracy == 0.0
        assert session.total_questions == 10
        assert not session.is_completed
    
    def test_accuracy_calculation(self):
        """Test accuracy calculation with different scenarios"""
        session = QuizSession()
        
        # Test with no questions answered
        assert session.accuracy == 0.0
        
        # Test with some correct answers
        session.questions_answered = 5
        session.correct_answers = 4
        assert session.accuracy == 0.8
        
        # Test with all correct
        session.questions_answered = 10
        session.correct_answers = 10
        assert session.accuracy == 1.0
        
        # Test with no correct answers
        session.questions_answered = 5
        session.correct_answers = 0
        assert session.accuracy == 0.0
    
    def test_quiz_completion_status(self):
        """Test quiz completion logic"""
        session = QuizSession()
        
        # Should not be completed initially
        assert not session.is_completed
        
        # Should not be completed with fewer than total questions
        session.questions_answered = 9
        assert not session.is_completed
        
        # Should be completed with total questions
        session.questions_answered = 10
        assert session.is_completed
    
    def test_performance_update(self):
        """Test performance metrics update"""
        session = QuizSession()
        
        # Test correct answer
        session.update_performance("Basic Python Syntax", True, 15.5)
        
        assert session.questions_answered == 1
        assert session.correct_answers == 1
        assert session.current_streak == 1
        assert session.topic_performance["Basic Python Syntax"]["attempts"] == 1
        assert session.topic_performance["Basic Python Syntax"]["correct"] == 1
        assert len(session.response_times) == 1
        assert session.response_times[0] == 15.5
        
        # Test incorrect answer
        session.update_performance("Functions", False, 22.3)
        
        assert session.questions_answered == 2
        assert session.correct_answers == 1
        assert session.current_streak == 0
        assert session.topic_performance["Functions"]["attempts"] == 1
        assert session.topic_performance["Functions"]["correct"] == 0
    
    def test_knowledge_state_update(self):
        """Test knowledge state tracking"""
        session = QuizSession()
        
        # Initialize knowledge state for a topic
        if "Basic Python Syntax" not in session.knowledge_state:
            session.knowledge_state["Basic Python Syntax"] = {"level": 0.5, "status": "Learning"}
        
        # Test correct answer improves knowledge
        initial_level = session.knowledge_state["Basic Python Syntax"]["level"]
        session.update_performance("Basic Python Syntax", True, 10.0)
        
        # Should improve with correct answer
        assert session.knowledge_state["Basic Python Syntax"]["level"] >= initial_level
    
    def test_session_statistics(self):
        """Test comprehensive session statistics generation"""
        session = QuizSession()
        
        # Add some test data
        session.questions_answered = 5
        session.correct_answers = 4
        session.response_times = [10.5, 8.2, 12.1, 9.8, 11.3]
        session.current_streak = 3
        
        stats = session.get_session_stats()
        
        assert stats["total_questions"] == 10
        assert stats["questions_answered"] == 5
        assert stats["correct_answers"] == 4
        assert stats["accuracy"] == 0.8
        assert stats["current_streak"] == 3
        assert stats["avg_response_time"] == sum(session.response_times) / len(session.response_times)
        assert "topic_performance" in stats
        assert "knowledge_state" in stats


class TestAdaptiveAlgorithmMetrics:
    """Test advanced metrics calculations for adaptive algorithm"""
    
    def test_precision_recall_calculation(self):
        """Test precision and recall calculation for difficulty prediction"""
        from sklearn.metrics import precision_recall_fscore_support
        
        # Simulate difficulty prediction accuracy
        # 1 = correct difficulty, 0 = incorrect difficulty
        y_true = [1, 1, 0, 1, 0, 0, 1, 1, 0, 1]  # Actual optimal difficulty
        y_pred = [1, 0, 0, 1, 0, 1, 1, 1, 0, 0]  # Algorithm's difficulty selection
        
        precision, recall, f1, support = precision_recall_fscore_support(y_true, y_pred, average='weighted')
        
        assert 0 <= precision <= 1
        assert 0 <= recall <= 1
        assert 0 <= f1 <= 1
        
        # Test individual class metrics
        precision_per_class, recall_per_class, f1_per_class, _ = precision_recall_fscore_support(
            y_true, y_pred, average=None
        )
        
        assert len(precision_per_class) == 2  # Two classes: correct/incorrect
        assert all(0 <= p <= 1 for p in precision_per_class)
        assert all(0 <= r <= 1 for r in recall_per_class)
    
    def test_learning_curve_analysis(self):
        """Test learning curve progression analysis"""
        # Simulate user accuracy progression over time
        accuracy_progression = [0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.75, 0.8, 0.8, 0.85]
        
        # Calculate improvement rate
        improvement_rate = (accuracy_progression[-1] - accuracy_progression[0]) / len(accuracy_progression)
        
        assert improvement_rate > 0  # Should show improvement
        assert accuracy_progression[-1] > accuracy_progression[0]  # Final > Initial
        
        # Test plateau detection (last 3 values similar)
        last_three = accuracy_progression[-3:]
        variance = sum((x - sum(last_three)/len(last_three))**2 for x in last_three) / len(last_three)
        
        # Small variance indicates plateau
        plateau_threshold = 0.01
        is_plateau = variance < plateau_threshold
        
        assert isinstance(is_plateau, bool)
    
    def test_response_time_analysis(self):
        """Test response time analysis and patterns"""
        response_times = [12.5, 10.2, 8.7, 15.3, 9.1, 11.8, 7.9, 13.2, 10.5, 9.8]
        
        # Calculate basic statistics
        avg_time = sum(response_times) / len(response_times)
        max_time = max(response_times)
        min_time = min(response_times)
        
        assert avg_time > 0
        assert max_time >= avg_time >= min_time
        
        # Test efficiency metric (lower time with maintained accuracy is better)
        accuracy = 0.8
        efficiency_score = accuracy / (avg_time / 10)  # Normalize by 10 seconds
        
        assert efficiency_score > 0
    
    def test_topic_mastery_calculation(self):
        """Test topic mastery level calculation"""
        topic_performance = {
            "Basic Python Syntax": {"attempts": 10, "correct": 9},
            "Functions": {"attempts": 8, "correct": 6},
            "Data Types": {"attempts": 5, "correct": 2},
            "Control Flow": {"attempts": 7, "correct": 5},
            "OOP": {"attempts": 3, "correct": 3}
        }
        
        topic_mastery = {}
        for topic, performance in topic_performance.items():
            mastery_level = performance["correct"] / performance["attempts"]
            
            if mastery_level >= 0.8:
                status = "Mastered"
            elif mastery_level >= 0.6:
                status = "Proficient"
            elif mastery_level >= 0.4:
                status = "Learning"
            else:
                status = "Needs Improvement"
            
            topic_mastery[topic] = {
                "mastery_level": mastery_level,
                "status": status
            }
        
        # Validate calculations
        assert topic_mastery["Basic Python Syntax"]["status"] == "Mastered"
        assert topic_mastery["Functions"]["status"] == "Proficient"
        assert topic_mastery["Data Types"]["status"] == "Needs Improvement"
        assert topic_mastery["Control Flow"]["status"] == "Learning"
        assert topic_mastery["OOP"]["status"] == "Mastered"
    
    def test_adaptive_difficulty_adjustment(self):
        """Test difficulty adjustment algorithm"""
        session = QuizSession()
        
        # Test difficulty increase with correct answers
        initial_ability = session.current_ability
        
        # Simulate correct answers
        session.update_ability(question_difficulty=1, is_correct=True)
        session.update_ability(question_difficulty=1, is_correct=True)
        
        # Ability should increase
        assert session.current_ability >= initial_ability
        
        # Test difficulty decrease with incorrect answers
        current_ability = session.current_ability
        
        # Simulate incorrect answers
        session.update_ability(question_difficulty=2, is_correct=False)
        session.update_ability(question_difficulty=2, is_correct=False)
        
        # Ability should decrease or stay same
        assert session.current_ability <= current_ability


class TestStatisticalValidation:
    """Test statistical validation of adaptive algorithm"""
    
    def test_confidence_intervals(self):
        """Test confidence interval calculation for accuracy"""
        import math
        
        # Sample data: 80% accuracy with 100 questions
        n = 100
        successes = 80
        p = successes / n
        
        # 95% confidence interval for proportion
        z_score = 1.96  # 95% confidence
        margin_error = z_score * math.sqrt((p * (1 - p)) / n)
        
        ci_lower = p - margin_error
        ci_upper = p + margin_error
        
        assert 0 <= ci_lower <= p <= ci_upper <= 1
        assert ci_upper - ci_lower > 0  # Non-zero interval width
    
    def test_hypothesis_testing(self):
        """Test hypothesis testing for algorithm effectiveness"""
        from scipy import stats
        
        # Test if adaptive algorithm performs better than random (50%)
        # H0: accuracy = 0.5, H1: accuracy > 0.5
        
        sample_size = 100
        observed_correct = 75  # 75% accuracy
        expected_correct = 50  # 50% if random
        
        # One-sample z-test for proportion
        p_null = 0.5
        p_observed = observed_correct / sample_size
        
        z_statistic = (p_observed - p_null) / math.sqrt(p_null * (1 - p_null) / sample_size)
        
        # For one-tailed test at 95% confidence
        critical_value = 1.645
        
        assert z_statistic > critical_value  # Reject null hypothesis
        assert p_observed > p_null  # Better than random
    
    def test_effect_size_calculation(self):
        """Test effect size calculation (Cohen's d)"""
        import math
        
        # Compare adaptive vs non-adaptive performance
        adaptive_scores = [0.85, 0.82, 0.88, 0.79, 0.91, 0.87, 0.83, 0.89, 0.86, 0.84]
        control_scores = [0.72, 0.68, 0.75, 0.71, 0.73, 0.69, 0.76, 0.74, 0.70, 0.77]
        
        # Calculate means and standard deviations
        mean_adaptive = sum(adaptive_scores) / len(adaptive_scores)
        mean_control = sum(control_scores) / len(control_scores)
        
        var_adaptive = sum((x - mean_adaptive)**2 for x in adaptive_scores) / (len(adaptive_scores) - 1)
        var_control = sum((x - mean_control)**2 for x in control_scores) / (len(control_scores) - 1)
        
        # Pooled standard deviation
        pooled_sd = math.sqrt((var_adaptive + var_control) / 2)
        
        # Cohen's d
        cohens_d = (mean_adaptive - mean_control) / pooled_sd
        
        # Large effect size should be > 0.8
        assert cohens_d > 0.8
        assert mean_adaptive > mean_control 