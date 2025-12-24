"""Margins schemas"""
from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class MarginCreate(BaseModel):
    """Create margin request"""
    content: str
    block_id: Optional[int] = None


class MarginResponse(BaseModel):
    """Margin response"""
    id: int
    author_id: int
    chapter_id: int
    block_id: Optional[int]
    content: str
    created_at: datetime
    
    class Config:
        from_attributes = True
