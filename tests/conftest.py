import pytest
import asyncio
import sys
import os
from pathlib import Path
from fastapi.testclient import TestClient
import httpx
from unittest.mock import Mock
import json
from typing import Dict, List

# Add server directory to Python path
server_path = Path(__file__).parent.parent / "server"
sys.path.insert(0, str(server_path))

# Import after path setup
from app import app

@pytest.fixture(scope="session")
def event_loop():
    """Create an instance of the default event loop for the test session."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()

@pytest.fixture
def client():
    """Test client for FastAPI testing"""
    with TestClient(app) as test_client:
        yield test_client

@pytest.fixture
async def async_client():
    """Async test client for FastAPI testing"""
    async with httpx.AsyncClient(app=app, base_url="http://test") as client:
        yield client

@pytest.fixture
def sample_questions():
    """Sample question data for testing"""
    return [
        {
            "id": "test_q1",
            "question": "What is the output of print(type(5))?",
            "options": ["<class 'int'>", "<class 'float'>", "<class 'str'>", "<class 'bool'>"],
            "correctAnswer": 0,
            "difficulty": 1,
            "topic": "Basic Python Syntax",
            "explanation": "The type() function returns the type of the object. 5 is an integer."
        },
        {
            "id": "test_q2", 
            "question": "Which of the following is used to define a function in Python?",
            "options": ["function", "def", "func", "define"],
            "correctAnswer": 1,
            "difficulty": 1,
            "topic": "Functions",
            "explanation": "The 'def' keyword is used to define functions in Python."
        },
        {
            "id": "test_q3",
            "question": "What will be the output of: len([1, 2, [3, 4]])?",
            "options": ["4", "3", "2", "5"],
            "correctAnswer": 1,
            "difficulty": 2,
            "topic": "Data Types",
            "explanation": "The list has 3 elements: 1, 2, and [3, 4]. The nested list counts as one element."
        },
        {
            "id": "test_q4",
            "question": "What is the correct way to create a class in Python?",
            "options": ["class MyClass:", "Class MyClass:", "class MyClass()", "define MyClass:"],
            "correctAnswer": 0,
            "difficulty": 3,
            "topic": "OOP",
            "explanation": "Classes in Python are defined using the 'class' keyword followed by the class name and a colon."
        },
        {
            "id": "test_q5",
            "question": "Which loop is used when the number of iterations is unknown?",
            "options": ["for loop", "while loop", "do-while loop", "foreach loop"],
            "correctAnswer": 1,
            "difficulty": 2,
            "topic": "Control Flow",
            "explanation": "While loops are used when the number of iterations is not known beforehand."
        }
    ]

@pytest.fixture
def sample_user_session():
    """Sample user session data for testing"""
    return {
        "session_id": "test_session_123",
        "user_id": "test_user_456",
        "questions_answered": 0,
        "correct_answers": 0,
        "current_ability": 0,
        "knowledge_state": {
            "level": 1,
            "score": 0,
            "correct_streak": 0,
            "incorrect_streak": 0,
            "answered_questions": []
        }
    }

@pytest.fixture
def performance_metrics():
    """Sample performance metrics for testing"""
    return {
        "accuracy": 0.75,
        "response_times": [12.5, 8.3, 15.7, 9.2, 11.8],
        "difficulty_progression": [1, 1, 2, 2, 3],
        "topic_performance": {
            "Basic Python Syntax": {"correct": 3, "total": 4},
            "Functions": {"correct": 2, "total": 3},
            "Data Types": {"correct": 1, "total": 2}
        }
    }

@pytest.fixture
def mock_database():
    """Mock database for testing"""
    mock_db = Mock()
    mock_questions = Mock()
    mock_db.questions = mock_questions
    return mock_db

# Pytest configuration
def pytest_configure(config):
    """Configure pytest with custom markers"""
    config.addinivalue_line("markers", "unit: Unit tests")
    config.addinivalue_line("markers", "integration: Integration tests")
    config.addinivalue_line("markers", "performance: Performance tests")
    config.addinivalue_line("markers", "ui: UI tests")
    config.addinivalue_line("markers", "slow: Slow running tests")

def pytest_collection_modifyitems(config, items):
    """Modify test collection to add markers based on file location"""
    for item in items:
        # Add markers based on file path
        if "unit" in str(item.fspath):
            item.add_marker(pytest.mark.unit)
        elif "integration" in str(item.fspath):
            item.add_marker(pytest.mark.integration)
        elif "performance" in str(item.fspath):
            item.add_marker(pytest.mark.performance)
        elif "ui" in str(item.fspath):
            item.add_marker(pytest.mark.ui) 