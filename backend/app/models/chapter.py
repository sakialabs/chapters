"""Chapter and ChapterBlock models"""
from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Enum, JSON
from sqlalchemy.orm import relationship
import enum

from app.database import Base


class BlockType(str, enum.Enum):
    """Types of content blocks"""
    TEXT = "text"
    IMAGE = "image"
    AUDIO = "audio"
    VIDEO = "video"
    QUOTE = "quote"


class Chapter(Base):
    """Chapter model - a published post"""
    __tablename__ = "chapters"

    id = Column(Integer, primary_key=True, index=True)
    author_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    
    # Content
    title = Column(String, nullable=True)
    cover_url = Column(String, nullable=True)
    
    # Metadata
    mood = Column(String, nullable=True)
    theme = Column(String, nullable=True)
    time_period = Column(String, nullable=True)  # e.g., "Chapter: 2025"
    
    # Engagement metrics
    heart_count = Column(Integer, default=0, nullable=False)
    
    # Publishing and editing
    published_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False, index=True)
    edit_window_expires = Column(DateTime(timezone=True), nullable=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)
    
    # Relationships
    author = relationship("User", back_populates="chapters")
    blocks = relationship("ChapterBlock", back_populates="chapter", cascade="all, delete-orphan", order_by="ChapterBlock.position")
    hearts = relationship("Heart", back_populates="chapter", cascade="all, delete-orphan")
    bookmarks = relationship("Bookmark", back_populates="chapter", cascade="all, delete-orphan")
    margins = relationship("Margin", back_populates="chapter", cascade="all, delete-orphan")
    embedding = relationship("ChapterEmbedding", back_populates="chapter", uselist=False, cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Chapter(id={self.id}, title='{self.title}', author_id={self.author_id})>"


class ChapterBlock(Base):
    """ChapterBlock model - individual content blocks within a chapter"""
    __tablename__ = "chapter_blocks"

    id = Column(Integer, primary_key=True, index=True)
    chapter_id = Column(Integer, ForeignKey("chapters.id", ondelete="CASCADE"), nullable=False, index=True)
    
    # Block configuration
    position = Column(Integer, nullable=False)  # Order within chapter
    block_type = Column(Enum(BlockType), nullable=False)
    
    # Content stored as JSONB for flexibility
    # For TEXT: {"text": "content"}
    # For IMAGE: {"url": "...", "alt": "...", "caption": "..."}
    # For AUDIO: {"url": "...", "duration": 300, "title": "..."}
    # For VIDEO: {"url": "...", "duration": 180, "thumbnail": "..."}
    # For QUOTE: {"text": "...", "author": "...", "source": "..."}
    content = Column(JSON, nullable=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)
    
    # Relationships
    chapter = relationship("Chapter", back_populates="blocks")
    margins = relationship("Margin", back_populates="block", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<ChapterBlock(id={self.id}, chapter_id={self.chapter_id}, type={self.block_type}, position={self.position})>"
