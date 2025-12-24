"""Muse AI service - OpenAI integration"""
from openai import OpenAI
from typing import List, Optional
import redis

from app.config import settings

# Initialize OpenAI client
client = OpenAI(api_key=settings.openai_api_key)

# Redis client for rate limiting
redis_client = redis.from_url(settings.redis_url)


def check_rate_limit(user_id: int, operation: str, limit: int, window: int) -> bool:
    """
    Check if user has exceeded rate limit for an operation.
    
    Args:
        user_id: User ID
        operation: Operation name (e.g., 'muse_prompts', 'muse_rewrite')
        limit: Maximum number of operations allowed
        window: Time window in seconds
    
    Returns:
        True if within limit, False if exceeded
    """
    key = f"muse_rate_limit:{operation}:{user_id}"
    count = redis_client.get(key)
    
    if count is None:
        redis_client.setex(key, window, 1)
        return True
    
    count = int(count)
    if count >= limit:
        return False
    
    redis_client.incr(key)
    return True


async def generate_prompts(context: Optional[str] = None, notes: Optional[List[str]] = None) -> List[str]:
    """
    Generate writing prompts using GPT-4.
    
    Args:
        context: Optional context about the user's writing
        notes: Optional list of user's notes
    
    Returns:
        List of writing prompts
    """
    # Build prompt
    system_prompt = """You are Muse, a thoughtful writing assistant for the Chapters platform. 
Your role is to inspire writers with creative, meaningful prompts that encourage depth and introspection.
Generate 5 unique writing prompts that are:
- Thought-provoking and open-ended
- Focused on personal reflection or storytelling
- Suitable for short-form writing (chapters)
- Varied in theme and mood"""
    
    user_prompt = "Generate 5 writing prompts."
    
    if context:
        user_prompt += f"\n\nContext about the writer: {context}"
    
    if notes:
        user_prompt += f"\n\nWriter's recent notes: {', '.join(notes[:3])}"
    
    # Call OpenAI
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        temperature=0.8,
        max_tokens=500
    )
    
    # Parse response
    content = response.choices[0].message.content
    prompts = [line.strip() for line in content.split('\n') if line.strip() and not line.strip().startswith('#')]
    
    # Clean up numbered prompts
    prompts = [p.split('. ', 1)[-1] if '. ' in p else p for p in prompts]
    
    return prompts[:5]


async def suggest_titles(content: str, mood: Optional[str] = None, theme: Optional[str] = None) -> List[str]:
    """
    Suggest titles for a draft using GPT-4.
    
    Args:
        content: Draft content
        mood: Optional mood
        theme: Optional theme
    
    Returns:
        List of title suggestions
    """
    system_prompt = """You are Muse, a thoughtful writing assistant. 
Generate 5 compelling title suggestions that capture the essence of the content.
Titles should be:
- Concise (2-6 words)
- Evocative and memorable
- Appropriate for the mood and theme
- Varied in style"""
    
    user_prompt = f"Suggest 5 titles for this content:\n\n{content[:500]}"
    
    if mood:
        user_prompt += f"\n\nMood: {mood}"
    if theme:
        user_prompt += f"\nTheme: {theme}"
    
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        temperature=0.7,
        max_tokens=200
    )
    
    content = response.choices[0].message.content
    titles = [line.strip() for line in content.split('\n') if line.strip() and not line.strip().startswith('#')]
    
    # Clean up numbered titles
    titles = [t.split('. ', 1)[-1] if '. ' in t else t for t in titles]
    # Remove quotes if present
    titles = [t.strip('"').strip("'") for t in titles]
    
    return titles[:5]


async def rewrite_text(text: str, style: Optional[str] = None, preserve_voice: bool = True) -> str:
    """
    Rewrite text using GPT-4 while preserving the author's voice.
    
    Args:
        text: Original text
        style: Optional style guidance (e.g., "more concise", "more poetic")
        preserve_voice: Whether to preserve the author's voice
    
    Returns:
        Rewritten text
    """
    system_prompt = """You are Muse, a thoughtful writing assistant. 
Your role is to help writers refine their work while preserving their unique voice.
When rewriting:
- Maintain the core message and meaning
- Preserve the author's tone and style
- Improve clarity and flow
- Keep the same approximate length"""
    
    if not preserve_voice:
        system_prompt = """You are Muse, a thoughtful writing assistant. 
Rewrite the text to improve clarity, flow, and impact."""
    
    user_prompt = f"Rewrite this text:\n\n{text}"
    
    if style:
        user_prompt += f"\n\nStyle guidance: {style}"
    
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        temperature=0.7,
        max_tokens=len(text.split()) * 2  # Allow up to 2x the original length
    )
    
    return response.choices[0].message.content.strip()
