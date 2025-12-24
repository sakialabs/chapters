"""Library schemas"""
from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional


class SpineResponse(BaseModel):
    """Bookshelf spine (followed book) response"""
    book_id: int
    user_id: int
    username: str
    display_name: Optional[str]
    unread_count: int
    last_chapter_at: Optional[datetime]
    
    class Config:
        from_attributes = True


class PaginationMeta(BaseModel):
    """Pagination metadata"""
    page: int
    per_page: int
    total: int
    total_pages: int
    has_more: bool


class ChapterFeedItem(BaseModel):
    """Chapter in feed"""
    id: int
    title: str
    author_id: int
    author_username: str
    mood: Optional[str]
    theme: Optional[str]
    heart_count: int
    published_at: datetime
    
    class Config:
        from_attributes = True


class FeedResponse(BaseModel):
    """Feed response with pagination"""
    chapters: List[ChapterFeedItem]
    pagination: PaginationMeta
