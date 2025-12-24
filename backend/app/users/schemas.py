"""User settings schemas"""
from pydantic import BaseModel, Field
from typing import Optional


class PasswordUpdate(BaseModel):
    """Schema for password update"""
    current_password: str = Field(..., min_length=1)
    new_password: str = Field(..., min_length=8)


class BookProfileUpdate(BaseModel):
    """Schema for Book profile update"""
    display_name: Optional[str] = Field(None, max_length=100)
    bio: Optional[str] = Field(None, max_length=500)
    is_private: Optional[bool] = None


class BookProfileResponse(BaseModel):
    """Schema for Book profile response"""
    id: int
    user_id: int
    display_name: Optional[str]
    bio: Optional[str]
    cover_image_url: Optional[str]
    is_private: bool
    
    class Config:
        from_attributes = True
