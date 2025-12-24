"""Between the Lines service - Eligibility and business logic"""
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
import redis
from datetime import datetime, timezone

from app.models import User, Follow, Chapter, Block as BlockModel
from app.config import settings

# Redis client for rate limiting
redis_client = redis.from_url(settings.redis_url)


def check_mutual_follow(user1_id: int, user2_id: int, db: Session) -> bool:
    """Check if two users follow each other"""
    follow1 = db.query(Follow).filter(
        Follow.follower_id == user1_id,
        Follow.followed_id == user2_id
    ).first()
    
    follow2 = db.query(Follow).filter(
        Follow.follower_id == user2_id,
        Follow.followed_id == user1_id
    ).first()
    
    return follow1 is not None and follow2 is not None


def check_chapter_minimum(user_id: int, db: Session) -> bool:
    """Check if user has at least 3 published chapters"""
    count = db.query(Chapter).filter(
        Chapter.author_id == user_id
    ).count()
    
    return count >= 3


def check_not_blocked(user1_id: int, user2_id: int, db: Session) -> bool:
    """Check if users have not blocked each other"""
    block = db.query(BlockModel).filter(
        or_(
            and_(BlockModel.blocker_id == user1_id, BlockModel.blocked_id == user2_id),
            and_(BlockModel.blocker_id == user2_id, BlockModel.blocked_id == user1_id)
        )
    ).first()
    
    return block is None


def check_invite_rate_limit(user_id: int) -> bool:
    """Check if user has exceeded BTL invite rate limit (3 per day)"""
    key = f"btl_invite_rate_limit:{user_id}"
    count = redis_client.get(key)
    
    if count is None:
        redis_client.setex(key, 86400, 1)  # 24 hours
        return True
    
    count = int(count)
    if count >= settings.btl_invite_rate_limit:
        return False
    
    redis_client.incr(key)
    return True


def check_btl_eligibility(sender: User, recipient: User, db: Session) -> tuple[bool, str]:
    """
    Check if sender can invite recipient to Between the Lines.
    
    Requirements:
    1. Mutual follow relationship
    2. Both users have 3+ published chapters
    3. No block relationship
    4. Rate limit not exceeded (3 invites/day)
    
    Returns:
        (eligible, reason) - True if eligible, False with reason if not
    """
    # Check mutual follow
    if not check_mutual_follow(sender.id, recipient.id, db):
        return False, "You must follow each other to start Between the Lines"
    
    # Check sender chapter minimum
    if not check_chapter_minimum(sender.id, db):
        return False, "You need at least 3 published chapters to send invites"
    
    # Check recipient chapter minimum
    if not check_chapter_minimum(recipient.id, db):
        return False, "Recipient needs at least 3 published chapters"
    
    # Check not blocked
    if not check_not_blocked(sender.id, recipient.id, db):
        return False, "Cannot invite blocked users"
    
    # Check rate limit
    if not check_invite_rate_limit(sender.id):
        return False, f"Rate limit exceeded. Maximum {settings.btl_invite_rate_limit} invites per day"
    
    return True, ""
