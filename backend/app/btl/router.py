"""Between the Lines routes - Private messaging"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from typing import List
from datetime import datetime, timezone

from app.database import get_db
from app.models import (
    User, BetweenTheLinesInvite, BetweenTheLinesThread,
    BetweenTheLinesMessage, BetweenTheLinesPin
)
from app.auth.security import get_current_user
from app.btl.schemas import (
    InviteCreate, InviteResponse,
    ThreadResponse, MessageCreate, MessageResponse,
    PinCreate, PinResponse
)
from app.btl.service import check_btl_eligibility

router = APIRouter(prefix="/between-the-lines", tags=["Between the Lines"])


# ============================================================================
# INVITES
# ============================================================================

@router.post("/invites", response_model=InviteResponse, status_code=status.HTTP_201_CREATED)
async def create_invite(
    invite_data: InviteCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Send a Between the Lines invite.
    
    Requirements:
    - Mutual follow relationship
    - Both users have 3+ published chapters
    - No block relationship
    - Must include note or quoted_line
    - Rate limit: 3 invites per day
    """
    # Validate note or quoted_line
    if not invite_data.note and not invite_data.quoted_line:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Must include either a note or quoted line"
        )
    
    # Get recipient
    recipient = db.query(User).filter(User.id == invite_data.recipient_id).first()
    
    if not recipient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recipient not found"
        )
    
    # Check eligibility
    eligible, reason = check_btl_eligibility(current_user, recipient, db)
    
    if not eligible:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=reason
        )
    
    # Check for existing pending invite
    existing = db.query(BetweenTheLinesInvite).filter(
        BetweenTheLinesInvite.sender_id == current_user.id,
        BetweenTheLinesInvite.recipient_id == recipient.id,
        BetweenTheLinesInvite.status == 'pending'
    ).first()
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You already have a pending invite to this user"
        )
    
    # Create invite
    invite = BetweenTheLinesInvite(
        sender_id=current_user.id,
        recipient_id=recipient.id,
        note=invite_data.note,
        quoted_line=invite_data.quoted_line,
        status='pending'
    )
    db.add(invite)
    db.commit()
    db.refresh(invite)
    
    return invite


@router.get("/invites", response_model=List[InviteResponse])
async def list_invites(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List pending invites (received by current user)"""
    invites = db.query(BetweenTheLinesInvite).filter(
        BetweenTheLinesInvite.recipient_id == current_user.id,
        BetweenTheLinesInvite.status == 'pending'
    ).order_by(BetweenTheLinesInvite.created_at.desc()).all()
    
    return invites


@router.post("/invites/{invite_id}/accept", response_model=ThreadResponse)
async def accept_invite(
    invite_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Accept a Between the Lines invite and create thread"""
    invite = db.query(BetweenTheLinesInvite).filter(
        BetweenTheLinesInvite.id == invite_id
    ).first()
    
    if not invite:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invite not found"
        )
    
    if invite.recipient_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only accept invites sent to you"
        )
    
    if invite.status != 'pending':
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invite is no longer pending"
        )
    
    # Update invite status
    invite.status = 'accepted'
    
    # Create thread
    thread = BetweenTheLinesThread(
        participant1_id=invite.sender_id,
        participant2_id=invite.recipient_id,
        status='open'
    )
    db.add(thread)
    db.commit()
    db.refresh(thread)
    
    return thread


