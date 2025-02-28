import json
from typing import List, Dict
import asyncio
import random

class QuestionGenerator:
    def __init__(self):
        self.topics = [
            "Basic Python Syntax",
            "Data Types and Variables",
            "Control Flow",
            "Functions",
            "Object-Oriented Programming"
        ]
        
        # Expanded templates with more questions
        self.templates = {
            "Basic Python Syntax": [
                {
                    "text": "What is the output of: x = 5; y = 2; print(x {op} y)",
                    "operations": ["+", "-", "*", "/", "//", "%", "**"],
                    "difficulty": 1,
                    "explanations": {
                        "+": "Addition operator returns the sum",
                        "*": "Multiplication operator returns the product",
                        "//": "Floor division returns the quotient without decimal",
                        "**": "Power operator raises x to the power of y"
                    }
                },
                {
                    "text": "Which of the following is a valid Python variable name?",
                    "options": ["my_variable", "123variable", "my-variable", "class"],
                    "correct_answer": 0,
                    "explanation": "Variable names must start with a letter or underscore, can't use reserved keywords like 'class'",
                    "difficulty": 1
                },
                {
                    "text": "What is the result of: print('{value}' * 3)",
                    "values": ["hello", "*", "123", "py"],
                    "difficulty": 1
                }
            ],
            "Data Types and Variables": [
                {
                    "text": "What is the type of {value}?",
                    "values": ["[1, 2, 3]", "{'a': 1}", "(1,)", "1.0", "True", "'123'"],
                    "options_map": {
                        "[1, 2, 3]": ["list", "array", "tuple", "set"],
                        "{'a': 1}": ["dict", "map", "object", "set"],
                        "(1,)": ["tuple", "list", "set", "array"],
                        "1.0": ["float", "int", "decimal", "number"],
                        "True": ["bool", "boolean", "int", "string"],
                        "'123'": ["str", "int", "char", "number"]
                    },
                    "difficulty": 1
                },
                {
                    "text": "What is the result of: len({value})",
                    "values": ["'python'", "[1, 2, 3]", "{'a': 1, 'b': 2}", "(1, 2, 3, 4)"],
                    "difficulty": 2
                }
            ],
            "Control Flow": [
                {
                    "text": "What is the output of:\nfor i in range({n}):\n    print(i)",
                    "values": [3, 4, 5],
                    "options_map": {
                        3: ["0 1 2", "1 2 3", "0 1 2 3", "1 2"],
                        4: ["0 1 2 3", "1 2 3 4", "0 1 2 3 4", "1 2 3"],
                        5: ["0 1 2 3 4", "1 2 3 4 5", "0 1 2 3 4 5", "1 2 3 4"]
                    },
                    "correct_index": 0,
                    "difficulty": 1
                },
                {
                    "text": "What will this code print?\nif {condition}:\n    print('A')\nelse:\n    print('B')",
                    "conditions": ["True", "False", "1 > 0", "2 < 1"],
                    "difficulty": 1
                }
            ],
            "Functions": [
                {
                    "text": "What is the output of:\ndef func(x, y=2):\n    return x * y\nprint(func({value}))",
                    "values": [3, 4, 5],
                    "options_map": {
                        3: [6, 3, 9, 5],
                        4: [8, 4, 12, 6],
                        5: [10, 5, 15, 7]
                    },
                    "correct_index": 0,
                    "difficulty": 2
                },
                {
                    "text": "Which is the correct way to define a function in Python?",
                    "options": [
                        "def my_function():",
                        "function my_function():",
                        "def my_function:",
                        "function my_function:"
                    ],
                    "correct_answer": 0,
                    "explanation": "Python uses the 'def' keyword to define functions, followed by the function name and parentheses",
                    "difficulty": 1
                }
            ],
            "Object-Oriented Programming": [
                {
                    "text": "What is the output of:\nclass Test:\n    def __init__(self):\n        self.x = 1\nprint(Test().x)",
                    "options": ["1", "None", "Error", "0"],
                    "correct_answer": 0,
                    "explanation": "__init__ is the constructor method, self.x sets the instance variable x to 1",
                    "difficulty": 2
                },
                {
                    "text": "Which method is automatically called when creating a new object?",
                    "options": ["__init__", "__new__", "__main__", "__call__"],
                    "correct_answer": 0,
                    "explanation": "__init__ is the constructor method in Python classes",
                    "difficulty": 1
                },
                {
                    "text": "What is inheritance in Python?",
                    "options": [
                        "A way for a class to inherit attributes and methods from another class",
                        "A way to create multiple instances of a class",
                        "A way to delete objects",
                        "A way to define class variables"
                    ],
                    "correct_answer": 0,
                    "explanation": "Inheritance allows a class to inherit attributes and methods from a parent class",
                    "difficulty": 2
                }
            ]
        }

    def _generate_from_template(self, template: Dict, topic: str) -> Dict:
        """Generate a question from a template"""
        if "operations" in template:
            op = random.choice(template["operations"])
            text = template["text"].format(op=op)
            if op == "+":
                result = 7
                options = [result, result-1, result+1, result*2]
                explanation = template["explanations"].get(op, "This is the correct answer")
            elif op == "*":
                result = 10
                options = [result, result-2, result+2, result//2]
                explanation = template["explanations"].get(op, "This is the correct answer")
        elif "values" in template:
            value = random.choice(template["values"])
            text = template["text"].format(value=value)
            if "options_map" in template:
                options = template["options_map"][value]
                correct = template.get("correct_index", 0)
            else:
                if "[" in str(value):
                    options = ["list", "array", "tuple", "set"]
                    correct = 0
                elif "{" in str(value):
                    options = ["dict", "map", "set", "list"]
                    correct = 0
                else:
                    result = eval(f"len({value})")
                    options = [result, result+1, result-1, result+2]
                    correct = 0
        else:
            text = template["text"]
            options = template.get("options", ["A", "B", "C", "D"])
            correct = template.get("correct_answer", 0)
            explanation = template.get("explanation", "This is the correct answer")

        return {
            "text": text,
            "options": options,
            "correct_answer": correct,
            "explanation": template.get("explanation", f"The correct answer for {text}"),
            "topic": topic,
            "difficulty": template["difficulty"]
        }

    async def generate_question_batch(self, topic: str) -> List[Dict]:
        """Generate questions for a topic using templates"""
        questions = []
        templates = self.templates.get(topic, [])
        
        if not templates:
            return []

        for template in templates:
            question = self._generate_from_template(template, topic)
            questions.append(question)
            await asyncio.sleep(0.1)  # Small delay for simulation

        return questions

    async def generate_full_question_set(self) -> List[Dict]:
        """Generate questions for all topics"""
        all_questions = []
        
        for topic in self.topics:
            try:
                print(f"\nGenerating questions for {topic}...")
                questions = await self.generate_question_batch(topic)
                all_questions.extend(questions)
                print(f"Generated {len(questions)} questions for {topic}")
                
            except Exception as e:
                print(f"Error with topic {topic}: {e}")
                continue

        return all_questions 