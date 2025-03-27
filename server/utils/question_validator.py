from typing import Dict, List, Optional, Union

def validate_question(question: Dict) -> List[str]:
    """
    Validates a question object to ensure it has all required fields and proper format.
    Returns a list of error messages. Empty list means the question is valid.
    """
    errors = []
    
    # Check if question is a dictionary
    if not isinstance(question, dict):
        return ["Question must be a dictionary"]
    
    # Required fields
    required_fields = ['text', 'options', 'correctAnswer', 'explanation']
    for field in required_fields:
        if field not in question:
            errors.append(f"Missing required field: {field}")
    
    # Validate text
    if 'text' in question and not isinstance(question['text'], str):
        errors.append("Question text must be a string")
    elif 'text' in question and len(question['text'].strip()) < 10:
        errors.append("Question text is too short")
    
    # Validate options
    if 'options' in question:
        if not isinstance(question['options'], list):
            errors.append("Options must be a list")
        elif len(question['options']) < 2:
            errors.append("Question must have at least 2 options")
        else:
            for i, option in enumerate(question['options']):
                if not isinstance(option, str):
                    errors.append(f"Option {i+1} must be a string")
                elif len(option.strip()) == 0:
                    errors.append(f"Option {i+1} cannot be empty")
    
    # Validate correctAnswer
    if 'correctAnswer' in question:
        if not isinstance(question['correctAnswer'], int):
            errors.append("Correct answer must be an integer")
        elif 'options' in question and (question['correctAnswer'] < 0 or question['correctAnswer'] >= len(question['options'])):
            errors.append(f"Correct answer index must be between 0 and {len(question['options'])-1}")
    
    # Validate explanation
    if 'explanation' in question and not isinstance(question['explanation'], str):
        errors.append("Explanation must be a string")
    elif 'explanation' in question and len(question['explanation'].strip()) < 10:
        errors.append("Explanation is too short")
    
    # Validate optional fields
    if 'difficulty' in question:
        if not isinstance(question['difficulty'], int):
            errors.append("Difficulty must be an integer")
        elif question['difficulty'] < 1 or question['difficulty'] > 3:
            errors.append("Difficulty must be between 1 and 3")
    
    if 'topic' in question and not isinstance(question['topic'], str):
        errors.append("Topic must be a string")
    
    return errors

def format_question(question: Dict) -> Dict:
    """
    Formats a question to ensure consistent field names and structure.
    """
    formatted = {}
    
    # Copy basic fields
    formatted['text'] = question.get('text', '')
    formatted['options'] = question.get('options', [])
    formatted['explanation'] = question.get('explanation', '')
    
    # Handle different field naming conventions
    if 'correctAnswer' in question:
        formatted['correctAnswer'] = question['correctAnswer']
    elif 'correct_answer' in question:
        formatted['correctAnswer'] = question['correct_answer']
    else:
        formatted['correctAnswer'] = 0
    
    # Add metadata
    formatted['topic'] = question.get('topic', 'General')
    formatted['difficulty'] = question.get('difficulty', 1)
    
    # Generate ID if not present
    if 'id' in question:
        formatted['id'] = question['id']
    else:
        import hashlib
        text_hash = hashlib.md5(formatted['text'].encode()).hexdigest()[:8]
        formatted['id'] = f"q_{text_hash}"
    
    return formatted 