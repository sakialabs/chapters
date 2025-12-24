"""User settings and profile routes"""
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import Optional

from app.database import get_db
from app.models import User, Book
from app.auth.security import get_current_user, get_password_hash, verify_password
from app.users.schemas import PasswordUpdate, BookProfileUpdate, BookProfileResponse

router = APIRouter(prefix="/users", tags=["User Settings"])


@router.put("/password", status_code=status.HTTP_200_OK)
async def update_password(
    password_data: PasswordUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update user password.
    
    - Requires current password verification
    - Updates to new password
    """
    # Verify current password
    if not verify_password(password_data.current_password, current_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect"
        )
    
    # Update password
    current_user.password_hash = get_password_hash(password_data.new_password)
    db.commit()
    
    return {"message": "Password updated successfully"}


@router.get("/book-profile", response_model=BookProfileResponse)
async def get_book_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get current user's Book profile.
    """
    book = db.query(Book).filter(Book.user_id == current_user.id).first()
    
    if not book:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Book profile not found"
        )
    
    return book


@router.put("/book-profile", response_model=BookProfileResponse)
async def update_book_profile(
    profile_data: BookProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update Book profile settings.
    
    - Updates display name, bio, and privacy settings
    """
    book = db.query(Book).filter(Book.user_id == current_user.id).first()
    
    if not book:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Book profile not found"
        )
    
    # Update fields if provided
    if profile_data.display_name is not None:
        book.display_name = profile_data.display_name
    
    if profile_data.bio is not None:
        book.bio = profile_data.bio
    
    if profile_data.is_private is not None:
        book.is_private = profile_data.is_private
    
    db.commit()
    db.refresh(book)
    
    return book


@router.post("/book-profile/avatar")
async def update_avatar(
    avatar_type: str,  # "preset" or "custom"
    avatar_path: Optional[str] = None,  # For preset avatars
    file: Optional[UploadFile] = File(None),  # For custom uploads
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update Book profile avatar.
    
    - For preset avatars: provide avatar_type="preset" and avatar_path="/avatars/avatar1.png"
    - For custom uploads: provide avatar_type="custom" and file
    """
    book = db.query(Book).filter(Book.user_id == current_user.id).first()
    
    if not book:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Book profile not found"
        )
    
    if avatar_type == "preset" and avatar_path:
        # Use preset avatar
        book.cover_image_url = avatar_path
    elif avatar_type == "custom" and file:
        # TODO: Implement file upload to S3
        # For now, just return a placeholder
        raise HTTPException(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            detail="Custom avatar upload not yet implemented. Use preset avatars for now."
        )
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid avatar update request"
        )
    
    db.commit()
    db.refresh(book)
    
    return {"message": "Avatar updated successfully", "avatar_url": book.cover_image_url}


@router.post("/book-profile/cover")
async def update_cover_image(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update Book profile cover image.
    
    - Uploads cover image to S3
    """
    book = db.query(Book).filter(Book.user_id == current_user.id).first()
    
    if not book:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Book profile not found"
        )
    
    # TODO: Implement file upload to S3
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Cover image upload not yet implemented"
    )
