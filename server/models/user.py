from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field, EmailStr

class User(BaseModel):
    """User model for authentication and profile data"""
    id: Optional[str] = None
    email: str
    password_hash: Optional[str] = None  # For non-OAuth users
    display_name: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_login: Optional[datetime] = None
    is_admin: bool = False
    auth_provider: str = "email"  # "email", "google", etc.
    quiz_history: List[str] = Field(default_factory=list)  # List of quiz session IDs
    knowledge_state: Dict[str, Any] = Field(default_factory=dict)  # User's knowledge state
    
    class Config:
        """Configuration for the User model"""
        schema_extra = {
            "example": {
                "email": "user@example.com",
                "display_name": "Example User",
                "password_hash": "hashed_password",
                "is_admin": False,
                "auth_provider": "email",
                "quiz_history": ["session1", "session2"],
                "knowledge_state": {
                    "Basic Python Syntax": {"level": 0.8, "status": "Advanced"},
                    "Data Types": {"level": 0.5, "status": "Intermediate"}
                }
            }
        } 