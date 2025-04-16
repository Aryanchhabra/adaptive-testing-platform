import os
import bcrypt
from bson import ObjectId
from typing import Optional, List, Dict, Any
from datetime import datetime
from database.mongodb import get_db
from models.user import User

class UserService:
    """Service for user-related database operations"""
    
    async def create_user(self, user_data: Dict[str, Any]) -> str:
        """Create a new user in the database"""
        db = get_db()
        
        # Hash password if provided
        if "password" in user_data:
            password = user_data.pop("password")
            salt = bcrypt.gensalt()
            user_data["password_hash"] = bcrypt.hashpw(password.encode(), salt).decode()
        
        # Set defaults
        if "created_at" not in user_data:
            user_data["created_at"] = datetime.utcnow()
            
        # Insert user
        result = db.users.insert_one(user_data)
        return str(result.inserted_id)
    
    async def get_user_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        """Get user by email"""
        db = get_db()
        user = db.users.find_one({"email": email})
        if user:
            user["id"] = str(user.pop("_id"))
        return user
    
    async def get_user_by_id(self, user_id: str) -> Optional[Dict[str, Any]]:
        """Get user by ID"""
        db = get_db()
        user = db.users.find_one({"_id": ObjectId(user_id)})
        if user:
            user["id"] = str(user.pop("_id"))
        return user
    
    async def verify_password(self, email: str, password: str) -> Optional[Dict[str, Any]]:
        """Verify user password"""
        user = await self.get_user_by_email(email)
        if not user or "password_hash" not in user:
            return None
            
        # Verify password
        if bcrypt.checkpw(password.encode(), user["password_hash"].encode()):
            # Update last login
            await self.update_last_login(user["id"])
            return user
            
        return None
    
    async def update_last_login(self, user_id: str) -> None:
        """Update user's last login time"""
        db = get_db()
        db.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"last_login": datetime.utcnow()}}
        )
    
    async def update_knowledge_state(self, user_id: str, knowledge_state: Dict) -> None:
        """Update user's knowledge state"""
        db = get_db()
        db.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"knowledge_state": knowledge_state}}
        )
    
    async def add_quiz_session(self, user_id: str, session_id: str) -> None:
        """Add quiz session to user's history"""
        db = get_db()
        db.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$push": {"quiz_history": session_id}}
        )
    
    async def is_admin(self, user_id: str) -> bool:
        """Check if user is admin"""
        user = await self.get_user_by_id(user_id)
        return user and user.get("is_admin", False)
    
    async def get_all_users(self, skip: int = 0, limit: int = 100) -> List[Dict[str, Any]]:
        """Get all users with pagination"""
        db = get_db()
        users = list(db.users.find().skip(skip).limit(limit))
        for user in users:
            user["id"] = str(user.pop("_id"))
            # Remove sensitive data
            if "password_hash" in user:
                del user["password_hash"]
        return users 