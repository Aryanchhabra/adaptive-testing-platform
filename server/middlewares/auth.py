import os
import jwt
from jwt.exceptions import PyJWTError
from fastapi import Depends, HTTPException, status, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional, Dict, Any
from datetime import datetime
from services.user_service import UserService

# Initialize
security = HTTPBearer()
user_service = UserService()

# JWT settings
JWT_SECRET = os.getenv("JWT_SECRET", "your-adaptive-testing-secret-key")
JWT_ALGORITHM = "HS256"

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> Dict[str, Any]:
    """Get current user from JWT token"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid authentication credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        # Get token
        token = credentials.credentials
        
        # Decode token
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
        
        # Check token expiration
        if "exp" in payload and payload["exp"] < datetime.utcnow().timestamp():
            raise credentials_exception
    except PyJWTError:
        raise credentials_exception
    
    # Get user from database
    user = await user_service.get_user_by_id(user_id)
    if user is None:
        raise credentials_exception
    
    # Remove sensitive data
    if "password_hash" in user:
        del user["password_hash"]
    
    return user

async def get_optional_user(request: Request) -> Optional[Dict[str, Any]]:
    """Get current user if authenticated, None otherwise"""
    try:
        auth_header = request.headers.get("Authorization")
        if not auth_header:
            return None
            
        scheme, token = auth_header.split()
        if scheme.lower() != "bearer":
            return None
            
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id = payload.get("sub")
        if not user_id:
            return None
            
        user = await user_service.get_user_by_id(user_id)
        if not user:
            return None
            
        # Remove sensitive data
        if "password_hash" in user:
            del user["password_hash"]
            
        return user
    except Exception:
        return None

async def get_admin_user(user: Dict[str, Any] = Depends(get_current_user)) -> Dict[str, Any]:
    """Check if current user is admin"""
    if not user.get("is_admin", False):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized. Admin access required."
        )
    return user 