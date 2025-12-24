"""Chapter schemas"""
from pydantic import BaseModel, Field, field_validator
from typing import Optional, List
from datetime import datetime
from app.models.chapter import BlockType


class ChapterBlockCreate(BaseModel):
    """Create a chapter block"""
    position: int = Field(..., ge=0, description="Position in chapter (0-indexed)")
    block_type: BlockType
    content: dict = Field(..., description="Block content as JSON")
    
    @field_validator('content')
    @classmethod
    def validate_content(cls, v, info):
        """Validate content based on block type"""
        block_type = info.data.get('block_type')
        
        if block_type == BlockType.TEXT:
            if 'text' not in v:
                raise ValueError("TEXT block must have 'text' field")
        elif block_type == BlockType.IMAGE:
            if 'url' not in v:
                raise ValueError("IMAGE block must have 'url' field")
        elif block_type == BlockType.AUDIO:
            if 'url' not in v or 'duration' not in v:
                raise ValueError("AUDIO block must have 'url' and 'duration' fields")
            if v['duration'] > 300:  # 5 minutes
                raise ValueError("Audio duration cannot exceed 5 minutes (300 seconds)")
        elif block_type == BlockType.VIDEO:
            if 'url' not in v or 'duration' not in v:
                raise ValueError("VIDEO block must have 'url' and 'duration' fields")
            if v['duration'] > 180:  # 3 minutes
                raise ValueError("Video duration cannot exceed 3 minutes (180 seconds)")
        elif block_type == BlockType.QUOTE:
            if 'text' not in v:
                raise ValueError("QUOTE block must have 'text' field")
        
        return v


class ChapterCreate(BaseModel):
    """Create a new chapter"""
    title: Optional[str] = Field(None, max_length=200)
    mood: Optional[str] = Field(None, max_length=50)
    theme: Optional[str] = Field(None, max_length=50)
    time_period: Optional[str] = Field(None, max_length=50)
    blocks: List[ChapterBlockCreate] = Field(..., min_length=1, max_length=12)
    
    @field_validator('blocks')
    @classmethod
    def validate_blocks(cls, v):
        """Validate block constraints"""
        if len(v) > 12:
            raise ValueError("Chapter cannot have more than 12 blocks")
        
        # Count media blocks
        media_types = {BlockType.IMAGE, BlockType.AUDIO, BlockType.VIDEO}
        media_count = sum(1 for block in v if block.block_type in media_types)
        
        if media_count > 2:
            raise ValueError("Chapter cannot have more than 2 media blocks (images, audio, or video)")
        
        return v
    
    class Config:
        json_schema_extra = {
            "example": {
                "title": "A Quiet Morning",
                "mood": "contemplative",
                "theme": "solitude",
                "blocks": [
                    {
                        "position": 0,
                        "block_type": "TEXT",
                        "content": {"text": "The morning light filtered through..."}
                    },
                    {
                        "position": 1,
                        "block_type": "IMAGE",
                        "content": {"url": "https://example.com/sunrise.jpg", "alt": "Sunrise"}
                    }
                ]
            }
        }


class ChapterUpdate(BaseModel):
    """Update a chapter (within edit window)"""
    title: Optional[str] = Field(None, max_length=200)
    mood: Optional[str] = Field(None, max_length=50)
    theme: Optional[str] = Field(None, max_length=50)
    time_period: Optional[str] = Field(None, max_length=50)
    blocks: Optional[List[ChapterBlockCreate]] = Field(None, min_length=1, max_length=12)
    
    @field_validator('blocks')
    @classmethod
    def validate_blocks(cls, v):
        """Validate block constraints"""
        if v is None:
            return v
            
        if len(v) > 12:
            raise ValueError("Chapter cannot have more than 12 blocks")
        
        # Count media blocks
        media_types = {BlockType.IMAGE, BlockType.AUDIO, BlockType.VIDEO}
        media_count = sum(1 for block in v if block.block_type in media_types)
        
        if media_count > 2:
            raise ValueError("Chapter cannot have more than 2 media blocks")
        
        return v


class ChapterBlockResponse(BaseModel):
    """Chapter block response"""
    id: int
    position: int
    block_type: BlockType
    content: dict
    created_at: datetime
    
    class Config:
        from_attributes = True


class ChapterAuthor(BaseModel):
    """Author information for chapter"""
    username: str
    book_id: int
    
    class Config:
        from_attributes = True


class ChapterResponse(BaseModel):
    """Chapter response"""
    id: int
    author_id: int
    title: Optional[str]
    cover_url: Optional[str]
    mood: Optional[str]
    theme: Optional[str]
    time_period: Optional[str]
    heart_count: int
    is_hearted: bool = False
    is_bookmarked: bool = False
    published_at: datetime
    edit_window_expires: datetime
    blocks: List[ChapterBlockResponse]
    author: ChapterAuthor
    
    class Config:
        from_attributes = True
