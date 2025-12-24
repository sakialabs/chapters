"""Engagement routes - Hearts, Follows, Bookmarks"""
from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from typing import List

from app.database import get_db
from app.models import User, Chapter, Heart, Follow, Bookmark, Book
from app.auth.security import get_current_user
from app.engagement.schemas import HeartResponse, FollowResponse, BookmarkResponse

router = APIRouter(prefix="/engagement", tags=["Engagement"])


# ============================================================================
# HEARTS
# ============================================================================

@router.post("/chapters/{chapter_id}/heart", response_model=HeartResponse, status_code=status.HTTP_201_CREATED)
async def heart_chapter(
    chapter_id: int,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Heart a chapter (toggle on)"""
    chapter = db.query(Chapter).filter(Chapter.id == chapter_id).first()
    
    if not chapter:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chapter not found"
        )
    
    # Check if already hearted
    existing = db.query(Heart).filter(
        Heart.user_id == current_user.id,
        Heart.chapter_id == chapter_id
    ).first()
    
    if existing:
        return existing
    
    # Create heart
    heart = Heart(
        user_id=current_user.id,
        chapter_id=chapter_id
    )
    db.add(heart)
    
    # Increment heart count
    chapter.heart_count += 1
    
    db.commit()
    db.refresh(heart)
    
    # Update taste profile in background
    from app.muse.embeddings import update_taste_profile
    background_tasks.add_task(update_taste_profile, current_user, chapter, 'heart', db)
    
    return heart


@router.delete("/chapters/{chapter_id}/heart", status_code=status.HTTP_204_NO_CONTENT)
async def unheart_chapter(
    chapter_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Remove heart from a chapter (toggle off)"""
    chapter = db.query(Chapter).filter(Chapter.id == chapter_id).first()
    
    if not chapter:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chapter not found"
        )
    
    heart = db.query(Heart).filter(
        Heart.user_id == current_user.id,
        Heart.chapter_id == chapter_id
    ).first()
    
    if not heart:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Heart not found"
        )
    
    db.delete(heart)
    
    # Decrement heart count
    if chapter.heart_count > 0:
        chapter.heart_count -= 1
    
    db.commit()
    return None


# ============================================================================
# FOLLOWS
# ============================================================================

@router.post("/books/{book_id}/follow", response_model=FollowResponse, status_code=status.HTTP_201_CREATED)
async def follow_book(
    book_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Follow a book"""
    book = db.query(Book).filter(Book.id == book_id).first()
    
    if not book:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Book not found"
        )
    
    # Prevent self-follow
    if book.user_id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot follow your own book"
        )
    
    # Check if already following
    existing = db.query(Follow).filter(
        Follow.follower_id == current_user.id,
        Follow.followed_id == book.user_id
    ).first()
    
    if existing:
        return existing
    
    # Create follow
    follow = Follow(
        follower_id=current_user.id,
        followed_id=book.user_id
    )
    db.add(follow)
    db.commit()
    db.refresh(follow)
    return follow


@router.delete("/books/{book_id}/follow", status_code=status.HTTP_204_NO_CONTENT)
async def unfollow_book(
    book_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Unfollow a book"""
    book = db.query(Book).filter(Book.id == book_id).first()
    
    if not book:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Book not found"
        )
    
    follow = db.query(Follow).filter(
        Follow.follower_id == current_user.id,
        Follow.followed_id == book.user_id
    ).first()
    
    if not follow:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Follow not found"
        )
    
    db.delete(follow)
    db.commit()
    return None


@router.get("/books/{book_id}/followers", response_model=List[FollowResponse])
async def get_followers(
    book_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get followers of a book"""
    book = db.query(Book).filter(Book.id == book_id).first()
    
    if not book:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Book not found"
        )
    
    followers = db.query(Follow).filter(
        Follow.followed_id == book.user_id
    ).all()
    
    return followers


@router.get("/books/{book_id}/following", response_model=List[FollowResponse])
async def get_following(
    book_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get books that this book's author is following"""
    book = db.query(Book).filter(Book.id == book_id).first()
    
    if not book:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Book not found"
        )
    
    following = db.query(Follow).filter(
        Follow.follower_id == book.user_id
    ).all()
    
    return following


# ============================================================================
# BOOKMARKS
# ============================================================================

@router.post("/chapters/{chapter_id}/bookmark", response_model=BookmarkResponse, status_code=status.HTTP_201_CREATED)
async def bookmark_chapter(
    chapter_id: int,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Bookmark a chapter (can bookmark from unfollowed books)"""
    chapter = db.query(Chapter).filter(Chapter.id == chapter_id).first()
    
    if not chapter:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chapter not found"
        )
    
    # Check if already bookmarked
    existing = db.query(Bookmark).filter(
        Bookmark.user_id == current_user.id,
        Bookmark.chapter_id == chapter_id
    ).first()
    
    if existing:
        return existing
    
    # Create bookmark
    bookmark = Bookmark(
        user_id=current_user.id,
        chapter_id=chapter_id
    )
    db.add(bookmark)
    db.commit()
    db.refresh(bookmark)
    
    # Update taste profile in background
    from app.muse.embeddings import update_taste_profile
    background_tasks.add_task(update_taste_profile, current_user, chapter, 'bookmark', db)
    
    return bookmark


@router.delete("/bookmarks/{bookmark_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_bookmark(
    bookmark_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a bookmark"""
    bookmark = db.query(Bookmark).filter(Bookmark.id == bookmark_id).first()
    
    if not bookmark:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Bookmark not found"
        )
    
    if bookmark.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only delete your own bookmarks"
        )
    
    db.delete(bookmark)
    db.commit()
    return None


@router.get("/bookmarks", response_model=List[BookmarkResponse])
async def list_bookmarks(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List user's bookmarks in chronological order"""
    bookmarks = db.query(Bookmark).filter(
        Bookmark.user_id == current_user.id
    ).order_by(Bookmark.created_at.desc()).all()
    
    return bookmarks
