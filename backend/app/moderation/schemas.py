"""Moderation schemas"""
from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class BlockResponse(BaseModel):
    """Block response"""
    id: int
    blocker_id: int
    blocked_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True


class ReportCreate(BaseModel):
    """Create report request"""
    reported_user_id: Optional[int] = None
    reported_chapter_id: Optional[int] = None
    reason: str
    details: str


class ReportResponse(BaseModel):
    """Report response"""
    id: int
    reporter_id: int
    reported_user_id: Optional[int]
    reported_chapter_id: Optional[int]
    reason: str
    details: str
    status: str
    created_at: datetime
    
    class Config:
        from_attributes = True
