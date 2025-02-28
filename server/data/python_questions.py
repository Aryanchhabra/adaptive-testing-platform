PYTHON_QUESTIONS = [
    # Basic Syntax
    {
        'text': 'What is the correct way to comment multiple lines in Python?',
        'options': [
            '/* comment */',
            '<!-- comment -->',
            '""" comment """',
            '// comment //'
        ],
        'correctAnswer': 2,
        'difficulty': 1,
        'topic': 'Basic Syntax',
        'explanation': 'Python uses triple quotes (""") for multi-line comments, also known as docstrings.'
    },
    {
        'text': 'Which of these is a valid Python variable name?',
        'options': [
            '2variable',
            'my-variable',
            'my_variable',
            'class'
        ],
        'correctAnswer': 2,
        'difficulty': 1,
        'topic': 'Basic Syntax',
        'explanation': 'Variable names must start with a letter or underscore, can contain numbers, but cannot be Python keywords.'
    },

    # Data Types
    {
        'text': 'What is the output of print(type([1, 2, 3]))?',
        'options': [
            'list',
            'array',
            'tuple',
            'set'
        ],
        'correctAnswer': 0,
        'difficulty': 1,
        'topic': 'Basic Python Syntax',
        'explanation': 'In Python, square brackets create a list object.'
    },
    {
        'text': 'What will this code output? x = 5 + 3',
        'options': [
            '8',
            '53',
            'Error',
            'None'
        ],
        'correctAnswer': 0,
        'difficulty': 1,
        'topic': 'Basic Python Syntax',
        'explanation': 'The + operator performs arithmetic addition on numbers.'
    },
    {
        'text': 'Which data type is mutable?',
        'options': [
            'list',
            'tuple',
            'string',
            'int'
        ],
        'correctAnswer': 0,
        'difficulty': 1,
        'topic': 'Data Types',
        'explanation': 'Lists are mutable, meaning they can be modified after creation.'
    },

    # Control Flow
    {
        'text': 'What is the output of:\n```python\nx = 5\nif x > 3: print("A")\nelif x > 4: print("B")\nelse: print("C")```',
        'options': [
            'A',
            'B',
            'C',
            'A and B'
        ],
        'correctAnswer': 0,
        'difficulty': 2,
        'topic': 'Control Flow',
        'explanation': 'Once the first condition (x > 3) is True, its block executes and the rest are skipped.'
    },
    {
        'text': 'Which statement is used to exit a loop prematurely?',
        'options': [
            'exit',
            'break',
            'continue',
            'return'
        ],
        'correctAnswer': 1,
        'difficulty': 1,
        'topic': 'Control Flow',
        'explanation': 'The break statement exits the loop completely when encountered.'
    },

    # Functions
    {
        'text': 'What is a lambda function in Python?',
        'options': [
            'A named function defined with def',
            'An anonymous function that can have only one expression',
            'A function that automatically handles errors',
            'A function that only works with lists'
        ],
        'correctAnswer': 1,
        'difficulty': 3,
        'topic': 'Functions',
        'explanation': 'Lambda functions are anonymous functions that can contain only one expression and are used for simple operations.'
    },
    {
        'text': 'What does *args mean in a function definition?',
        'options': [
            'It forces all arguments to be keywords',
            'It collects all positional arguments into a tuple',
            'It indicates the function takes no arguments',
            'It unpacks a list into arguments'
        ],
        'correctAnswer': 1,
        'difficulty': 3,
        'topic': 'Functions',
        'explanation': '*args allows a function to accept any number of positional arguments, collecting them into a tuple.'
    },

    # OOP
    {
        'text': 'What is inheritance in Python?',
        'options': [
            'Creating multiple instances of a class',
            'A mechanism that allows a class to inherit attributes and methods from another class',
            'A way to delete objects',
            'A type of loop'
        ],
        'correctAnswer': 1,
        'difficulty': 2,
        'topic': 'OOP',
        'explanation': 'Inheritance is a fundamental OOP concept that allows a class (child/derived class) to inherit attributes and methods from another class (parent/base class). This promotes code reuse and establishes a relationship between parent and child classes.'
    },
    {
        'text': 'What is the purpose of self in Python classes?',
        'options': [
            'To create a new instance',
            'To delete an instance',
            'To reference the current instance of the class',
            'To call the parent class'
        ],
        'correctAnswer': 2,
        'difficulty': 2,
        'topic': 'OOP',
        'explanation': 'self is a convention for the first parameter of instance methods, referring to the instance being acted upon.'
    },

    # Error Handling
    {
        'text': 'Which statement is used to handle exceptions in Python?',
        'options': [
            'catch',
            'except',
            'handle',
            'error'
        ],
        'correctAnswer': 1,
        'difficulty': 1,
        'topic': 'Error Handling',
        'explanation': 'The except statement is used to catch and handle exceptions in Python.'
    },

    # Data Structures
    {
        'text': 'Which data structure follows FIFO?',
        'options': [
            'Stack',
            'Queue',
            'Tree',
            'Set'
        ],
        'correctAnswer': 1,
        'difficulty': 2,
        'topic': 'Data Structures',
        'explanation': 'Queue follows First In First Out (FIFO) principle, where the first element added is the first one to be removed.'
    },

    # Algorithms
    {
        'text': 'What is the time complexity of binary search?',
        'options': [
            'O(n)',
            'O(n²)',
            'O(log n)',
            'O(1)'
        ],
        'correctAnswer': 2,
        'difficulty': 3,
        'topic': 'Algorithms',
        'explanation': 'Binary search has a logarithmic time complexity as it halves the search space in each step.'
    },

    # Adding new questions
    {
        'text': 'What is the output of: print(list(range(2, 8, 2)))?',
        'options': ['[2, 4, 6]', '[2, 4, 6, 8]', '[2, 3, 4, 5, 6, 7]', '[2, 8]'],
        'correctAnswer': 0,
        'topic': 'Basic Python Syntax',
        'difficulty': 2,
        'explanation': 'range(start, stop, step) generates numbers from start to stop-1 with the given step'
    },
    {
        'text': 'Which method is used to add an element to a set?',
        'options': ['add()', 'append()', 'insert()', 'extend()'],
        'correctAnswer': 0,
        'topic': 'Data Types',
        'difficulty': 1,
        'explanation': 'Sets use the add() method to add single elements'
    },
    {
        'text': 'What is a decorator in Python?',
        'options': [
            'A function that modifies another function',
            'A class that inherits from another class',
            'A type of loop',
            'A way to format strings'
        ],
        'correctAnswer': 0,
        'topic': 'Functions',
        'difficulty': 3,
        'explanation': 'Decorators are functions that modify the behavior of other functions'
    },
    {
        'text': 'What is the difference between append() and extend() for lists?',
        'options': [
            'append() adds one element, extend() adds multiple elements',
            'append() adds to the start, extend() adds to the end',
            'append() creates a new list, extend() modifies in place',
            'There is no difference'
        ],
        'correctAnswer': 0,
        'topic': 'Data Types',
        'difficulty': 2,
        'explanation': 'append() adds a single element to the end, extend() adds all elements from an iterable'
    },
    {
        'text': 'What is the purpose of __init__.py in a Python package?',
        'options': [
            'To initialize the package and mark the directory as a Python package',
            'To store package configuration',
            'To define package classes',
            'To import required modules'
        ],
        'correctAnswer': 0,
        'topic': 'OOP',
        'difficulty': 2,
        'explanation': '__init__.py marks a directory as a Python package and can contain initialization code'
    }
] 