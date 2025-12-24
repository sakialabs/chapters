"""Margin model (comments)"""
from datetime import datetime, timezone
from sqlalchemy import Column, Integer, Text, DateTime, ForeignKey, Index
from sqlalchemy.orm import relationship

from app.database import Base


class Margin(Base):
    """Margin model - comments on chapters"""
    __tablename__ = "margins"
    __table_args__ = (
        Index("ix_margins_chapter_id", "chapter_id"),
        Index("ix_margins_author_id", "author_id"),
    )

    id = Column(Integer, primary_key=True, index=True)
    author_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    chapter_id = Column(Integer, ForeignKey("chapters.id", ondelete="CASCADE"), nullable=False)
    
    # Optional reference to specific block within chapter
    block_id = Column(Integer, ForeignKey("chapter_blocks.id", ondelete="CASCADE"), nullable=True, index=True)
    
    # Comment content
    content = Column(Text, nullable=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)
    
    # Relationships
    author = relationship("User", back_populates="margins")
    chapter = relationship("Chapter", back_populates="margins")
    block = relationship("ChapterBlock", back_populates="margins")
    
    def __repr__(self):
        return f"<Margin(id={self.id}, chapter_id={self.chapter_id}, author_id={self.author_id})>"
