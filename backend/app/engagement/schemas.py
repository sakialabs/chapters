"""Engagement schemas"""
from pydantic import BaseModel
from datetime import datetime


class HeartResponse(BaseModel):
    """Heart response"""
    id: int
    user_id: int
    chapter_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True


class FollowResponse(BaseModel):
    """Follow response"""
    id: int
    follower_id: int
    followed_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True


class BookmarkResponse(BaseModel):
    """Bookmark response"""
    id: int
    user_id: int
    chapter_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True
