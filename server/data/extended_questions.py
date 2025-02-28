EXTENDED_QUESTIONS = [
    # Basic Python Syntax - Additional Questions
    {
        "text": "Which of these is a valid Python comment?",
        "options": ["// This is a comment", "/* Comment */", "# This is a comment", "<!-- Comment -->"],
        "correctAnswer": 2,
        "explanation": "Python uses # for single-line comments",
        "topic": "Basic Python Syntax",
        "difficulty": 1,
        "tags": ["basics", "comments"]
    },
    {
        "text": "What is the output of: print(3 ** 2)?",
        "options": ["6", "9", "5", "Error"],
        "correctAnswer": 1,
        "explanation": "** is the exponentiation operator in Python, 3^2 = 9",
        "topic": "Basic Python Syntax",
        "difficulty": 1,
        "tags": ["operators", "basics"]
    },
    {
        "text": "What does the following code print?\nx = 5\nprint(f'{x} times 2 is {x*2}')",
        "options": ["5 times 2 is 10", "x times 2 is x*2", "Error", "{x} times 2 is {x*2}"],
        "correctAnswer": 0,
        "explanation": "f-strings allow embedding expressions inside string literals",
        "topic": "Basic Python Syntax",
        "difficulty": 2,
        "tags": ["f-strings", "formatting"]
    },
    # Data Types - Additional Questions
    {
        "text": "What is the type of x? x = [1, 2.0, '3']",
        "options": ["int", "float", "list", "mixed"],
        "correctAnswer": 2,
        "explanation": "This is a list that can contain elements of different types",
        "topic": "Data Types and Variables",
        "difficulty": 1,
        "tags": ["lists", "types"]
    },
    {
        "text": "What is the output of: len({'a':1, 'b':2, 'c':3})?",
        "options": ["6", "3", "Error", "None"],
        "correctAnswer": 1,
        "explanation": "len() on a dictionary returns the number of key-value pairs",
        "topic": "Data Types and Variables",
        "difficulty": 2,
        "tags": ["dictionaries", "built-ins"]
    },
    # Control Flow - Additional Questions
    {
        "text": "What happens if a while loop's condition is always True?",
        "options": ["The loop runs once", "The loop never runs", "Infinite loop", "Syntax error"],
        "correctAnswer": 2,
        "explanation": "A while loop with a condition that's always True will run indefinitely",
        "topic": "Control Flow",
        "difficulty": 1,
        "tags": ["loops", "while"]
    },
    {
        "text": "What is the output of:\nfor i in range(5):\n    if i == 3:\n        break\n    print(i)",
        "options": ["0 1 2", "0 1 2 3", "0 1 2 3 4", "1 2 3"],
        "correctAnswer": 0,
        "explanation": "break statement exits the loop when i equals 3",
        "topic": "Control Flow",
        "difficulty": 2,
        "tags": ["loops", "break"]
    },
    # Functions - Additional Questions
    {
        "text": "What is a lambda function in Python?",
        "options": [
            "A named function",
            "An anonymous function",
            "A built-in function",
            "A recursive function"
        ],
        "correctAnswer": 1,
        "explanation": "Lambda functions are anonymous functions defined using the lambda keyword",
        "topic": "Functions",
        "difficulty": 2,
        "tags": ["lambda", "advanced"]
    },
    {
        "text": "What is the output of:\ndef func(a, b=1, c=2):\n    return a + b + c\nprint(func(3))",
        "options": ["3", "4", "6", "Error"],
        "correctAnswer": 2,
        "explanation": "Using default values b=1 and c=2, the function returns 3+1+2=6",
        "topic": "Functions",
        "difficulty": 2,
        "tags": ["default arguments", "parameters"]
    }
    # ... (I can provide more questions if needed)
] 