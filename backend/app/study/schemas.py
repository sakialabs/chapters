"""Study schemas"""
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from app.models.chapter import BlockType


class DraftBlockCreate(BaseModel):
    """Create a draft block"""
    position: int = Field(..., ge=0)
    block_type: BlockType
    content: dict


class DraftCreate(BaseModel):
    """Create a new draft"""
    title: Optional[str] = Field(None, max_length=200)
    mood: Optional[str] = Field(None, max_length=50)
    theme: Optional[str] = Field(None, max_length=50)
    time_period: Optional[str] = Field(None, max_length=50)
    blocks: List[DraftBlockCreate] = Field(default_factory=list)


class DraftUpdate(BaseModel):
    """Update a draft"""
    title: Optional[str] = Field(None, max_length=200)
    mood: Optional[str] = Field(None, max_length=50)
    theme: Optional[str] = Field(None, max_length=50)
    time_period: Optional[str] = Field(None, max_length=50)
    blocks: Optional[List[DraftBlockCreate]] = None


class DraftBlockResponse(BaseModel):
    """Draft block response"""
    id: int
    position: int
    block_type: BlockType
    content: dict
    created_at: datetime
    
    class Config:
        from_attributes = True


class DraftResponse(BaseModel):
    """Draft response"""
    id: int
    author_id: int
    title: Optional[str]
    mood: Optional[str]
    theme: Optional[str]
    time_period: Optional[str]
    blocks: List[DraftBlockResponse]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class NoteCreate(BaseModel):
    """Create a new note"""
    title: Optional[str] = Field(None, max_length=200)
    content: str = Field(..., min_length=1)
    tags: List[str] = Field(default_factory=list)
    voice_memo_url: Optional[str] = None


class NoteUpdate(BaseModel):
    """Update a note"""
    title: Optional[str] = Field(None, max_length=200)
    content: Optional[str] = Field(None, min_length=1)
    tags: Optional[List[str]] = None
    voice_memo_url: Optional[str] = None


class NoteResponse(BaseModel):
    """Note response"""
    id: int
    author_id: int
    title: Optional[str]
    content: str
    tags: List[str]
    voice_memo_url: Optional[str]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
