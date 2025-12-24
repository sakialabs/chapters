"""Embedding models - ChapterEmbedding and UserTasteProfile"""
from datetime import datetime, timezone
from sqlalchemy import Column, Integer, DateTime, ForeignKey, Index
from sqlalchemy.orm import relationship
from pgvector.sqlalchemy import Vector

from app.database import Base


class ChapterEmbedding(Base):
    """Chapter embedding for semantic search and recommendations"""
    __tablename__ = "chapter_embeddings"
    __table_args__ = (
        Index("ix_chapter_embeddings_chapter_id", "chapter_id"),
    )

    id = Column(Integer, primary_key=True, index=True)
    chapter_id = Column(Integer, ForeignKey("chapters.id", ondelete="CASCADE"), unique=True, nullable=False)
    
    # Embedding vector (OpenAI text-embedding-3-small produces 1536 dimensions)
    embedding = Column(Vector(1536), nullable=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)
    
    # Relationships
    chapter = relationship("Chapter", back_populates="embedding")
    
    def __repr__(self):
        return f"<ChapterEmbedding(id={self.id}, chapter_id={self.chapter_id})>"


class UserTasteProfile(Base):
    """User taste profile for personalized recommendations"""
    __tablename__ = "user_taste_profiles"
    __table_args__ = (
        Index("ix_user_taste_profiles_user_id", "user_id"),
    )

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    
    # Taste embedding vector (same dimensions as chapter embeddings)
    embedding = Column(Vector(1536), nullable=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)
    
    # Relationships
    user = relationship("User", back_populates="taste_profile")
    
    def __repr__(self):
        return f"<UserTasteProfile(id={self.id}, user_id={self.user_id})>"
