import os
import jwt
from fastapi import APIRouter, Depends, HTTPException, status, Request
from pydantic import BaseModel, EmailStr
from typing import Dict, Any, Optional, List
from datetime import datetime, timedelta
from services.user_service import UserService
from middlewares.auth import get_current_user, get_admin_user

# Initialize router
router = APIRouter(tags=["auth"])
user_service = UserService()

# JWT settings
JWT_SECRET = os.getenv("JWT_SECRET", "your-adaptive-testing-secret-key")
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_MINUTES = 60 * 24 * 7  # 7 days

# Models
class UserRegister(BaseModel):
    email: str
    password: str
    display_name: str

class UserLogin(BaseModel):
    email: str
    password: str

class GoogleLogin(BaseModel):
    token: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Dict[str, Any]

# Routes
@router.post("/api/auth/register", response_model=Token)
async def register(user_data: UserRegister):
    """Register a new user"""
    # Check if email already exists
    existing_user = await user_service.get_user_by_email(user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create user
    user_dict = user_data.dict()
    user_id = await user_service.create_user(user_dict)
    
    # Get created user
    user = await user_service.get_user_by_id(user_id)
    
    # Generate token
    access_token = create_access_token(data={"sub": user["id"]})
    
    # Remove sensitive info
    if "password_hash" in user:
        del user["password_hash"]
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

@router.post("/api/auth/login", response_model=Token)
async def login(user_data: UserLogin):
    """Login with email and password"""
    user = await user_service.verify_password(user_data.email, user_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Generate token
    access_token = create_access_token(data={"sub": user["id"]})
    
    # Remove sensitive info
    if "password_hash" in user:
        del user["password_hash"]
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

@router.post("/api/auth/google", response_model=Token)
async def google_login(token_data: GoogleLogin):
    """Login with Google token"""
    try:
        # Verify Google token - in a production app, we'd implement proper verification
        # This is a simplified version
        google_user_info = verify_google_token(token_data.token)
        
        if not google_user_info:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid Google token"
            )
        
        # Find or create user
        user = await user_service.get_user_by_email(google_user_info["email"])
        if not user:
            # Create user from Google info
            user_data = {
                "email": google_user_info["email"],
                "display_name": google_user_info["name"],
                "auth_provider": "google",
                "is_admin": False  # Default
            }
            user_id = await user_service.create_user(user_data)
            user = await user_service.get_user_by_id(user_id)
        
        # Update last login
        await user_service.update_last_login(user["id"])
        
        # Generate token
        access_token = create_access_token(data={"sub": user["id"]})
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": user
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error during Google login: {str(e)}"
        )

@router.get("/api/auth/me")
async def get_user_profile(current_user: Dict[str, Any] = Depends(get_current_user)):
    """Get current user profile"""
    return current_user

@router.get("/api/auth/users", response_model=List[Dict[str, Any]])
async def get_all_users(admin_user: Dict[str, Any] = Depends(get_admin_user), 
                        skip: int = 0, limit: int = 100):
    """Get all users (admin only)"""
    return await user_service.get_all_users(skip, limit)

# Helper functions
def create_access_token(data: Dict[str, Any]) -> str:
    """Create JWT access token"""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=JWT_EXPIRATION_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)

def verify_google_token(token: str) -> Optional[Dict[str, Any]]:
    """Verify Google OAuth token"""
    # In a production environment, use Google's API to verify token
    # For development, just return mock data
    # TODO: Implement proper Google token verification
    return {
        "email": "user@example.com",
        "name": "Google User"
    } 