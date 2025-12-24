"""Engagement models - Follow, Heart, Bookmark"""
from datetime import datetime, timezone
from sqlalchemy import Column, Integer, DateTime, ForeignKey, UniqueConstraint, Index
from sqlalchemy.orm import relationship

from app.database import Base


class Follow(Base):
    """Follow relationship between users"""
    __tablename__ = "follows"
    __table_args__ = (
        UniqueConstraint("follower_id", "followed_id", name="uq_follow_relationship"),
        Index("ix_follows_follower_id", "follower_id"),
        Index("ix_follows_followed_id", "followed_id"),
    )

    id = Column(Integer, primary_key=True, index=True)
    follower_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    followed_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    
    # Relationships
    follower = relationship("User", foreign_keys=[follower_id], back_populates="following")
    followed = relationship("User", foreign_keys=[followed_id], back_populates="followers")
    
    def __repr__(self):
        return f"<Follow(follower_id={self.follower_id}, followed_id={self.followed_id})>"


class Heart(Base):
    """Heart (like) on a chapter"""
    __tablename__ = "hearts"
    __table_args__ = (
        UniqueConstraint("user_id", "chapter_id", name="uq_heart_user_chapter"),
        Index("ix_hearts_user_id", "user_id"),
        Index("ix_hearts_chapter_id", "chapter_id"),
    )

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    chapter_id = Column(Integer, ForeignKey("chapters.id", ondelete="CASCADE"), nullable=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    
    # Relationships
    user = relationship("User", back_populates="hearts")
    chapter = relationship("Chapter", back_populates="hearts")
    
    def __repr__(self):
        return f"<Heart(user_id={self.user_id}, chapter_id={self.chapter_id})>"


class Bookmark(Base):
    """Bookmark (save) on a chapter"""
    __tablename__ = "bookmarks"
    __table_args__ = (
        UniqueConstraint("user_id", "chapter_id", name="uq_bookmark_user_chapter"),
        Index("ix_bookmarks_user_id", "user_id"),
        Index("ix_bookmarks_chapter_id", "chapter_id"),
    )

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    chapter_id = Column(Integer, ForeignKey("chapters.id", ondelete="CASCADE"), nullable=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False, index=True)
    
    # Relationships
    user = relationship("User", back_populates="bookmarks")
    chapter = relationship("Chapter", back_populates="bookmarks")
    
    def __repr__(self):
        return f"<Bookmark(user_id={self.user_id}, chapter_id={self.chapter_id})>"
