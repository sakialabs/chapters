"""Between the Lines models - Thread, Invite, Message, Pin"""
from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Enum, Index, CheckConstraint
from sqlalchemy.orm import relationship
import enum

from app.database import Base


class BTLThreadStatus(str, enum.Enum):
    """Status of a Between the Lines thread"""
    OPEN = "open"
    CLOSED = "closed"


class BTLInviteStatus(str, enum.Enum):
    """Status of a Between the Lines invite"""
    PENDING = "pending"
    ACCEPTED = "accepted"
    DECLINED = "declined"


class BetweenTheLinesThread(Base):
    """Between the Lines thread - private connection space between two users"""
    __tablename__ = "btl_threads"
    __table_args__ = (
        Index("ix_btl_threads_participant1_id", "participant1_id"),
        Index("ix_btl_threads_participant2_id", "participant2_id"),
    )

    id = Column(Integer, primary_key=True, index=True)
    
    # Participants (ordered by ID for consistency)
    participant1_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    participant2_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    # Thread status
    status = Column(Enum(BTLThreadStatus), default=BTLThreadStatus.OPEN, nullable=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    closed_at = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    messages = relationship("BetweenTheLinesMessage", back_populates="thread", cascade="all, delete-orphan", order_by="BetweenTheLinesMessage.created_at")
    pins = relationship("BetweenTheLinesPin", back_populates="thread", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<BTLThread(id={self.id}, participants=[{self.participant1_id}, {self.participant2_id}], status={self.status})>"


class BetweenTheLinesInvite(Base):
    """Between the Lines invite - invitation to create a connection"""
    __tablename__ = "btl_invites"
    __table_args__ = (
        Index("ix_btl_invites_sender_id", "sender_id"),
        Index("ix_btl_invites_recipient_id", "recipient_id"),
        Index("ix_btl_invites_status", "status"),
    )

    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    recipient_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    # Invite content (required)
    note = Column(Text, nullable=True)
    quoted_line = Column(Text, nullable=True)
    
    # Status
    status = Column(Enum(BTLInviteStatus), default=BTLInviteStatus.PENDING, nullable=False)
    
    # Reference to created thread (if accepted)
    thread_id = Column(Integer, ForeignKey("btl_threads.id", ondelete="SET NULL"), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    responded_at = Column(DateTime(timezone=True), nullable=True)
    
    def __repr__(self):
        return f"<BTLInvite(id={self.id}, sender_id={self.sender_id}, recipient_id={self.recipient_id}, status={self.status})>"


class BetweenTheLinesMessage(Base):
    """Between the Lines message - chat message in a thread"""
    __tablename__ = "btl_messages"
    __table_args__ = (
        Index("ix_btl_messages_thread_id", "thread_id"),
        Index("ix_btl_messages_sender_id", "sender_id"),
    )

    id = Column(Integer, primary_key=True, index=True)
    thread_id = Column(Integer, ForeignKey("btl_threads.id", ondelete="CASCADE"), nullable=False)
    sender_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    # Message content
    content = Column(Text, nullable=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    
    # Relationships
    thread = relationship("BetweenTheLinesThread", back_populates="messages")
    
    def __repr__(self):
        return f"<BTLMessage(id={self.id}, thread_id={self.thread_id}, sender_id={self.sender_id})>"


class BetweenTheLinesPin(Base):
    """Between the Lines pin - pinned chapter excerpt in a thread"""
    __tablename__ = "btl_pins"
    __table_args__ = (
        Index("ix_btl_pins_thread_id", "thread_id"),
        Index("ix_btl_pins_chapter_id", "chapter_id"),
    )

    id = Column(Integer, primary_key=True, index=True)
    thread_id = Column(Integer, ForeignKey("btl_threads.id", ondelete="CASCADE"), nullable=False)
    chapter_id = Column(Integer, ForeignKey("chapters.id", ondelete="CASCADE"), nullable=False)
    pinner_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    # Excerpt text
    excerpt = Column(Text, nullable=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    
    # Relationships
    thread = relationship("BetweenTheLinesThread", back_populates="pins")
    
    def __repr__(self):
        return f"<BTLPin(id={self.id}, thread_id={self.thread_id}, chapter_id={self.chapter_id})>"
