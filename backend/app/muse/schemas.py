"""Muse AI schemas"""
from pydantic import BaseModel
from typing import List, Optional


class PromptRequest(BaseModel):
    """Request for writing prompts"""
    context: Optional[str] = None
    notes: Optional[List[str]] = None


class PromptResponse(BaseModel):
    """Response with writing prompts"""
    prompts: List[str]


class TitleSuggestionRequest(BaseModel):
    """Request for title suggestions"""
    content: str
    mood: Optional[str] = None
    theme: Optional[str] = None


class TitleSuggestionResponse(BaseModel):
    """Response with title suggestions"""
    titles: List[str]


class RewriteRequest(BaseModel):
    """Request for text rewriting"""
    text: str
    style: Optional[str] = None
    preserve_voice: bool = True


class RewriteResponse(BaseModel):
    """Response with rewritten text"""
    original: str
    rewritten: str
