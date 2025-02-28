from typing import Dict, List

def validate_question(question: Dict) -> List[str]:
    errors = []
    
    required_fields = ['text', 'options', 'correct_answer', 'explanation', 'topic', 'difficulty']
    for field in required_fields:
        if field not in question:
            errors.append(f"Missing required field: {field}")
    
    if 'options' in question:
        if len(question['options']) != 4:
            errors.append("Must have exactly 4 options")
        if len(set(question['options'])) != len(question['options']):
            errors.append("Options must be unique")
    
    if 'correct_answer' in question:
        if not isinstance(question['correct_answer'], int):
            errors.append("correct_answer must be an integer")
        elif question['correct_answer'] not in range(4):
            errors.append("correct_answer must be between 0 and 3")
    
    if 'difficulty' in question:
        if question['difficulty'] not in [1, 2, 3]:
            errors.append("difficulty must be 1, 2, or 3")
    
    return errors 