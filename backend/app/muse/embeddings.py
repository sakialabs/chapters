"""Muse embeddings service - OpenAI embeddings for taste and recommendations"""
from openai import OpenAI
from typing import List, Optional
import numpy as np
from sqlalchemy.orm import Session
from datetime import datetime, timezone, timedelta

from app.config import settings
from app.models import Chapter, ChapterEmbedding, UserTasteProfile, User

# Initialize OpenAI client
client = OpenAI(api_key=settings.openai_api_key)


def extract_chapter_text(chapter: Chapter) -> str:
    """
    Extract text from chapter for embedding generation.
    
    Combines title, mood, theme, and text blocks.
    """
    parts = []
    
    if chapter.title:
        parts.append(f"Title: {chapter.title}")
    
    if chapter.mood:
        parts.append(f"Mood: {chapter.mood}")
    
    if chapter.theme:
        parts.append(f"Theme: {chapter.theme}")
    
    # Extract text from blocks
    for block in chapter.blocks:
        if block.block_type.value == "text" and block.content.get("text"):
            parts.append(block.content["text"])
        elif block.block_type.value == "quote" and block.content.get("text"):
            parts.append(f"Quote: {block.content['text']}")
    
    return "\n\n".join(parts)


async def generate_chapter_embedding(chapter: Chapter, db: Session) -> List[float]:
    """
    Generate embedding for a chapter using OpenAI text-embedding-3-small.
    
    Args:
        chapter: Chapter to generate embedding for
        db: Database session
    
    Returns:
        Embedding vector (1536 dimensions)
    """
    try:
        # Extract text
        text = extract_chapter_text(chapter)
        
        # Generate embedding
        response = client.embeddings.create(
            model="text-embedding-3-small",
            input=text
        )
        
        embedding = response.data[0].embedding
        
        # Store in database
        chapter_embedding = ChapterEmbedding(
            chapter_id=chapter.id,
            embedding=embedding
        )
        db.add(chapter_embedding)
        db.commit()
        
        return embedding
    
    except Exception as e:
        # Log error but don't fail the request
        print(f"⚠️  Failed to generate embedding for chapter {chapter.id}: {e}")
        # Return None or empty list to indicate failure
        return []


async def initialize_taste_profile(user: User, preferences: str, db: Session) -> List[float]:
    """
    Initialize user taste profile from onboarding conversation.
    
    Args:
        user: User to create profile for
        preferences: User's taste preferences as text
        db: Database session
    
    Returns:
        Taste embedding vector
    """
    # Generate embedding from preferences
    response = client.embeddings.create(
        model="text-embedding-3-small",
        input=preferences
    )
    
    embedding = response.data[0].embedding
    
    # Create or update taste profile
    profile = db.query(UserTasteProfile).filter(
        UserTasteProfile.user_id == user.id
    ).first()
    
    if profile:
        profile.embedding = embedding
        profile.updated_at = datetime.now(timezone.utc)
    else:
        profile = UserTasteProfile(
            user_id=user.id,
            embedding=embedding
        )
        db.add(profile)
    
    db.commit()
    
    return embedding


async def update_taste_profile(
    user: User,
    chapter: Chapter,
    interaction_type: str,
    db: Session
) -> None:
    """
    Update user taste profile based on interaction with a chapter.
    
    Weights:
    - read: 0.3
    - heart: 0.6
    - bookmark: 1.0
    
    Args:
        user: User whose taste to update
        chapter: Chapter they interacted with
        interaction_type: 'read', 'heart', or 'bookmark'
        db: Database session
    """
    weights = {
        'read': 0.3,
        'heart': 0.6,
        'bookmark': 1.0
    }
    
    weight = weights.get(interaction_type, 0.3)
    
    # Get user's taste profile
    profile = db.query(UserTasteProfile).filter(
        UserTasteProfile.user_id == user.id
    ).first()
    
    if not profile:
        # No profile yet, skip update
        return
    
    # Get chapter embedding
    chapter_embedding = db.query(ChapterEmbedding).filter(
        ChapterEmbedding.chapter_id == chapter.id
    ).first()
    
    if not chapter_embedding:
        # Generate embedding if not exists
        await generate_chapter_embedding(chapter, db)
        chapter_embedding = db.query(ChapterEmbedding).filter(
            ChapterEmbedding.chapter_id == chapter.id
        ).first()
    
    if not chapter_embedding:
        return
    
    # Calculate weighted average
    current_taste = np.array(profile.embedding)
    chapter_vec = np.array(chapter_embedding.embedding)
    
    # Weighted update: new_taste = (1-weight) * current + weight * chapter
    new_taste = (1 - weight) * current_taste + weight * chapter_vec
    
    # Normalize
    new_taste = new_taste / np.linalg.norm(new_taste)
    
    # Update profile
    profile.embedding = new_taste.tolist()
    profile.updated_at = datetime.now(timezone.utc)
    db.commit()


