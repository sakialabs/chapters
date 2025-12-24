"""Library routes - Feed and bookshelf"""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from typing import List
from datetime import datetime, timezone

from app.database import get_db
from app.models import User, Book, Chapter, Follow
from app.auth.security import get_current_user
from app.library.schemas import SpineResponse, FeedResponse, ChapterFeedItem, PaginationMeta
from app.chapters.schemas import ChapterResponse

router = APIRouter(prefix="/library", tags=["Library"])


# ============================================================================
# BOOKSHELF (SPINES)
# ============================================================================

@router.get("/spines", response_model=List[SpineResponse])
async def get_bookshelf_spines(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get bookshelf spines (followed books with unread indicators).
    
    Returns all books the user follows with:
    - unread_count: number of chapters published since user's last read
    - last_chapter_at: timestamp of most recent chapter
    """
    # Get all users the current user follows
    follows = db.query(Follow).filter(
        Follow.follower_id == current_user.id
    ).all()
    
    spines = []
    
    for follow in follows:
        # Get the followed user's book
        book = db.query(Book).filter(Book.user_id == follow.followed_id).first()
        
        if not book:
            continue
        
        # Get the most recent chapter
        last_chapter = db.query(Chapter).filter(
            Chapter.author_id == follow.followed_id
        ).order_by(desc(Chapter.published_at)).first()
        
        # Calculate unread count (for now, just count all chapters)
        # TODO: Track user's last read timestamp per book
        unread_count = db.query(func.count(Chapter.id)).filter(
            Chapter.author_id == follow.followed_id
        ).scalar()
        
        # Get user info
        followed_user = db.query(User).filter(User.id == follow.followed_id).first()
        
        spine = SpineResponse(
            book_id=book.id,
            user_id=followed_user.id,
            username=followed_user.username,
            display_name=book.display_name,
            unread_count=unread_count or 0,
            last_chapter_at=last_chapter.published_at if last_chapter else None
        )
        spines.append(spine)
    
    # Sort by most recent chapter first
    spines.sort(key=lambda x: x.last_chapter_at or datetime.min.replace(tzinfo=timezone.utc), reverse=True)
    
    return spines


# ============================================================================
# NEW CHAPTERS FEED
# ============================================================================

@router.get("/new", response_model=FeedResponse)
async def get_new_chapters_feed(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=50),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get new chapters feed from followed books.
    
    - Paginated results (max 50 per page)
    - Bounded to 100 total results
    - Ordered by published_at descending
    """
    # Get all users the current user follows
    followed_user_ids = db.query(Follow.followed_id).filter(
        Follow.follower_id == current_user.id
    ).all()
    
    followed_user_ids = [uid[0] for uid in followed_user_ids]
    
    if not followed_user_ids:
        return FeedResponse(
            chapters=[],
            pagination=PaginationMeta(
                page=page,
                per_page=per_page,
                total=0,
                total_pages=0,
                has_more=False
            )
        )
    
    # Query chapters from followed users
    query = db.query(Chapter).filter(
        Chapter.author_id.in_(followed_user_ids)
    ).order_by(desc(Chapter.published_at))
    
    # Count total (bounded to 100)
    total = min(query.count(), 100)
    total_pages = (total + per_page - 1) // per_page
    
    # Apply pagination
    offset = (page - 1) * per_page
    
    # Don't allow fetching beyond 100 results
    if offset >= 100:
        return FeedResponse(
            chapters=[],
            pagination=PaginationMeta(
                page=page,
                per_page=per_page,
                total=total,
                total_pages=total_pages,
                has_more=False
            )
        )
    
    # Limit to remaining results within 100 bound
    limit = min(per_page, 100 - offset)
    
    chapters = query.offset(offset).limit(limit).all()
    
    # Build feed items
    feed_items = []
    for chapter in chapters:
        author = db.query(User).filter(User.id == chapter.author_id).first()
        
        feed_item = ChapterFeedItem(
            id=chapter.id,
            title=chapter.title,
            author_id=chapter.author_id,
            author_username=author.username,
            mood=chapter.mood,
            theme=chapter.theme,
            heart_count=chapter.heart_count,
            published_at=chapter.published_at
        )
        feed_items.append(feed_item)
    
    return FeedResponse(
        chapters=feed_items,
        pagination=PaginationMeta(
            page=page,
            per_page=per_page,
            total=total,
            total_pages=total_pages,
            has_more=page < total_pages
        )
    )


# ============================================================================
# BOOK CHAPTERS
# ============================================================================

@router.get("/books/{book_id}/chapters", response_model=List[ChapterResponse])
async def get_book_chapters(
    book_id: int,
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=50),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get chapters from a specific book with pagination.
    
    Checks access permissions based on book privacy settings.
    """
    book = db.query(Book).filter(Book.id == book_id).first()
    
    if not book:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Book not found"
        )
    
    # Check access permissions
    if book.is_private:
        # Private book: only owner and followers can access
        if book.user_id != current_user.id:
            # Check if user follows this book
            is_following = db.query(Follow).filter(
                Follow.follower_id == current_user.id,
                Follow.followed_id == book.user_id
            ).first()
            
            if not is_following:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="This book is private"
                )
    
    # Query chapters
    query = db.query(Chapter).filter(
        Chapter.author_id == book.user_id
    ).order_by(desc(Chapter.published_at))
    
    # Apply pagination
    offset = (page - 1) * per_page
    chapters = query.offset(offset).limit(per_page).all()
    
    return chapters
