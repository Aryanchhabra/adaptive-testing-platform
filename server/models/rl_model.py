import numpy as np
from typing import List, Dict
from dataclasses import dataclass

@dataclass
class State:
    knowledge_level: float
    topic_mastery: Dict[str, float]
    question_history: List[str]
    time_per_question: List[float]

class RLQuestionSelector:
    def __init__(self, learning_rate=0.1, discount_factor=0.9):
        self.learning_rate = learning_rate
        self.discount_factor = discount_factor
        self.q_table = {}  # State-action value function
        
    def get_state_key(self, state: State) -> str:
        """Convert state to a hashable key"""
        return (
            f"{state.knowledge_level:.2f}|"
            f"{sorted(state.topic_mastery.items())}|"
            f"{len(state.question_history)}|"
            f"{np.mean(state.time_per_question):.1f}"
        )
    
    def select_action(self, state: State, available_questions: List[Dict]) -> Dict:
        """Select next question using Q-learning"""
        state_key = self.get_state_key(state)
        
        if state_key not in self.q_table:
            self.q_table[state_key] = {
                q['id']: np.random.random() 
                for q in available_questions
            }
        
        # Epsilon-greedy selection
        if np.random.random() < 0.1:  # 10% exploration
            return np.random.choice(available_questions)
        
        # Select question with highest Q-value
        q_values = self.q_table[state_key]
        valid_questions = [
            q for q in available_questions 
            if q['id'] in q_values
        ]
        
        if not valid_questions:
            return np.random.choice(available_questions)
            
        return max(
            valid_questions,
            key=lambda q: q_values.get(q['id'], 0)
        )
    
    def update(self, state: State, action: Dict, reward: float, next_state: State):
        """Update Q-values based on reward"""
        state_key = self.get_state_key(state)
        next_state_key = self.get_state_key(next_state)
        
        # Initialize Q-values if needed
        if state_key not in self.q_table:
            self.q_table[state_key] = {}
        if next_state_key not in self.q_table:
            self.q_table[next_state_key] = {}
            
        # Q-learning update
        current_q = self.q_table[state_key].get(action['id'], 0)
        next_max_q = max(
            self.q_table[next_state_key].values(), 
            default=0
        )
        
        new_q = current_q + self.learning_rate * (
            reward + self.discount_factor * next_max_q - current_q
        )
        
        self.q_table[state_key][action['id']] = new_q 