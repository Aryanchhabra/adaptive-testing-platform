"""
Adaptive Question Selection Service
Implements IRT (Item Response Theory) based question selection
"""

import math
import random
from typing import Dict, List, Optional


class AdaptiveSelector:
    """
    Adaptive question selector using Item Response Theory (IRT)
    """
    
    def __init__(self):
        self.knowledge_state = {
            "level": 1,
            "score": 0,
            "correct_streak": 0,
            "incorrect_streak": 0,
            "answered_questions": [],
            "topic_mastery": {}
        }
        
        # IRT parameters
        self.ability_estimate = 0.0  # Theta in IRT
        self.ability_se = 1.0  # Standard error of ability estimate
        
    def update_ability(self, current_ability: float, question_difficulty: float, is_correct: bool) -> float:
        """
        Update ability estimate using IRT methodology
        
        Args:
            current_ability: Current theta estimate
            question_difficulty: Question difficulty parameter (b in IRT)
            is_correct: Whether the answer was correct
            
        Returns:
            Updated ability estimate
        """
        # IRT probability calculation
        discrimination = 1.0  # Assume discrimination (a) = 1 for simplicity
        
        # Calculate probability of correct answer
        prob_correct = self._calculate_probability(current_ability, question_difficulty, discrimination)
        
        # Update using maximum likelihood estimation
        if is_correct:
            # If correct, increase ability estimate
            adjustment = (1 - prob_correct) * 0.3
        else:
            # If incorrect, decrease ability estimate
            adjustment = -prob_correct * 0.3
            
        new_ability = current_ability + adjustment
        
        # Bound ability estimate to reasonable range
        new_ability = max(-3.0, min(3.0, new_ability))
        
        self.ability_estimate = new_ability
        return new_ability
    
    def _calculate_probability(self, ability: float, difficulty: float, discrimination: float = 1.0) -> float:
        """
        Calculate probability of correct answer using IRT 2PL model
        
        P(correct) = 1 / (1 + exp(-discrimination * (ability - difficulty)))
        """
        try:
            exponent = -discrimination * (ability - difficulty)
            # Prevent overflow
            if exponent > 500:
                return 0.0
            elif exponent < -500:
                return 1.0
            
            probability = 1.0 / (1.0 + math.exp(exponent))
            return probability
        except (OverflowError, ZeroDivisionError):
            return 0.5  # Default probability if calculation fails
    
    def select_optimal_difficulty(self, available_difficulties: List[float]) -> float:
        """
        Select optimal question difficulty based on current ability estimate
        
        Optimal difficulty is typically close to current ability estimate
        """
        if not available_difficulties:
            return 1.0  # Default difficulty
            
        # Find difficulty closest to current ability
        target_difficulty = self.ability_estimate
        
        # Convert ability scale to difficulty scale (1-5)
        # Ability range: -3 to +3, Difficulty range: 1 to 5
        target_difficulty_scaled = 3.0 + (target_difficulty * 2.0 / 3.0)
        target_difficulty_scaled = max(1.0, min(5.0, target_difficulty_scaled))
        
        # Find closest available difficulty
        closest_difficulty = min(available_difficulties, 
                               key=lambda x: abs(x - target_difficulty_scaled))
        
        return closest_difficulty
    
    def calculate_information(self, ability: float, difficulty: float, discrimination: float = 1.0) -> float:
        """
        Calculate Fisher Information for a question
        Higher information = more precise measurement
        """
        prob = self._calculate_probability(ability, difficulty, discrimination)
        information = discrimination**2 * prob * (1 - prob)
        return information
    
    def update_knowledge_state(self, topic: str, is_correct: bool, difficulty: float):
        """
        Update knowledge state for specific topic
        """
        if topic not in self.knowledge_state["topic_mastery"]:
            self.knowledge_state["topic_mastery"][topic] = {
                "level": 0.5,
                "attempts": 0,
                "correct": 0,
                "avg_difficulty": 0.0
            }
        
        mastery = self.knowledge_state["topic_mastery"][topic]
        mastery["attempts"] += 1
        
        if is_correct:
            mastery["correct"] += 1
            # Increase mastery level
            improvement = 0.1 * (difficulty / 5.0)  # Harder questions give more improvement
            mastery["level"] = min(1.0, mastery["level"] + improvement)
        else:
            # Decrease mastery level slightly
            mastery["level"] = max(0.0, mastery["level"] - 0.05)
        
        # Update average difficulty
        if mastery["attempts"] > 0:
            mastery["avg_difficulty"] = ((mastery["avg_difficulty"] * (mastery["attempts"] - 1)) + difficulty) / mastery["attempts"]
    
    def get_recommended_difficulty(self) -> int:
        """
        Get recommended difficulty level (1-5) based on current ability
        """
        # Convert ability estimate (-3 to +3) to difficulty scale (1-5)
        scaled_difficulty = 3.0 + (self.ability_estimate * 2.0 / 3.0)
        difficulty_level = max(1, min(5, round(scaled_difficulty)))
        return int(difficulty_level)
    
    def get_mastery_summary(self) -> Dict:
        """
        Get summary of topic mastery levels
        """
        summary = {}
        for topic, mastery in self.knowledge_state["topic_mastery"].items():
            if mastery["attempts"] > 0:
                accuracy = mastery["correct"] / mastery["attempts"]
                if mastery["level"] >= 0.8:
                    status = "Mastered"
                elif mastery["level"] >= 0.5:
                    status = "Learning"
                else:
                    status = "Needs Practice"
                
                summary[topic] = {
                    "mastery_level": round(mastery["level"], 2),
                    "status": status,
                    "accuracy": round(accuracy, 2),
                    "attempts": mastery["attempts"],
                    "avg_difficulty": round(mastery["avg_difficulty"], 1)
                }
        
        return summary 