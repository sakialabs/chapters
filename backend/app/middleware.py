"""Custom middleware"""
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
import time

from app.logging_config import logger


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """Log all API requests"""
    
    async def dispatch(self, request: Request, call_next):
        # Start timer
        start_time = time.time()
        
        # Get user info if available
        user_id = None
        if hasattr(request.state, 'user'):
            user_id = request.state.user.id
        
        # Process request
        response = await call_next(request)
        
        # Calculate duration
        duration = time.time() - start_time
        
        # Log request
        logger.info(
            f"{request.method} {request.url.path} - "
            f"Status: {response.status_code} - "
            f"Duration: {duration:.3f}s - "
            f"User: {user_id or 'anonymous'}"
        )
        
        return response


class RateLimitHeaderMiddleware(BaseHTTPMiddleware):
    """Add rate limit headers to responses"""
    
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        
        # Add rate limit headers for 429 responses
        if response.status_code == 429:
            response.headers["Retry-After"] = "3600"  # 1 hour
        
        return response
