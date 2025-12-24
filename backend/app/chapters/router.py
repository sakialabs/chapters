"""Chapter routes"""
from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from datetime import datetime, timezone, timedelta
from typing import List

from app.database import get_db
from app.models import User, Chapter, ChapterBlock
from app.auth.security import get_current_user
from app.chapters.schemas import ChapterCreate, ChapterUpdate, ChapterResponse
from app.services.open_pages import consume_open_page, can_publish

router = APIRouter(prefix="/chapters", tags=["Chapters"])


@router.post("", response_model=ChapterResponse, status_code=status.HTTP_201_CREATED)
async def create_chapter(
    chapter_data: ChapterCreate,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create and publish a new chapter.
    
    - Validates block count (max 12 total, max 2 media)
    - Validates media durations (audio ≤5min, video ≤3min)
    - Checks and consumes 1 Open Page
    - Sets edit window to 30 minutes
    - Queues embedding generation in background
    """
    # Check if user can publish
    if not can_publish(current_user):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"No Open Pages available. You have {current_user.open_pages} Open Pages."
        )
    
    # Create chapter
    chapter = Chapter(
        author_id=current_user.id,
        title=chapter_data.title,
        mood=chapter_data.mood,
        theme=chapter_data.theme,
        time_period=chapter_data.time_period,
        edit_window_expires=datetime.now(timezone.utc) + timedelta(minutes=30)
    )
    db.add(chapter)
    db.flush()  # Get chapter ID
    
    # Create blocks
    for block_data in chapter_data.blocks:
        block = ChapterBlock(
            chapter_id=chapter.id,
            position=block_data.position,
            block_type=block_data.block_type,
            content=block_data.content
        )
        db.add(block)
    
    # Consume Open Page
    consume_open_page(current_user, db)
    
    db.commit()
    db.refresh(chapter)
    
    # Queue embedding generation in background
    from app.muse.embeddings import generate_chapter_embedding
    background_tasks.add_task(generate_chapter_embedding, chapter, db)
    
    return chapter


@router.get("/{chapter_id}", response_model=ChapterResponse)
async def get_chapter(
    chapter_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get a chapter by ID.
    
    - Returns chapter with blocks ordered by position
    - Includes author information (username, book_id)
    - Includes is_hearted and is_bookmarked status for current user
    - Does NOT include margins (fetched separately)
    - Checks access permissions based on Book privacy (TODO)
    """
    from app.models.engagement import Heart, Bookmark
    
    chapter = db.query(Chapter).filter(Chapter.id == chapter_id).first()
    
    if not chapter:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chapter not found"
        )
    
    # TODO: Check access permissions based on Book privacy
    
    # Check if current user has hearted this chapter
    is_hearted = db.query(Heart).filter(
        Heart.user_id == current_user.id,
        Heart.chapter_id == chapter.id
    ).first() is not None
    
    # Check if current user has bookmarked this chapter
    is_bookmarked = db.query(Bookmark).filter(
        Bookmark.user_id == current_user.id,
        Bookmark.chapter_id == chapter.id
    ).first() is not None
    
    # Build response with author info
    response_data = {
        "id": chapter.id,
        "author_id": chapter.author_id,
        "title": chapter.title,
        "cover_url": chapter.cover_url,
        "mood": chapter.mood,
        "theme": chapter.theme,
        "time_period": chapter.time_period,
        "heart_count": chapter.heart_count,
        "is_hearted": is_hearted,
        "is_bookmarked": is_bookmarked,
        "published_at": chapter.published_at,
        "edit_window_expires": chapter.edit_window_expires,
        "blocks": chapter.blocks,
        "author": {
            "username": chapter.author.username,
            "book_id": chapter.author.id
        }
    }
    
    return response_data


@router.get("", response_model=List[ChapterResponse])
async def list_chapters(
    skip: int = 0,
    limit: int = 20,
    author_id: int = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    List chapters with pagination.
    
    - Optional filter by author_id
    - Returns chapters ordered by published_at (newest first)
    """
    query = db.query(Chapter)
    
    if author_id:
        query = query.filter(Chapter.author_id == author_id)
    
    chapters = query.order_by(Chapter.published_at.desc()).offset(skip).limit(limit).all()
    
    return chapters


@router.patch("/{chapter_id}", response_model=ChapterResponse)
async def update_chapter(
    chapter_id: int,
    chapter_data: ChapterUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update a chapter within the edit window (30 minutes).
    
    - Only author can update
    - Must be within 30 minutes of publication
    - Can update title, mood, theme, and blocks
    """
    chapter = db.query(Chapter).filter(Chapter.id == chapter_id).first()
    
    if not chapter:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chapter not found"
        )
    
    # Check if user is the author
    if chapter.author_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only edit your own chapters"
        )
    
    # Check edit window
    now = datetime.now(timezone.utc)
    if now > chapter.edit_window_expires:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Edit window has expired (30 minutes after publication)"
        )
    
    # Update fields
    if chapter_data.title is not None:
        chapter.title = chapter_data.title
    if chapter_data.mood is not None:
        chapter.mood = chapter_data.mood
    if chapter_data.theme is not None:
        chapter.theme = chapter_data.theme
    if chapter_data.time_period is not None:
        chapter.time_period = chapter_data.time_period
    
    # Update blocks if provided
    if chapter_data.blocks is not None:
        # Delete existing blocks
        db.query(ChapterBlock).filter(ChapterBlock.chapter_id == chapter.id).delete()
        
        # Create new blocks
        for block_data in chapter_data.blocks:
            block = ChapterBlock(
                chapter_id=chapter.id,
                position=block_data.position,
                block_type=block_data.block_type,
                content=block_data.content
            )
            db.add(block)
    
    db.commit()
    db.refresh(chapter)
    
    return chapter


@router.delete("/{chapter_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_chapter(
    chapter_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete a chapter.
    
    - Only author can delete
    - Cascade deletes blocks, hearts, bookmarks, margins
    """
    chapter = db.query(Chapter).filter(Chapter.id == chapter_id).first()
    
    if not chapter:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chapter not found"
        )
    
    # Check if user is the author
    if chapter.author_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only delete your own chapters"
        )
    
    db.delete(chapter)
    db.commit()
    
    return None
