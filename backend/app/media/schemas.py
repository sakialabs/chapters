"""Media schemas"""
from pydantic import BaseModel
from enum import Enum


class MediaType(str, Enum):
    """Media type enum"""
    IMAGE = "image"
    AUDIO = "audio"
    VIDEO = "video"


class UploadRequest(BaseModel):
    """Media upload request"""
    filename: str
    content_type: str
    media_type: MediaType


class UploadResponse(BaseModel):
    """Media upload response with signed URL"""
    upload_url: str
    media_key: str
    expires_in: int


class ConfirmUploadRequest(BaseModel):
    """Confirm upload request"""
    media_key: str


class ConfirmUploadResponse(BaseModel):
    """Confirm upload response"""
    media_url: str
    media_key: str
