"""Study routes - Drafts and Notes"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timezone, timedelta

from app.database import get_db
from app.models import User, Draft, DraftBlock, Note, Chapter, ChapterBlock
from app.auth.security import get_current_user
from app.study.schemas import (
    DraftCreate, DraftUpdate, DraftResponse,
    NoteCreate, NoteUpdate, NoteResponse
)
from app.services.open_pages import consume_open_page, can_publish

router = APIRouter(prefix="/study", tags=["Study"])


# ============================================================================
# DRAFTS
# ============================================================================

@router.post("/drafts", response_model=DraftResponse, status_code=status.HTTP_201_CREATED)
async def create_draft(
    draft_data: DraftCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new draft (private by default)"""
    draft = Draft(
        author_id=current_user.id,
        title=draft_data.title,
        mood=draft_data.mood,
        theme=draft_data.theme,
        time_period=draft_data.time_period
    )
    db.add(draft)
    db.flush()
    
    # Create blocks
    for block_data in draft_data.blocks:
        block = DraftBlock(
            draft_id=draft.id,
            position=block_data.position,
            block_type=block_data.block_type,
            content=block_data.content
        )
        db.add(block)
    
    db.commit()
    db.refresh(draft)
    return draft


@router.get("/drafts", response_model=List[DraftResponse])
async def list_drafts(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List user's drafts (private)"""
    drafts = db.query(Draft).filter(
        Draft.author_id == current_user.id
    ).order_by(Draft.updated_at.desc()).all()
    
    return drafts


@router.get("/drafts/{draft_id}", response_model=DraftResponse)
async def get_draft(
    draft_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a draft by ID (author only)"""
    draft = db.query(Draft).filter(Draft.id == draft_id).first()
    
    if not draft:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Draft not found"
        )
    
    if draft.author_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only view your own drafts"
        )
    
    return draft


@router.patch("/drafts/{draft_id}", response_model=DraftResponse)
async def update_draft(
    draft_id: int,
    draft_data: DraftUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a draft"""
    draft = db.query(Draft).filter(Draft.id == draft_id).first()
    
    if not draft:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Draft not found"
        )
    
    if draft.author_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only edit your own drafts"
        )
    
    # Update fields
    if draft_data.title is not None:
        draft.title = draft_data.title
    if draft_data.mood is not None:
        draft.mood = draft_data.mood
    if draft_data.theme is not None:
        draft.theme = draft_data.theme
    if draft_data.time_period is not None:
        draft.time_period = draft_data.time_period
    
    # Update blocks if provided
    if draft_data.blocks is not None:
        db.query(DraftBlock).filter(DraftBlock.draft_id == draft.id).delete()
        
        for block_data in draft_data.blocks:
            block = DraftBlock(
                draft_id=draft.id,
                position=block_data.position,
                block_type=block_data.block_type,
                content=block_data.content
            )
            db.add(block)
    
    db.commit()
    db.refresh(draft)
    return draft


@router.delete("/drafts/{draft_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_draft(
    draft_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a draft"""
    draft = db.query(Draft).filter(Draft.id == draft_id).first()
    
    if not draft:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Draft not found"
        )
    
    if draft.author_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only delete your own drafts"
        )
    
    db.delete(draft)
    db.commit()
    return None


@router.post("/drafts/{draft_id}/promote", status_code=status.HTTP_201_CREATED)
async def promote_draft(
    draft_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Promote a draft to a published chapter.
    
    - Checks and consumes 1 Open Page
    - Converts draft blocks to chapter blocks
    - Creates published chapter
    - Keeps the original draft
    """
    draft = db.query(Draft).filter(Draft.id == draft_id).first()
    
    if not draft:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Draft not found"
        )
    
    if draft.author_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only promote your own drafts"
        )
    
    if not can_publish(current_user):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"No Open Pages available. You have {current_user.open_pages} Open Pages."
        )
    
    # Create chapter from draft
    chapter = Chapter(
        author_id=current_user.id,
        title=draft.title,
        mood=draft.mood,
        theme=draft.theme,
        time_period=draft.time_period,
        edit_window_expires=datetime.now(timezone.utc) + timedelta(minutes=30)
    )
    db.add(chapter)
    db.flush()
    
    # Copy blocks from draft to chapter
    for draft_block in draft.blocks:
        chapter_block = ChapterBlock(
            chapter_id=chapter.id,
            position=draft_block.position,
            block_type=draft_block.block_type,
            content=draft_block.content
        )
        db.add(chapter_block)
    
    # Consume Open Page
    consume_open_page(current_user, db)
    
    db.commit()
    db.refresh(chapter)
    
    return chapter


# ============================================================================
# NOTES
# ============================================================================

@router.post("/notes", response_model=NoteResponse, status_code=status.HTTP_201_CREATED)
async def create_note(
    note_data: NoteCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new note (private)"""
    note = Note(
        author_id=current_user.id,
        title=note_data.title,
        content=note_data.content,
        tags=note_data.tags,
        voice_memo_url=note_data.voice_memo_url
    )
    db.add(note)
    db.commit()
    db.refresh(note)
    return note


@router.get("/notes", response_model=List[NoteResponse])
async def list_notes(
    tag: str = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List user's notes (private, optionally filter by tag)"""
    query = db.query(Note).filter(Note.author_id == current_user.id)
    
    if tag:
        query = query.filter(Note.tags.any(tag))
    
    notes = query.order_by(Note.updated_at.desc()).all()
    return notes


@router.get("/notes/{note_id}", response_model=NoteResponse)
async def get_note(
    note_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a note by ID (author only)"""
    note = db.query(Note).filter(Note.id == note_id).first()
    
    if not note:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Note not found"
        )
    
    if note.author_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only view your own notes"
        )
    
    return note


@router.patch("/notes/{note_id}", response_model=NoteResponse)
async def update_note(
    note_id: int,
    note_data: NoteUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a note"""
    note = db.query(Note).filter(Note.id == note_id).first()
    
    if not note:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Note not found"
        )
    
    if note.author_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only edit your own notes"
        )
    
    # Update fields
    if note_data.title is not None:
        note.title = note_data.title
    if note_data.content is not None:
        note.content = note_data.content
    if note_data.tags is not None:
        note.tags = note_data.tags
    if note_data.voice_memo_url is not None:
        note.voice_memo_url = note_data.voice_memo_url
    
    db.commit()
    db.refresh(note)
    return note


@router.delete("/notes/{note_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_note(
    note_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a note"""
    note = db.query(Note).filter(Note.id == note_id).first()
    
    if not note:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Note not found"
        )
    
    if note.author_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only delete your own notes"
        )
    
    db.delete(note)
    db.commit()
    return None
