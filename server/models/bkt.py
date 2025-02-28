import numpy as np
from dataclasses import dataclass
from typing import List

@dataclass
class BKTParameters:
    p_transit: float = 0.2
    p_slip: float = 0.1
    p_guess: float = 0.2
    threshold: float = 0.8

class BKTModel:
    def __init__(self, params: BKTParameters = None):
        self.params = params or BKTParameters()
        
    def update_knowledge(self, current_belief: float, is_correct: bool) -> float:
        """Single update step for knowledge state"""
        p = self.params
        
        if is_correct:
            p_known = (current_belief * (1 - p.p_slip)) / \
                     (current_belief * (1 - p.p_slip) + (1 - current_belief) * p.p_guess)
        else:
            p_known = (current_belief * p.p_slip) / \
                     (current_belief * p.p_slip + (1 - current_belief) * (1 - p.p_guess))
        
        return p_known + (1 - p_known) * p.p_transit

    def initialize_state(self):
        """Initialize knowledge state for all concepts"""
        return np.zeros(self.num_concepts) + 0.5
        
    def update_state(self, current_state, is_correct):
        """Update knowledge state based on response"""
        new_state = current_state.copy()
        
        for i in range(self.num_concepts):
            p_known = current_state[i]
            
            if is_correct:
                # Update probability if answer is correct
                p_known = (p_known * (1 - self.p_slip)) / \
                         (p_known * (1 - self.p_slip) + (1 - p_known) * self.p_guess)
            else:
                # Update probability if answer is incorrect
                p_known = (p_known * self.p_slip) / \
                         (p_known * self.p_slip + (1 - p_known) * (1 - self.p_guess))
            
            # Apply learning probability
            new_state[i] = p_known + (1 - p_known) * self.p_transit
            
        return new_state 