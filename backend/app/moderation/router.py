"""Moderation routes - Blocking and reporting"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from typing import List

from app.database import get_db
from app.models import User, Block, Report, Follow, Book, Chapter, Margin
from app.auth.security import get_current_user
from app.moderation.schemas import BlockResponse, ReportCreate, ReportResponse

router = APIRouter(prefix="/moderation", tags=["Moderation"])


# ============================================================================
# BLOCKING
# ============================================================================

@router.post("/blocks/{user_id}", response_model=BlockResponse, status_code=status.HTTP_201_CREATED)
async def block_user(
    user_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Block a user.
    
    Effects:
    - Removes follow relationships in both directions
    - Prevents access to blocker's Book and chapters
    - Prevents margin creation on blocker's chapters
    """
    # Cannot block yourself
    if user_id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot block yourself"
        )
    
    # Check if user exists
    blocked_user = db.query(User).filter(User.id == user_id).first()
    
    if not blocked_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Check if already blocked
    existing = db.query(Block).filter(
        Block.blocker_id == current_user.id,
        Block.blocked_id == user_id
    ).first()
    
    if existing:
        return existing
    
    # Create block
    block = Block(
        blocker_id=current_user.id,
        blocked_id=user_id
    )
    db.add(block)
    
    # Remove follow relationships in both directions
    db.query(Follow).filter(
        or_(
            and_(Follow.follower_id == current_user.id, Follow.followed_id == user_id),
            and_(Follow.follower_id == user_id, Follow.followed_id == current_user.id)
        )
    ).delete()
    
    db.commit()
    db.refresh(block)
    
    return block


@router.delete("/blocks/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def unblock_user(
    user_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Unblock a user"""
    block = db.query(Block).filter(
        Block.blocker_id == current_user.id,
        Block.blocked_id == user_id
    ).first()
    
    if not block:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Block not found"
        )
    
    db.delete(block)
    db.commit()
    
    return None


@router.get("/blocks", response_model=List[BlockResponse])
async def list_blocked_users(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List users blocked by current user"""
    blocks = db.query(Block).filter(
        Block.blocker_id == current_user.id
    ).order_by(Block.created_at.desc()).all()
    
    return blocks


# ============================================================================
# REPORTING
# ============================================================================

@router.post("/reports", response_model=ReportResponse, status_code=status.HTTP_201_CREATED)
async def create_report(
    report_data: ReportCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Report a user or chapter.
    
    Must specify either reported_user_id or reported_chapter_id.
    """
    # Validate that at least one is specified
    if not report_data.reported_user_id and not report_data.reported_chapter_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Must specify either reported_user_id or reported_chapter_id"
        )
    
    # Validate user exists if specified
    if report_data.reported_user_id:
        user = db.query(User).filter(User.id == report_data.reported_user_id).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Reported user not found"
            )
    
    # Validate chapter exists if specified
    if report_data.reported_chapter_id:
        chapter = db.query(Chapter).filter(Chapter.id == report_data.reported_chapter_id).first()
        if not chapter:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Reported chapter not found"
            )
    
    # Create report
    report = Report(
        reporter_id=current_user.id,
        reported_user_id=report_data.reported_user_id,
        reported_chapter_id=report_data.reported_chapter_id,
        reason=report_data.reason,
        details=report_data.details,
        status='pending'
    )
    db.add(report)
    db.commit()
    db.refresh(report)
    
    return report


@router.get("/reports", response_model=List[ReportResponse])
async def list_reports(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List reports created by current user"""
    reports = db.query(Report).filter(
        Report.reporter_id == current_user.id
    ).order_by(Report.created_at.desc()).all()
    
    return reports


# ============================================================================
# ACCESS CONTROL HELPERS
# ============================================================================

def check_book_access(book: Book, current_user: User, db: Session) -> bool:
    """
    Check if user can access a book.
    
    Rules:
    - Owner can always access
    - If private: only owner and followers can access
    - If public: any authenticated user can access
    - Blocked users cannot access
    """
    # Check if blocked
    block = db.query(Block).filter(
        or_(
            and_(Block.blocker_id == book.user_id, Block.blocked_id == current_user.id),
            and_(Block.blocker_id == current_user.id, Block.blocked_id == book.user_id)
        )
    ).first()
    
    if block:
        return False
    
    # Owner can always access
    if book.user_id == current_user.id:
        return True
    
    # If public, anyone can access
    if not book.is_private:
        return True
    
    # If private, check if user follows
    follow = db.query(Follow).filter(
        Follow.follower_id == current_user.id,
        Follow.followed_id == book.user_id
    ).first()
    
    return follow is not None


def check_margin_permission(chapter: Chapter, current_user: User, db: Session) -> bool:
    """
    Check if user can create margins on a chapter.
    
    Rules:
    - Cannot create margins if blocked by chapter author
    """
    block = db.query(Block).filter(
        Block.blocker_id == chapter.author_id,
        Block.blocked_id == current_user.id
    ).first()
    
    return block is None
