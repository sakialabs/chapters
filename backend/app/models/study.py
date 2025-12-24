"""Study models - Draft, DraftBlock, Note, Footnote"""
from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Enum, JSON, ARRAY
from sqlalchemy.orm import relationship

from app.database import Base
from app.models.chapter import BlockType


class Draft(Base):
    """Draft model - unpublished chapter in progress"""
    __tablename__ = "drafts"

    id = Column(Integer, primary_key=True, index=True)
    author_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    
    # Content
    title = Column(String, nullable=True)
    
    # Metadata (same as Chapter for consistency)
    mood = Column(String, nullable=True)
    theme = Column(String, nullable=True)
    time_period = Column(String, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)
    
    # Relationships
    author = relationship("User", back_populates="drafts")
    blocks = relationship("DraftBlock", back_populates="draft", cascade="all, delete-orphan", order_by="DraftBlock.position")
    footnotes = relationship("Footnote", back_populates="draft", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Draft(id={self.id}, title='{self.title}', author_id={self.author_id})>"


class DraftBlock(Base):
    """DraftBlock model - individual content blocks within a draft"""
    __tablename__ = "draft_blocks"

    id = Column(Integer, primary_key=True, index=True)
    draft_id = Column(Integer, ForeignKey("drafts.id", ondelete="CASCADE"), nullable=False, index=True)
    
    # Block configuration
    position = Column(Integer, nullable=False)
    block_type = Column(Enum(BlockType), nullable=False)
    
    # Content stored as JSONB (same structure as ChapterBlock)
    content = Column(JSON, nullable=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)
    
    # Relationships
    draft = relationship("Draft", back_populates="blocks")
    footnotes = relationship("Footnote", back_populates="draft_block", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<DraftBlock(id={self.id}, draft_id={self.draft_id}, type={self.block_type}, position={self.position})>"


class Note(Base):
    """Note model - private notes and fragments in Note Nook"""
    __tablename__ = "notes"

    id = Column(Integer, primary_key=True, index=True)
    author_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    
    # Content
    title = Column(String, nullable=True)
    content = Column(Text, nullable=False)
    
    # Optional voice memo
    voice_memo_url = Column(String, nullable=True)
    
    # Tags for organization
    tags = Column(ARRAY(String), default=list, nullable=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)
    
    # Relationships
    author = relationship("User", back_populates="notes")
    
    def __repr__(self):
        return f"<Note(id={self.id}, title='{self.title}', author_id={self.author_id})>"


class Footnote(Base):
    """Footnote model - private annotations on drafts or chapters"""
    __tablename__ = "footnotes"

    id = Column(Integer, primary_key=True, index=True)
    author_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    
    # Reference to draft OR chapter (one must be set)
    draft_id = Column(Integer, ForeignKey("drafts.id", ondelete="CASCADE"), nullable=True, index=True)
    chapter_id = Column(Integer, ForeignKey("chapters.id", ondelete="CASCADE"), nullable=True, index=True)
    
    # Optional reference to specific block
    draft_block_id = Column(Integer, ForeignKey("draft_blocks.id", ondelete="CASCADE"), nullable=True, index=True)
    chapter_block_id = Column(Integer, ForeignKey("chapter_blocks.id", ondelete="CASCADE"), nullable=True, index=True)
    
    # Optional text range for highlighting
    # {"start": 0, "end": 50} for character positions
    text_range = Column(JSON, nullable=True)
    
    # Footnote content
    content = Column(Text, nullable=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)
    
    # Relationships
    draft = relationship("Draft", back_populates="footnotes")
    draft_block = relationship("DraftBlock", back_populates="footnotes")
    
    def __repr__(self):
        return f"<Footnote(id={self.id}, draft_id={self.draft_id}, chapter_id={self.chapter_id})>"
