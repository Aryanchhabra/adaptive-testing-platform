"""
Analysis Service for Quiz Performance
Provides detailed analysis of quiz sessions and performance metrics
"""

import statistics
from typing import Dict, List, Any
from datetime import datetime


class AnalysisService:
    """
    Service for analyzing quiz performance and generating insights
    """
    
    def __init__(self):
        pass
    
    def analyze_session(self, session_stats: Dict) -> Dict:
        """
        Analyze a complete quiz session
        
        Args:
            session_stats: Dictionary containing session statistics
            
        Returns:
            Analysis results with insights and recommendations
        """
        analysis = {
            "performance_level": self._classify_performance(session_stats.get("accuracy", 0)),
            "learning_pattern": self._analyze_learning_pattern(session_stats),
            "time_efficiency": self._analyze_time_efficiency(session_stats),
            "topic_insights": self._analyze_topic_performance(session_stats.get("topic_performance", {})),
            "recommendations": self._generate_recommendations(session_stats),
            "difficulty_progression": self._analyze_difficulty_progression(session_stats),
            "engagement_metrics": self._calculate_engagement_metrics(session_stats)
        }
        
        return analysis
    
    def _classify_performance(self, accuracy: float) -> str:
        """Classify performance level based on accuracy"""
        if accuracy >= 0.9:
            return "Excellent"
        elif accuracy >= 0.8:
            return "Very Good"
        elif accuracy >= 0.7:
            return "Good"
        elif accuracy >= 0.6:
            return "Fair"
        elif accuracy >= 0.5:
            return "Needs Improvement"
        else:
            return "Requires Attention"
    
    def _analyze_learning_pattern(self, stats: Dict) -> Dict:
        """Analyze learning patterns from the session"""
        response_times = stats.get("response_times", [])
        current_streak = stats.get("current_streak", 0)
        
        pattern = {
            "consistency": "stable" if len(set(response_times[-5:])) <= 3 else "variable",
            "improvement_trend": "improving" if current_streak > 2 else "needs_focus",
            "response_stability": self._calculate_response_stability(response_times)
        }
        
        return pattern
    
    def _calculate_response_stability(self, response_times: List[float]) -> str:
        """Calculate stability of response times"""
        if len(response_times) < 3:
            return "insufficient_data"
            
        try:
            std_dev = statistics.stdev(response_times)
            mean_time = statistics.mean(response_times)
            
            coefficient_of_variation = std_dev / mean_time if mean_time > 0 else 1
            
            if coefficient_of_variation < 0.2:
                return "very_stable"
            elif coefficient_of_variation < 0.4:
                return "stable"
            elif coefficient_of_variation < 0.6:
                return "moderate"
            else:
                return "variable"
        except statistics.StatisticsError:
            return "insufficient_data"
    
    def _analyze_time_efficiency(self, stats: Dict) -> Dict:
        """Analyze time efficiency metrics"""
        avg_time = stats.get("avg_response_time", 0)
        total_questions = stats.get("questions_answered", 0)
        
        # Ideal response time thresholds (in seconds)
        ideal_time_range = (10, 30)  # 10-30 seconds per question
        
        efficiency = {
            "avg_response_time": avg_time,
            "time_classification": self._classify_response_time(avg_time),
            "total_time_spent": avg_time * total_questions,
            "efficiency_score": self._calculate_efficiency_score(avg_time, stats.get("accuracy", 0))
        }
        
        return efficiency
    
    def _classify_response_time(self, avg_time: float) -> str:
        """Classify response time"""
        if avg_time < 5:
            return "too_fast"
        elif avg_time <= 15:
            return "optimal"
        elif avg_time <= 30:
            return "good"
        elif avg_time <= 60:
            return "slow"
        else:
            return "too_slow"
    
    def _calculate_efficiency_score(self, avg_time: float, accuracy: float) -> float:
        """Calculate efficiency score (balance of speed and accuracy)"""
        # Optimal time range: 10-30 seconds
        time_score = 1.0
        if avg_time < 10:
            time_score = 0.7  # Too fast might indicate guessing
        elif avg_time > 30:
            time_score = max(0.3, 1.0 - (avg_time - 30) / 60)  # Penalty for being too slow
        
        # Combine time and accuracy (weighted)
        efficiency = (accuracy * 0.7) + (time_score * 0.3)
        return round(efficiency, 3)
    
    def _analyze_topic_performance(self, topic_performance: Dict) -> Dict:
        """Analyze performance by topic"""
        insights = {}
        
        for topic, data in topic_performance.items():
            attempts = data.get("attempts", 0)
            correct = data.get("correct", 0)
            
            if attempts > 0:
                accuracy = correct / attempts
                insights[topic] = {
                    "accuracy": round(accuracy, 3),
                    "attempts": attempts,
                    "mastery_level": self._classify_topic_mastery(accuracy, attempts),
                    "confidence": "high" if attempts >= 3 else "low"
                }
        
        return insights
    
    def _classify_topic_mastery(self, accuracy: float, attempts: int) -> str:
        """Classify mastery level for a topic"""
        if attempts < 2:
            return "insufficient_data"
        elif accuracy >= 0.8:
            return "mastered"
        elif accuracy >= 0.6:
            return "proficient"
        elif accuracy >= 0.4:
            return "developing"
        else:
            return "needs_practice"
    
    def _analyze_difficulty_progression(self, stats: Dict) -> Dict:
        """Analyze how well the user adapted to difficulty changes"""
        # This would require more detailed question-by-question data
        # For now, provide basic analysis
        accuracy = stats.get("accuracy", 0)
        questions_answered = stats.get("questions_answered", 0)
        
        progression = {
            "adaptation_score": accuracy,  # Simplified
            "difficulty_handling": "good" if accuracy > 0.7 else "challenging",
            "readiness_for_harder": accuracy > 0.8 and questions_answered >= 5
        }
        
        return progression
    
    def _calculate_engagement_metrics(self, stats: Dict) -> Dict:
        """Calculate engagement and focus metrics"""
        response_times = stats.get("response_times", [])
        accuracy = stats.get("accuracy", 0)
        current_streak = stats.get("current_streak", 0)
        
        # Calculate engagement based on consistency and performance
        engagement_score = 0.0
        
        if response_times:
            # Consistent response times indicate engagement
            consistency_bonus = 0.3 if len(set([int(t/5)*5 for t in response_times])) <= 3 else 0.1
            engagement_score += consistency_bonus
        
        # High accuracy indicates focus
        engagement_score += accuracy * 0.4
        
        # Streaks indicate sustained attention
        streak_bonus = min(0.3, current_streak * 0.05)
        engagement_score += streak_bonus
        
        metrics = {
            "engagement_score": round(engagement_score, 2),
            "focus_level": "high" if engagement_score > 0.7 else "moderate" if engagement_score > 0.4 else "low",
            "consistency_indicator": len(response_times) > 0 and statistics.stdev(response_times) < 10 if len(response_times) > 1 else False
        }
        
        return metrics
    
    def _generate_recommendations(self, stats: Dict) -> List[str]:
        """Generate personalized recommendations"""
        recommendations = []
        accuracy = stats.get("accuracy", 0)
        avg_time = stats.get("avg_response_time", 0)
        topic_performance = stats.get("topic_performance", {})
        
        # Accuracy-based recommendations
        if accuracy < 0.6:
            recommendations.append("Focus on understanding fundamental concepts before attempting more questions")
        elif accuracy < 0.8:
            recommendations.append("Review incorrect answers to identify knowledge gaps")
        else:
            recommendations.append("Consider attempting higher difficulty questions to challenge yourself")
        
        # Time-based recommendations
        if avg_time < 10:
            recommendations.append("Take more time to read questions carefully to avoid careless mistakes")
        elif avg_time > 45:
            recommendations.append("Practice quick decision-making to improve response time")
        
        # Topic-specific recommendations
        weak_topics = []
        for topic, data in topic_performance.items():
            if data.get("attempts", 0) > 0:
                topic_accuracy = data["correct"] / data["attempts"]
                if topic_accuracy < 0.5:
                    weak_topics.append(topic)
        
        if weak_topics:
            recommendations.append(f"Focus additional study on: {', '.join(weak_topics)}")
        
        # General recommendations
        questions_answered = stats.get("questions_answered", 0)
        if questions_answered < 5:
            recommendations.append("Complete more questions to get a better assessment of your knowledge")
        
        return recommendations
    
    def calculate_learning_metrics(self, sessions_data: List[Dict]) -> Dict:
        """
        Calculate learning metrics across multiple sessions
        This is used for generating realistic metrics instead of fake user satisfaction
        """
        if not sessions_data:
            return {
                "completion_rate": 0.0,
                "average_improvement": 0.0,
                "knowledge_retention": 0.0,
                "engagement_level": 0.0
            }
        
        # Calculate completion rate
        completed_sessions = sum(1 for session in sessions_data if session.get("questions_answered", 0) >= session.get("total_questions", 10))
        completion_rate = completed_sessions / len(sessions_data) if sessions_data else 0.0
        
        # Calculate improvement trend
        accuracies = [session.get("accuracy", 0) for session in sessions_data]
        if len(accuracies) > 1:
            improvement = (accuracies[-1] - accuracies[0]) / max(accuracies[0], 0.1)
        else:
            improvement = 0.0
        
        # Calculate knowledge retention (consistency of performance)
        retention = 1.0 - (statistics.stdev(accuracies) if len(accuracies) > 1 else 0.0)
        retention = max(0.0, min(1.0, retention))
        
        # Calculate engagement (based on completion rates and response times)
        avg_engagement = statistics.mean([session.get("engagement_score", 0.5) for session in sessions_data])
        
        return {
            "completion_rate": round(completion_rate, 3),
            "average_improvement": round(improvement, 3), 
            "knowledge_retention": round(retention, 3),
            "engagement_level": round(avg_engagement, 3)
        } 