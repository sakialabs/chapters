"""Media service - S3/R2 integration"""
import boto3
from botocore.client import Config
from datetime import datetime, timedelta
import uuid
from typing import Tuple, Optional

from app.config import settings


# S3 client (lazy-loaded)
_s3_client: Optional[object] = None


def get_s3_client():
    """Get or create S3 client (lazy initialization)"""
    global _s3_client
    if _s3_client is None:
        # Only initialize if endpoint URL is provided
        endpoint = settings.s3_endpoint_url if settings.s3_endpoint_url else None
        _s3_client = boto3.client(
            's3',
            endpoint_url=endpoint,
            aws_access_key_id=settings.s3_access_key,
            aws_secret_access_key=settings.s3_secret_key,
            region_name=settings.s3_region,
            config=Config(signature_version='s3v4')
        )
    return _s3_client


# Allowed file formats
ALLOWED_FORMATS = {
    'image': ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    'audio': ['audio/mpeg', 'audio/mp3', 'audio/aac', 'audio/wav'],
    'video': ['video/mp4', 'video/webm']
}


def validate_content_type(content_type: str, media_type: str) -> bool:
    """Validate content type against media type"""
    return content_type in ALLOWED_FORMATS.get(media_type, [])


def generate_media_key(user_id: int, filename: str, media_type: str) -> str:
    """Generate unique media key for S3"""
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    unique_id = str(uuid.uuid4())[:8]
    extension = filename.split('.')[-1] if '.' in filename else 'bin'
    
    return f"{media_type}/{user_id}/{timestamp}_{unique_id}.{extension}"


def generate_upload_url(media_key: str, content_type: str, expires_in: int = 3600) -> str:
    """
    Generate presigned URL for upload.
    
    Args:
        media_key: S3 object key
        content_type: MIME type
        expires_in: URL expiration in seconds (default 1 hour)
    
    Returns:
        Presigned upload URL
    """
    s3_client = get_s3_client()
    url = s3_client.generate_presigned_url(
        'put_object',
        Params={
            'Bucket': settings.s3_bucket,
            'Key': media_key,
            'ContentType': content_type
        },
        ExpiresIn=expires_in
    )
    
    return url


def generate_public_url(media_key: str) -> str:
    """
    Generate public URL for published media.
    
    For published chapters, media should be publicly accessible.
    """
    if settings.s3_endpoint_url:
        # Cloudflare R2 or custom endpoint
        return f"{settings.s3_endpoint_url}/{settings.s3_bucket}/{media_key}"
    else:
        # AWS S3
        return f"https://{settings.s3_bucket}.s3.{settings.s3_region}.amazonaws.com/{media_key}"


def generate_signed_url(media_key: str, expires_in: int = 3600) -> str:
    """
    Generate signed URL for private media (drafts).
    
    Args:
        media_key: S3 object key
        expires_in: URL expiration in seconds (default 1 hour)
    
    Returns:
        Presigned download URL
    """
    s3_client = get_s3_client()
    url = s3_client.generate_presigned_url(
        'get_object',
        Params={
            'Bucket': settings.s3_bucket,
            'Key': media_key
        },
        ExpiresIn=expires_in
    )
    
    return url


def delete_media(media_key: str) -> bool:
    """
    Delete media from S3.
    
    Returns:
        True if successful, False otherwise
    """
    try:
        s3_client = get_s3_client()
        s3_client.delete_object(
            Bucket=settings.s3_bucket,
            Key=media_key
        )
        return True
    except Exception as e:
        print(f"Error deleting media {media_key}: {e}")
        return False
