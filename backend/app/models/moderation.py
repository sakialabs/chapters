"""Moderation models - Block and Report"""
from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Enum, UniqueConstraint, Index
from sqlalchemy.orm import relationship
import enum

from app.database import Base


class ReportStatus(str, enum.Enum):
    """Status of a report"""
    PENDING = "pending"
    REVIEWING = "reviewing"
    RESOLVED = "resolved"
    DISMISSED = "dismissed"


class Block(Base):
    """Block relationship - user blocking another user"""
    __tablename__ = "blocks"
    __table_args__ = (
        UniqueConstraint("blocker_id", "blocked_id", name="uq_block_relationship"),
        Index("ix_blocks_blocker_id", "blocker_id"),
        Index("ix_blocks_blocked_id", "blocked_id"),
    )

    id = Column(Integer, primary_key=True, index=True)
    blocker_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    blocked_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    
    # Relationships
    blocker = relationship("User", foreign_keys=[blocker_id], back_populates="blocking")
    blocked = relationship("User", foreign_keys=[blocked_id], back_populates="blocked_by")
    
    def __repr__(self):
        return f"<Block(blocker_id={self.blocker_id}, blocked_id={self.blocked_id})>"


class Report(Base):
    """Report model - user reporting content or another user"""
    __tablename__ = "reports"
    __table_args__ = (
        Index("ix_reports_reporter_id", "reporter_id"),
        Index("ix_reports_reported_user_id", "reported_user_id"),
        Index("ix_reports_reported_chapter_id", "reported_chapter_id"),
        Index("ix_reports_status", "status"),
    )

    id = Column(Integer, primary_key=True, index=True)
    reporter_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    # What is being reported (one must be set)
    reported_user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=True)
    reported_chapter_id = Column(Integer, ForeignKey("chapters.id", ondelete="CASCADE"), nullable=True)
    
    # Report details
    reason = Column(String, nullable=False)  # e.g., "harassment", "spam", "inappropriate_content"
    details = Column(Text, nullable=False)
    
    # Status
    status = Column(Enum(ReportStatus), default=ReportStatus.PENDING, nullable=False)
    
    # Moderation notes (internal)
    moderator_notes = Column(Text, nullable=True)
    resolved_by_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    resolved_at = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    reporter = relationship("User", foreign_keys=[reporter_id], back_populates="reports_made")
    
    def __repr__(self):
        return f"<Report(id={self.id}, reporter_id={self.reporter_id}, status={self.status})>"
