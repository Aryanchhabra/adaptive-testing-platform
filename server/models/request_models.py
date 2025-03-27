from pydantic import BaseModel
from typing import Dict, Optional, Any

class AnswerSubmission(BaseModel):
    session_id: str
    question_id: Optional[str] = None
    selected_option: Optional[int] = None
    answer_data: Dict[str, Any]

    class Config:
        arbitrary_types_allowed = True
        schema_extra = {
            "example": {
                "session_id": "0",
                "question_id": None,
                "selected_option": None,
                "answer_data": {
                    "selected_answer": 0,
                    "response_time": 0
                }
            }
        } 