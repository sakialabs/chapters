"""Margins routes - Comments on chapters"""
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timezone, timedelta
import redis

from app.database import get_db
from app.models import User, Chapter, Margin
from app.auth.security import get_current_user
from app.margins.schemas import MarginCreate, MarginResponse
from app.config import settings

router = APIRouter(prefix="/margins", tags=["Margins"])

# Redis client for rate limiting
redis_client = redis.from_url(settings.redis_url)


def check_rate_limit(user_id: int) -> bool:
    """Check if user has exceeded margin creation rate limit (20 per hour)"""
    key = f"margin_rate_limit:{user_id}"
    count = redis_client.get(key)
    
    if count is None:
        # First margin in this hour
        redis_client.setex(key, 3600, 1)
        return True
    
    count = int(count)
    if count >= 20:
        return False
    
    # Increment count
    redis_client.incr(key)
    return True


# ============================================================================
# MARGINS
# ============================================================================

@router.post("/chapters/{chapter_id}/margins", response_model=MarginResponse, status_code=status.HTTP_201_CREATED)
async def create_margin(
    chapter_id: int,
    margin_data: MarginCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a margin (comment) on a chapter"""
    # Check rate limit
    if not check_rate_limit(current_user.id):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Rate limit exceeded. Maximum 20 margins per hour."
        )
    
    chapter = db.query(Chapter).filter(Chapter.id == chapter_id).first()
    
    if not chapter:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chapter not found"
        )
    
    # Check if blocked by chapter author
    from app.models import Block as BlockModel
    from sqlalchemy import and_
    
    block = db.query(BlockModel).filter(
        BlockModel.blocker_id == chapter.author_id,
        BlockModel.blocked_id == current_user.id
    ).first()
    
    if block:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You cannot comment on this chapter"
        )
    
    # Create margin
    margin = Margin(
        author_id=current_user.id,
        chapter_id=chapter_id,
        block_id=margin_data.block_id,
        content=margin_data.content
    )
    db.add(margin)
    db.commit()
    db.refresh(margin)
    return margin


@router.get("/chapters/{chapter_id}/margins", response_model=List[MarginResponse])
async def list_margins(
    chapter_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List margins for a chapter (separate from chapter endpoint)"""
    chapter = db.query(Chapter).filter(Chapter.id == chapter_id).first()
    
    if not chapter:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chapter not found"
        )
    
    margins = db.query(Margin).filter(
        Margin.chapter_id == chapter_id
    ).order_by(Margin.created_at.asc()).all()
    
    return margins


@router.delete("/margins/{margin_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_margin(
    margin_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a margin (author only)"""
    margin = db.query(Margin).filter(Margin.id == margin_id).first()
    
    if not margin:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Margin not found"
        )
    
    if margin.author_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only delete your own margins"
        )
    
    db.delete(margin)
    db.commit()
    return None
