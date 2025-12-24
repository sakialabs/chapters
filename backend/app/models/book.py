"""Book model (user profile)"""
from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Boolean, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship

from app.database import Base


class Book(Base):
    """Book model - represents a user's profile and collection of chapters"""
    __tablename__ = "books"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    
    # Profile information
    display_name = Column(String, nullable=True)
    bio = Column(Text, nullable=True)
    cover_image_url = Column(String, nullable=True)
    
    # Privacy settings
    is_private = Column(Boolean, default=False, nullable=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)
    
    # Relationships
    user = relationship("User", back_populates="book")
    
    def __repr__(self):
        return f"<Book(id={self.id}, user_id={self.user_id})>"
