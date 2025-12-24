"""Privacy routes - Book privacy settings"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User, Book
from app.auth.security import get_current_user
from app.privacy.schemas import BookPrivacyUpdate, BookResponse

router = APIRouter(prefix="/privacy", tags=["Privacy"])


@router.get("/book", response_model=BookResponse)
async def get_book_privacy(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get current user's book privacy settings"""
    book = db.query(Book).filter(Book.user_id == current_user.id).first()
    
    if not book:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Book not found"
        )
    
    return book


@router.patch("/book", response_model=BookResponse)
async def update_book_privacy(
    privacy_data: BookPrivacyUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update book privacy settings.
    
    - Private: Only owner and followers can access
    - Public: Any authenticated user can access
    
    Changes take effect immediately.
    """
    book = db.query(Book).filter(Book.user_id == current_user.id).first()
    
    if not book:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Book not found"
        )
    
    book.is_private = privacy_data.is_private
    db.commit()
    db.refresh(book)
    
    return book