@router.post("/invites/{invite_id}/decline", status_code=status.HTTP_204_NO_CONTENT)
async def decline_invite(
    invite_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Decline a Between the Lines invite"""
    invite = db.query(BetweenTheLinesInvite).filter(
        BetweenTheLinesInvite.id == invite_id
    ).first()
    
    if not invite:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invite not found"
        )
    
    if invite.recipient_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only decline invites sent to you"
        )
    
    if invite.status != 'pending':
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invite is no longer pending"
        )
    
    # Update invite status
    invite.status = 'declined'
    db.commit()
    
    return None


# ============================================================================
# THREADS
# ============================================================================

@router.get("/threads", response_model=List[ThreadResponse])
async def list_threads(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List user's Between the Lines threads"""
    threads = db.query(BetweenTheLinesThread).filter(
        or_(
            BetweenTheLinesThread.participant1_id == current_user.id,
            BetweenTheLinesThread.participant2_id == current_user.id
        )
    ).order_by(BetweenTheLinesThread.created_at.desc()).all()
    
    return threads


@router.get("/threads/{thread_id}/messages", response_model=List[MessageResponse])
async def get_thread_messages(
    thread_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get messages in a thread"""
    thread = db.query(BetweenTheLinesThread).filter(
        BetweenTheLinesThread.id == thread_id
    ).first()
    
    if not thread:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Thread not found"
        )
    
    # Verify user is a participant
    if current_user.id not in [thread.participant1_id, thread.participant2_id]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not a participant in this thread"
        )
    
    # Get messages
    messages = db.query(BetweenTheLinesMessage).filter(
        BetweenTheLinesMessage.thread_id == thread_id
    ).order_by(BetweenTheLinesMessage.created_at.asc()).all()
    
    return messages


# ============================================================================
# MESSAGES
# ============================================================================

@router.post("/threads/{thread_id}/messages", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
async def create_message(
    thread_id: int,
    message_data: MessageCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Send a message in a thread"""
    thread = db.query(BetweenTheLinesThread).filter(
        BetweenTheLinesThread.id == thread_id
    ).first()
    
    if not thread:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Thread not found"
        )
    
    # Verify user is a participant
    if current_user.id not in [thread.participant1_id, thread.participant2_id]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not a participant in this thread"
        )
    
    # Check thread is open
    if thread.status != 'open':
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot send messages in a closed thread"
        )
    
    # Create message
    message = BetweenTheLinesMessage(
        thread_id=thread_id,
        sender_id=current_user.id,
        content=message_data.content
    )
    db.add(message)
    db.commit()
    db.refresh(message)
    
    return message


@router.post("/threads/{thread_id}/close", status_code=status.HTTP_204_NO_CONTENT)
async def close_thread(
    thread_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Close a thread (either participant can close)"""
    thread = db.query(BetweenTheLinesThread).filter(
        BetweenTheLinesThread.id == thread_id
    ).first()
    
    if not thread:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Thread not found"
        )
    
    # Verify user is a participant
    if current_user.id not in [thread.participant1_id, thread.participant2_id]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not a participant in this thread"
        )
    
    if thread.status == 'closed':
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Thread is already closed"
        )
    
    # Close thread
    thread.status = 'closed'
    thread.closed_at = datetime.now(timezone.utc)
    db.commit()
    
    return None


# ============================================================================
# PINS
# ============================================================================

@router.post("/threads/{thread_id}/pins", response_model=PinResponse, status_code=status.HTTP_201_CREATED)
async def create_pin(
    thread_id: int,
    pin_data: PinCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Pin a chapter excerpt to a thread"""
    thread = db.query(BetweenTheLinesThread).filter(
        BetweenTheLinesThread.id == thread_id
    ).first()
    
    if not thread:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Thread not found"
        )
    
    # Verify user is a participant
    if current_user.id not in [thread.participant1_id, thread.participant2_id]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not a participant in this thread"
        )
    
    # Create pin
    pin = BetweenTheLinesPin(
        thread_id=thread_id,
        user_id=current_user.id,
        chapter_id=pin_data.chapter_id,
        excerpt=pin_data.excerpt
    )
    db.add(pin)
    db.commit()
    db.refresh(pin)
    
    return pin


@router.get("/threads/{thread_id}/pins", response_model=List[PinResponse])
async def list_pins(
    thread_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List pins in a thread"""
    thread = db.query(BetweenTheLinesThread).filter(
        BetweenTheLinesThread.id == thread_id
    ).first()
    
    if not thread:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Thread not found"
        )
    
    # Verify user is a participant
    if current_user.id not in [thread.participant1_id, thread.participant2_id]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not a participant in this thread"
        )
    
    # Get pins
    pins = db.query(BetweenTheLinesPin).filter(
        BetweenTheLinesPin.thread_id == thread_id
    ).order_by(BetweenTheLinesPin.created_at.desc()).all()
    
    return pins
