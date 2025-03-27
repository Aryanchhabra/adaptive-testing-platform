from typing import List, Dict, Any, Optional
import uuid

class Question:
    def __init__(
        self, 
        text: str, 
        options: List[str], 
        correct_answer: int, 
        explanation: str, 
        topic: str, 
        difficulty: int,
        id: Optional[str] = None
    ):
        self.id = id or str(uuid.uuid4())
        self.text = text
        self.options = options
        self.correct_answer = correct_answer
        self.explanation = explanation
        self.topic = topic
        self.difficulty = difficulty
        
    def to_dict(self) -> Dict[str, Any]:
        """Convert question to dictionary for JSON serialization"""
        return {
            'id': self.id,
            'text': self.text,
            'options': self.options,
            'correctAnswer': self.correct_answer,
            'explanation': self.explanation,
            'topic': self.topic,
            'difficulty': self.difficulty
        }
        
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'Question':
        """Create question from dictionary"""
        # Handle different field naming conventions
        correct_answer = data.get('correctAnswer', data.get('correct_answer', 0))
        
        return cls(
            id=data.get('id'),
            text=data.get('text', ''),
            options=data.get('options', []),
            correct_answer=correct_answer,
            explanation=data.get('explanation', ''),
            topic=data.get('topic', ''),
            difficulty=data.get('difficulty', 1)
        ) 