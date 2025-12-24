"""Muse AI routes - Writing assistant"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models import User
from app.auth.security import get_current_user
from app.muse.schemas import (
    PromptRequest, PromptResponse,
    TitleSuggestionRequest, TitleSuggestionResponse,
    RewriteRequest, RewriteResponse
)
from app.muse.service import (
    generate_prompts, suggest_titles, rewrite_text,
    check_rate_limit
)
from app.muse.embeddings import (
    initialize_taste_profile, get_quiet_picks, calculate_resonance
)
from app.chapters.schemas import ChapterResponse
from app.config import settings

router = APIRouter(prefix="/muse", tags=["Muse AI"])


# ============================================================================
# WRITING PROMPTS
# ============================================================================

@router.post("/prompts", response_model=PromptResponse)
async def get_writing_prompts(
    request: PromptRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Generate writing prompts using AI.
    
    Rate limit: 10 prompts per hour
    """
    # Check rate limit
    if not check_rate_limit(
        current_user.id,
        "muse_prompts",
        settings.muse_prompt_rate_limit,
        3600  # 1 hour
    ):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Rate limit exceeded. Maximum {settings.muse_prompt_rate_limit} prompts per hour."
        )
    
    # Generate prompts
    prompts = await generate_prompts(
        context=request.context,
        notes=request.notes
    )
    
    return PromptResponse(prompts=prompts)


# ============================================================================
# TITLE SUGGESTIONS
# ============================================================================

@router.post("/title-suggestions", response_model=TitleSuggestionResponse)
async def get_title_suggestions(
    request: TitleSuggestionRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get AI-generated title suggestions for content.
    
    No specific rate limit (uses general Muse operations limit)
    """
    # Generate titles
    titles = await suggest_titles(
        content=request.content,
        mood=request.mood,
        theme=request.theme
    )
    
    return TitleSuggestionResponse(titles=titles)


# ============================================================================
# TEXT REWRITING
# ============================================================================

@router.post("/rewrite", response_model=RewriteResponse)
async def rewrite_text_endpoint(
    request: RewriteRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Rewrite text using AI while preserving voice.
    
    Rate limit: 15 rewrites per hour
    """
    # Check rate limit
    if not check_rate_limit(
        current_user.id,
        "muse_rewrite",
        settings.muse_rewrite_rate_limit,
        3600  # 1 hour
    ):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Rate limit exceeded. Maximum {settings.muse_rewrite_rate_limit} rewrites per hour."
        )
    
    # Rewrite text
    rewritten = await rewrite_text(
        text=request.text,
        style=request.style,
        preserve_voice=request.preserve_voice
    )
    
    return RewriteResponse(
        original=request.text,
        rewritten=rewritten
    )



# ============================================================================
# TASTE PROFILE & ONBOARDING
# ============================================================================

@router.post("/onboarding")
async def onboard_taste_profile(
    preferences: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Initialize user taste profile from onboarding conversation.
    
    Args:
        preferences: User's taste preferences as text
    
    Returns:
        Success message
    """
    await initialize_taste_profile(current_user, preferences, db)
    
    return {"message": "Taste profile initialized successfully"}


# ============================================================================
# QUIET PICKS (PERSONALIZED RECOMMENDATIONS)
# ============================================================================

@router.get("/quiet-picks", response_model=List[ChapterResponse])
async def get_quiet_picks_endpoint(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get personalized chapter recommendations (Quiet Picks).
    
    Returns top 5 chapters based on taste similarity:
    - From followed books only
    - Last 7 days
    - Max 2 per book for diversity
    - Taste-based, not popularity-based
    """
    picks = await get_quiet_picks(current_user, db)
    
    return picks


# ============================================================================
# RESONANCE
# ============================================================================

@router.get("/resonance/{user_id}")
async def get_resonance(
    user_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Calculate resonance (taste similarity) with another user.
    
    Returns:
        Resonance score (0-1)
    """
    other_user = db.query(User).filter(User.id == user_id).first()
    
    if not other_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    resonance = calculate_resonance(current_user, other_user, db)
    
    return {
        "user_id": user_id,
        "username": other_user.username,
        "resonance": resonance
    }