def cosine_similarity(vec1: List[float], vec2: List[float]) -> float:
    """
    Calculate cosine similarity between two vectors.
    
    Returns:
        Similarity score between 0 and 1
    """
    v1 = np.array(vec1)
    v2 = np.array(vec2)
    
    dot_product = np.dot(v1, v2)
    norm1 = np.linalg.norm(v1)
    norm2 = np.linalg.norm(v2)
    
    if norm1 == 0 or norm2 == 0:
        return 0.0
    
    similarity = dot_product / (norm1 * norm2)
    
    # Normalize to 0-1 range (cosine similarity is -1 to 1)
    return (similarity + 1) / 2


async def get_quiet_picks(user: User, db: Session) -> List[Chapter]:
    """
    Get personalized chapter recommendations (Quiet Picks).
    
    Algorithm:
    1. Get chapters from followed books (last 7 days, unread)
    2. Calculate cosine similarity with user taste
    3. Return top 5 by similarity (max 2 per book for diversity)
    4. Taste-based, not popularity-based
    
    Args:
        user: User to get recommendations for
        db: Database session
    
    Returns:
        List of recommended chapters
    """
    from app.models import Follow, Book
    
    # Get user's taste profile
    profile = db.query(UserTasteProfile).filter(
        UserTasteProfile.user_id == user.id
    ).first()
    
    if not profile:
        return []
    
    # Get followed user IDs
    followed_user_ids = db.query(Follow.followed_id).filter(
        Follow.follower_id == user.id
    ).all()
    followed_user_ids = [uid[0] for uid in followed_user_ids]
    
    if not followed_user_ids:
        return []
    
    # Get chapters from last 7 days
    seven_days_ago = datetime.now(timezone.utc) - timedelta(days=7)
    
    chapters = db.query(Chapter).filter(
        Chapter.author_id.in_(followed_user_ids),
        Chapter.published_at >= seven_days_ago
    ).all()
    
    if not chapters:
        return []
    
    # Calculate similarity for each chapter
    chapter_scores = []
    
    for chapter in chapters:
        # Get chapter embedding
        embedding = db.query(ChapterEmbedding).filter(
            ChapterEmbedding.chapter_id == chapter.id
        ).first()
        
        if not embedding:
            continue
        
        # Calculate similarity
        similarity = cosine_similarity(profile.embedding, embedding.embedding)
        
        chapter_scores.append((chapter, similarity))
    
    # Sort by similarity (descending)
    chapter_scores.sort(key=lambda x: x[1], reverse=True)
    
    # Apply diversity constraint (max 2 per book)
    author_counts = {}
    picks = []
    
    for chapter, score in chapter_scores:
        author_id = chapter.author_id
        
        if author_counts.get(author_id, 0) < 2:
            picks.append(chapter)
            author_counts[author_id] = author_counts.get(author_id, 0) + 1
        
        if len(picks) >= 5:
            break
    
    return picks


def calculate_resonance(user1: User, user2: User, db: Session) -> float:
    """
    Calculate resonance between two users based on taste similarity.
    
    Args:
        user1: First user
        user2: Second user
        db: Database session
    
    Returns:
        Resonance score (0-1)
    """
    # Get taste profiles
    profile1 = db.query(UserTasteProfile).filter(
        UserTasteProfile.user_id == user1.id
    ).first()
    
    profile2 = db.query(UserTasteProfile).filter(
        UserTasteProfile.user_id == user2.id
    ).first()
    
    if not profile1 or not profile2:
        return 0.0
    
    # Calculate cosine similarity
    return cosine_similarity(profile1.embedding, profile2.embedding)
