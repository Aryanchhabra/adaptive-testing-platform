from typing import Dict, List
import numpy as np
from scipy import stats
from datetime import datetime

class AnalysisService:
    def __init__(self):
        self.performance_weights = {
            'accuracy': 0.4,
            'time_efficiency': 0.2,
            'consistency': 0.2,
            'difficulty_handling': 0.2
        }

    def analyze_session(self, session_data):
        """Analyze quiz session data and provide insights"""
        try:
            # Basic stats
            questions_answered = session_data.get('questions_answered', 0)
            correct_answers = session_data.get('correct_answers', 0)
            accuracy = session_data.get('accuracy', 0)
            
            if questions_answered == 0:
                return {
                    "overall_assessment": "Not enough data to analyze.",
                    "recommendations": ["Complete more questions for personalized feedback."]
                }
            
            # Topic analysis
            topic_performance = session_data.get('topic_performance', {})
            knowledge_state = session_data.get('knowledge_state', {})
            
            # Find strengths and weaknesses
            strengths = []
            weaknesses = []
            
            for topic, data in topic_performance.items():
                attempts = data.get('attempts', 0)
                if attempts > 0:
                    topic_accuracy = data.get('correct', 0) / attempts
                    if topic_accuracy >= 0.7:
                        strengths.append(topic)
                    elif topic_accuracy <= 0.4:
                        weaknesses.append(topic)
            
            # Response time analysis
            response_times = session_data.get('response_times', [])
            avg_response_time = sum(response_times) / len(response_times) if response_times else 0
            
            # Generate recommendations
            recommendations = []
            
            if weaknesses:
                for topic in weaknesses:
                    recommendations.append(f"Focus on improving your understanding of {topic}.")
            
            if avg_response_time > 15:  # If average response time is over 15 seconds
                recommendations.append("Try to improve your response time by practicing more frequently.")
            
            if accuracy < 0.5:
                recommendations.append("Review the basic concepts before moving to advanced topics.")
            elif accuracy >= 0.8:
                recommendations.append("You're doing great! Consider exploring more advanced topics.")
            
            # Overall assessment
            overall = self._get_overall_assessment(accuracy, strengths, weaknesses)
            
            return {
                "overall_assessment": overall,
                "strengths": strengths,
                "weaknesses": weaknesses,
                "recommendations": recommendations,
                "response_time_analysis": {
                    "average": avg_response_time,
                    "consistency": self._calculate_time_consistency(response_times)
                }
            }
        except Exception as e:
            print(f"Error in analysis: {e}")
            return {
                "overall_assessment": "Analysis could not be completed.",
                "error": str(e)
            }
    
    def _get_overall_assessment(self, accuracy, strengths, weaknesses):
        """Generate an overall assessment based on performance"""
        if accuracy >= 0.8:
            return "Excellent performance! You have a strong understanding of the material."
        elif accuracy >= 0.6:
            return "Good performance. You understand most concepts but have some areas to improve."
        elif accuracy >= 0.4:
            return "Fair performance. You should focus on strengthening your understanding of key concepts."
        else:
            return "You're just getting started. Focus on building a solid foundation of the basics."
    
    def _calculate_time_consistency(self, times):
        """Calculate how consistent the response times are"""
        if not times or len(times) < 2:
            return 1.0
        
        mean_time = sum(times) / len(times)
        if mean_time == 0:
            return 1.0
            
        # Calculate standard deviation
        variance = sum((t - mean_time) ** 2 for t in times) / len(times)
        std_dev = variance ** 0.5
        
        # Normalize to a 0-1 scale (lower std_dev means higher consistency)
        consistency = 1.0 - min(1.0, std_dev / (mean_time + 1))
        return consistency

    def _analyze_topics(self, topic_performance: Dict) -> Dict:
        topic_scores = {}
        strong_areas = []
        weak_areas = []

        for topic, data in topic_performance.items():
            score = (data['correct'] / data['attempts']) if data['attempts'] > 0 else 0
            time_efficiency = 1 / (data['avg_time'] + 1)  # Normalize time
            
            # Combined score considering both accuracy and time
            topic_scores[topic] = 0.7 * score + 0.3 * time_efficiency
            
            if topic_scores[topic] >= 0.7:
                strong_areas.append({
                    "topic": topic,
                    "score": topic_scores[topic],
                    "mastery_level": "High"
                })
            elif topic_scores[topic] <= 0.4:
                weak_areas.append({
                    "topic": topic,
                    "score": topic_scores[topic],
                    "mastery_level": "Needs Improvement"
                })

        return {
            "topic_scores": topic_scores,
            "strong_areas": strong_areas,
            "weak_areas": weak_areas
        }

    def _analyze_learning_curve(self, topic_performance: Dict, knowledge_state: Dict) -> Dict:
        learning_rates = {}
        for topic, data in topic_performance.items():
            if data['attempts'] > 1:
                # Calculate learning rate based on performance progression
                initial_performance = data['correct'] / data['attempts']
                current_mastery = knowledge_state.get(topic, {}).get('level', 0.5)
                learning_rate = (current_mastery - initial_performance) / data['attempts']
                learning_rates[topic] = learning_rate

        return {
            "learning_rates": learning_rates,
            "overall_trend": np.mean(list(learning_rates.values())) if learning_rates else 0
        }

    def _calculate_performance_score(self, accuracy: float, avg_time: float, 
                                  time_trend: float, topic_scores: Dict) -> float:
        time_score = self._normalize_time_score(avg_time)
        consistency_score = -abs(time_trend)  # Negative impact for high variance
        topic_score = np.mean(list(topic_scores.values()))

        weights = self.performance_weights
        return (weights['accuracy'] * accuracy +
                weights['time_efficiency'] * time_score +
                weights['consistency'] * (consistency_score + 1) / 2 +
                weights['difficulty_handling'] * topic_score)

    def _generate_recommendations(self, weak_areas: List, learning_curve: Dict, 
                                performance_score: float) -> List[Dict]:
        recommendations = []
        
        # Generate specific recommendations based on analysis
        for area in weak_areas:
            topic = area['topic']
            learning_rate = learning_curve['learning_rates'].get(topic, 0)
            
            if learning_rate > 0:
                recommendations.append({
                    "topic": topic,
                    "type": "practice",
                    "priority": "medium",
                    "message": f"Continue practicing {topic}. You're making progress!"
                })
            else:
                recommendations.append({
                    "topic": topic,
                    "type": "review",
                    "priority": "high",
                    "message": f"Review fundamental concepts in {topic} before proceeding."
                })

        return recommendations

    @staticmethod
    def _calculate_time_trend(response_times: List[float]) -> float:
        if len(response_times) < 2:
            return 0
        return stats.linregress(range(len(response_times)), response_times).slope

    @staticmethod
    def _normalize_time_score(avg_time: float, target_time: float = 30) -> float:
        return 1 / (1 + np.exp((avg_time - target_time) / 10))

    @staticmethod
    def _calculate_consistency_score(session_data: Dict) -> float:
        times = session_data['response_times']
        if not times:
            return 0
        return 1 - (np.std(times) / (np.mean(times) + 1))  # Normalized consistency score 