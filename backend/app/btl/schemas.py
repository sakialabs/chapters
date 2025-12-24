"""Between the Lines schemas"""
from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List


class InviteCreate(BaseModel):
    """Create BTL invite request"""
    recipient_id: int
    note: Optional[str] = None
    quoted_line: Optional[str] = None


class InviteResponse(BaseModel):
    """BTL invite response"""
    id: int
    sender_id: int
    recipient_id: int
    note: Optional[str]
    quoted_line: Optional[str]
    status: str
    created_at: datetime
    
    class Config:
        from_attributes = True


class ThreadResponse(BaseModel):
    """BTL thread response"""
    id: int
    participant1_id: int
    participant2_id: int
    status: str
    created_at: datetime
    closed_at: Optional[datetime]
    
    class Config:
        from_attributes = True


class MessageCreate(BaseModel):
    """Create message request"""
    content: str


class MessageResponse(BaseModel):
    """BTL message response"""
    id: int
    thread_id: int
    sender_id: int
    content: str
    created_at: datetime
    
    class Config:
        from_attributes = True


class PinCreate(BaseModel):
    """Create pin request"""
    chapter_id: int
    excerpt: str


class PinResponse(BaseModel):
    """BTL pin response"""
    id: int
    thread_id: int
    user_id: int
    chapter_id: int
    excerpt: str
    created_at: datetime
    
    class Config:
        from_attributes = True
