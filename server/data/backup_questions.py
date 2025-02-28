BACKUP_QUESTIONS = [
    # Basic Python Syntax - Level 1
    {
        "text": "What is the output of print(type(5))?",
        "options": ["<class 'int'>", "<class 'str'>", "<class 'float'>", "<class 'number'>"],
        "correctAnswer": 0,
        "explanation": "In Python, 5 is an integer, so type(5) returns <class 'int'>",
        "topic": "Basic Python Syntax",
        "difficulty": 1,
        "tags": ["types", "basics"]
    },
    # Basic Python Syntax - Level 2
    {
        "text": "What will be the output of:\nx = 1\ny = 2\nx, y = y, x\nprint(x, y)",
        "options": ["1 2", "2 1", "Error", "None"],
        "correctAnswer": 1,
        "explanation": "Python allows multiple assignment and tuple unpacking",
        "topic": "Basic Python Syntax",
        "difficulty": 2,
        "tags": ["variables", "advanced"]
    },
    # Data Types - Level 1
    {
        "text": "What is the result of 'Hello' + ' ' + 'World'?",
        "options": ["HelloWorld", "Hello World", "Error", "None"],
        "correctAnswer": 1,
        "explanation": "String concatenation with + operator joins the strings together",
        "topic": "Data Types and Variables",
        "difficulty": 1,
        "tags": ["strings", "operators"]
    },
    # Data Types - Level 2
    {
        "text": "What is the output of: list(set([1,2,2,3,3,3]))",
        "options": ["[1,2,2,3,3,3]", "[1,2,3]", "Error", "[3,2,1]"],
        "correctAnswer": 1,
        "explanation": "set() removes duplicates, and list() converts it back to a list",
        "topic": "Data Types and Variables",
        "difficulty": 2,
        "tags": ["lists", "sets", "conversion"]
    },
    # Control Flow - Level 1
    {
        "text": "What does the following code print?\nfor i in range(3):\n    print(i)",
        "options": ["0 1 2", "1 2 3", "0 1 2 3", "1 2"],
        "correctAnswer": 0,
        "explanation": "range(3) generates numbers from 0 to 2",
        "topic": "Control Flow",
        "difficulty": 1,
        "tags": ["loops", "range"]
    },
    # Control Flow - Level 2
    {
        "text": "What is the output of:\nfor i in range(3):\n    if i == 1:\n        continue\n    print(i)",
        "options": ["0 1 2", "0 2", "1 2", "0 1"],
        "correctAnswer": 1,
        "explanation": "continue skips the rest of the loop for that iteration",
        "topic": "Control Flow",
        "difficulty": 2,
        "tags": ["loops", "control flow", "continue"]
    },
    # Functions - Level 1
    {
        "text": "How do you define a function in Python?",
        "options": ["function myFunc():", "def myFunc():", "define myFunc():", "func myFunc():"],
        "correctAnswer": 1,
        "explanation": "Python uses 'def' keyword to define functions",
        "topic": "Functions",
        "difficulty": 1,
        "tags": ["functions", "basics"]
    },
    # Functions - Level 2
    {
        "text": "What is the output of:\ndef func(x, y=2):\n    return x * y\nprint(func(3))",
        "options": ["3", "2", "6", "Error"],
        "correctAnswer": 2,
        "explanation": "y has a default value of 2, so func(3) multiplies 3 * 2",
        "topic": "Functions",
        "difficulty": 2,
        "tags": ["functions", "default arguments"]
    },
    # OOP - Level 1
    {
        "text": "Which keyword is used to create a class in Python?",
        "options": ["def", "class", "create", "struct"],
        "correctAnswer": 1,
        "explanation": "The 'class' keyword is used to define a class in Python",
        "topic": "Object-Oriented Programming",
        "difficulty": 1,
        "tags": ["classes", "oop basics"]
    },
    # OOP - Level 2
    {
        "text": "What is the output of:\nclass A:\n    def __init__(self):\n        self.x = 1\nprint(A().x)",
        "options": ["None", "Error", "1", "x"],
        "correctAnswer": 2,
        "explanation": "__init__ is the constructor, and self.x sets the instance variable",
        "topic": "Object-Oriented Programming",
        "difficulty": 2,
        "tags": ["classes", "constructors", "instances"]
    }
] 