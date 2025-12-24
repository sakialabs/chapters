"""Open Pages business logic"""
from datetime import datetime, timezone, timedelta
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models import User


def check_open_pages(user: User) -> int:
    """
    Check how many Open Pages a user has available.
    
    Returns:
        int: Number of available Open Pages (0-3)
    """
    return user.open_pages


def can_publish(user: User) -> bool:
    """
    Check if a user can publish a chapter.
    
    Returns:
        bool: True if user has at least 1 Open Page
    """
    return user.open_pages > 0


def consume_open_page(user: User, db: Session) -> None:
    """
    Consume one Open Page when publishing a chapter.
    
    Args:
        user: The user publishing
        db: Database session
        
    Raises:
        HTTPException: If user has no Open Pages available
    """
    if user.open_pages <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"No Open Pages available. You have {user.open_pages} Open Pages. "
                   f"Open Pages are granted daily (max 3 stored)."
        )
    
    user.open_pages -= 1
    db.commit()
    db.refresh(user)


def grant_daily_open_page(user: User, db: Session) -> bool:
    """
    Grant one Open Page to a user (daily grant logic).
    
    Rules:
    - Grant 1 Open Page per day
    - Maximum 3 Open Pages can be stored
    - Only grant if user has < 3 Open Pages
    
    Args:
        user: The user to grant Open Page to
        db: Database session
        
    Returns:
        bool: True if Open Page was granted, False if already at max
    """
    now = datetime.now(timezone.utc)
    
    # Check if user already has max Open Pages
    if user.open_pages >= 3:
        return False
    
    # Check if we've already granted today
    if user.last_open_page_grant:
        # If last grant was less than 24 hours ago, don't grant
        time_since_last_grant = now - user.last_open_page_grant
        if time_since_last_grant < timedelta(hours=24):
            return False
    
    # Grant the Open Page
    user.open_pages += 1
    user.last_open_page_grant = now
    db.commit()
    db.refresh(user)
    
    return True


def grant_open_pages_to_all_users(db: Session) -> dict:
    """
    Grant Open Pages to all eligible users (background job).
    
    This should be run daily by a background worker.
    
    Returns:
        dict: Statistics about the grant operation
    """
    users = db.query(User).all()
    
    granted_count = 0
    skipped_count = 0
    
    for user in users:
        if grant_daily_open_page(user, db):
            granted_count += 1
        else:
            skipped_count += 1
    
    return {
        "total_users": len(users),
        "granted": granted_count,
        "skipped": skipped_count,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
