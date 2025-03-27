import sys
import os
from pathlib import Path

# Add the parent directory to the Python path
parent_dir = Path(__file__).resolve().parent.parent
sys.path.append(str(parent_dir))

from services.ai_question_generator import AIQuestionGenerator
from models.question import Question
from services.question_service import QuestionService

def generate_sample_questions():
    """Generate sample questions for testing"""
    print("Generating sample questions...")
    
    # Initialize services
    ai_generator = AIQuestionGenerator()
    question_service = QuestionService()
    
    # Topics to generate questions for
    topics = [
        {"name": "Python Basics", "difficulty": 1},
        {"name": "Python Functions", "difficulty": 2},
        {"name": "Python Classes", "difficulty": 3}
    ]
    
    total_generated = 0
    
    for topic in topics:
        print(f"Generating questions for {topic['name']} (Difficulty: {topic['difficulty']})...")
        
        # Generate 3 questions per topic
        questions = ai_generator.generate_questions(
            topic=topic["name"],
            difficulty=topic["difficulty"],
            count=3
        )
        
        if questions:
            # Save questions to database
            for q in questions:
                question = Question(
                    text=q['text'],
                    options=q['options'],
                    correct_answer=q['correctAnswer'],
                    explanation=q['explanation'],
                    topic=topic['name'],
                    difficulty=topic['difficulty']
                )
                
                question_id = question_service.add_question(question)
                if question_id:
                    print(f"Added question with ID: {question_id}")
                    total_generated += 1
        else:
            print(f"Failed to generate questions for {topic['name']}")
    
    print(f"Total questions generated: {total_generated}")
    
    # If no questions were generated, add some hardcoded ones
    if total_generated == 0:
        print("Adding fallback hardcoded questions...")
        add_hardcoded_questions(question_service)

def add_hardcoded_questions(question_service):
    """Add hardcoded questions as a fallback"""
    hardcoded_questions = [
        {
            "text": "What is the output of the following code?\n\n```python\nx = [1, 2, 3]\nprint(x[1])```",
            "options": ["1", "2", "3", "Error"],
            "correctAnswer": 1,
            "explanation": "In Python, list indexing starts at 0. So x[1] refers to the second element of the list, which is 2.",
            "topic": "Python Basics",
            "difficulty": 1
        },
        {
            "text": "Which of the following is the correct way to define a function in Python?",
            "options": [
                "function my_function():",
                "def my_function():",
                "define my_function():",
                "func my_function():"
            ],
            "correctAnswer": 1,
            "explanation": "In Python, functions are defined using the 'def' keyword followed by the function name and parentheses.",
            "topic": "Python Functions",
            "difficulty": 1
        },
        {
            "text": "What is the output of the following code?\n\n```python\ndef multiply(a, b=2):\n    return a * b\n\nprint(multiply(3))```",
            "options": ["3", "6", "5", "Error"],
            "correctAnswer": 1,
            "explanation": "The function multiply has a default parameter b=2. When called with only one argument multiply(3), the value of a becomes 3 and b uses its default value 2. So the result is 3 * 2 = 6.",
            "topic": "Python Functions",
            "difficulty": 2
        },
        {
            "text": "What is the correct way to create a class in Python?",
            "options": [
                "class MyClass {}",
                "class MyClass():",
                "def class MyClass():",
                "create class MyClass:"
            ],
            "correctAnswer": 1,
            "explanation": "In Python, classes are defined using the 'class' keyword followed by the class name and a colon. The body of the class is indented.",
            "topic": "Python Classes",
            "difficulty": 2
        },
        {
            "text": "What does the __init__ method do in a Python class?",
            "options": [
                "It initializes the class variables",
                "It is called when an instance of the class is created",
                "It defines the class methods",
                "It is used to delete an instance of the class"
            ],
            "correctAnswer": 1,
            "explanation": "The __init__ method is a special method in Python classes that is automatically called when a new instance of the class is created. It is used to initialize the attributes of the class.",
            "topic": "Python Classes",
            "difficulty": 3
        }
    ]
    
    for q_data in hardcoded_questions:
        question = Question(
            text=q_data['text'],
            options=q_data['options'],
            correct_answer=q_data['correctAnswer'],
            explanation=q_data['explanation'],
            topic=q_data['topic'],
            difficulty=q_data['difficulty']
        )
        
        question_id = question_service.add_question(question)
        if question_id:
            print(f"Added hardcoded question with ID: {question_id}")

if __name__ == "__main__":
    generate_sample_questions() 