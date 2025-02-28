from pydantic import BaseModel
from typing import Dict, Any

class AnswerSubmission(BaseModel):
    session_id: int
    answer_data: Dict[str, Any]

    class Config:
        arbitrary_types_allowed = True
        schema_extra = {
            "example": {
                "session_id": 0,
                "answer_data": {
                    "selected_answer": 0,
                    "response_time": 0
                }
            }
        } 