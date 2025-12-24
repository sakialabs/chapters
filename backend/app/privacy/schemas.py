"""Privacy schemas"""
from pydantic import BaseModel


class BookPrivacyUpdate(BaseModel):
    """Update book privacy settings"""
    is_private: bool


class BookResponse(BaseModel):
    """Book response with privacy settings"""
    id: int
    user_id: int
    display_name: str | None
    bio: str | None
    is_private: bool
    
    class Config:
        from_attributes = True
