from typing import List, Optional
from pydantic import BaseModel, Field
from enum import Enum
from bson import ObjectId

class DifficultyLevel(str, Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"

class TopicArea(str, Enum):
    BASIC_SYNTAX = "Basic Python Syntax"
    DATA_TYPES = "Data Types and Variables"
    CONTROL_FLOW = "Control Flow"
    FUNCTIONS = "Functions"
    OOP = "Object-Oriented Programming"
    # Add more topics as needed

class PyObjectId(str):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return str(ObjectId(v))

class Question(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    text: str = Field(..., description="The question text")
    options: List[str] = Field(..., description="List of possible answers")
    correct_answer: int = Field(..., description="Index of the correct answer")
    explanation: str = Field(..., description="Detailed explanation of the answer")
    topic: TopicArea = Field(..., description="Main topic area")
    subtopics: List[str] = Field(default=[], description="Specific concepts tested")
    difficulty: DifficultyLevel = Field(..., description="Question difficulty")
    cognitive_level: str = Field(..., description="Bloom's taxonomy level")
    avg_completion_time: Optional[float] = Field(None, description="Average time to answer in seconds")
    success_rate: Optional[float] = Field(None, description="Historical success rate")
    prerequisites: List[str] = Field(default=[], description="Required knowledge areas")

    model_config = {
        "populate_by_name": True,
        "json_encoders": {ObjectId: str},
        "arbitrary_types_allowed": True
    }

    def dict(self, *args, **kwargs):
        dict_repr = super().dict(*args, **kwargs)
        # Convert ObjectId to string for JSON serialization
        if '_id' in dict_repr:
            dict_repr['_id'] = str(dict_repr['_id'])
        return dict_repr 