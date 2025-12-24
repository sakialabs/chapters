"""Media routes - File upload and storage"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User
from app.auth.security import get_current_user
from app.media.schemas import (
    UploadRequest, UploadResponse,
    ConfirmUploadRequest, ConfirmUploadResponse
)
from app.media.service import (
    validate_content_type, generate_media_key,
    generate_upload_url, generate_public_url
)

router = APIRouter(prefix="/media", tags=["Media"])


@router.post("/upload", response_model=UploadResponse)
async def request_upload(
    upload_data: UploadRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Request a presigned URL for media upload.
    
    Returns a presigned URL that the client can use to upload directly to S3.
    URL expires in 1 hour.
    
    Supported formats:
    - Images: JPEG, PNG, GIF, WebP
    - Audio: MP3, AAC, WAV
    - Video: MP4, WebM
    """
    # Validate content type
    if not validate_content_type(upload_data.content_type, upload_data.media_type.value):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid content type for {upload_data.media_type.value}. "
                   f"Allowed types: JPEG, PNG, GIF, WebP (images); MP3, AAC, WAV (audio); MP4, WebM (video)"
        )
    
    # Generate media key
    media_key = generate_media_key(
        current_user.id,
        upload_data.filename,
        upload_data.media_type.value
    )
    
    # Generate presigned upload URL
    upload_url = generate_upload_url(media_key, upload_data.content_type)
    
    return UploadResponse(
        upload_url=upload_url,
        media_key=media_key,
        expires_in=3600
    )


@router.post("/confirm", response_model=ConfirmUploadResponse)
async def confirm_upload(
    confirm_data: ConfirmUploadRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Confirm media upload and get public URL.
    
    After uploading to the presigned URL, call this endpoint to get the
    public URL for the media.
    """
    # Generate public URL
    media_url = generate_public_url(confirm_data.media_key)
    
    return ConfirmUploadResponse(
        media_url=media_url,
        media_key=confirm_data.media_key
    )
