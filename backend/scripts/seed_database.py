"""
Professional database seeding script for Chapters.

Creates realistic demo data including:
- Users with diverse profiles
- Published chapters with rich content
- Drafts and notes
- Engagement (follows, hearts, bookmarks)
- Comments (margins)

Run with: poetry run python scripts/seed_database.py
Or in Docker: docker exec chapters-backend python scripts/seed_database.py
"""

import asyncio
import random
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.database import SessionLocal, engine
from app.models.user import User
from app.models.chapter import Chapter
from app.models.study import Draft, Note
from app.models.engagement import Follow, Heart, Bookmark
from app.models.margin import Margin
from app.auth.security import get_password_hash


# Sample data for realistic content
USERS = [
    {
        "username": "maya_writes",
        "email": "maya@example.com",
        "display_name": "Maya Chen",
        "bio": "Writer, poet, and coffee enthusiast. Exploring the quiet moments between words.",
    },
    {
        "username": "alex_creates",
        "email": "alex@example.com",
        "display_name": "Alex Rivera",
        "bio": "Visual storyteller. Finding beauty in the mundane.",
    },
    {
        "username": "sam_reflects",
        "email": "sam@example.com",
        "display_name": "Sam Taylor",
        "bio": "Philosopher at heart. Writing about life, love, and everything in between.",
    },
    {
        "username": "jordan_dreams",
        "email": "jordan@example.com",
        "display_name": "Jordan Lee",
        "bio": "Dreamer and doer. Sharing fragments of thought and feeling.",
    },
    {
        "username": "riley_wanders",
        "email": "riley@example.com",
        "display_name": "Riley Morgan",
        "bio": "Wanderer with a notebook. Collecting stories from the road.",
    },
]

CHAPTER_TITLES = [
    "Morning Light Through Kitchen Windows",
    "The Weight of Unspoken Words",
    "Coffee Shops and Quiet Conversations",
    "Letters I'll Never Send",
    "The Art of Letting Go",
    "Midnight Thoughts on Paper",
    "Finding Home in Strange Places",
    "The Space Between Breaths",
    "Autumn Leaves and Old Memories",
    "Dancing in Empty Rooms",
    "The Sound of Rain on Glass",
    "Conversations with Myself",
    "The Color of Longing",
    "Small Moments, Big Feelings",
    "The Poetry of Ordinary Days",
]

CHAPTER_CONTENTS = [
    "There's something sacred about morning light. The way it filters through kitchen windows, catching dust motes in its beam, turning the ordinary into something worth noticing.\n\nI've been thinking about how we rush through these moments, always chasing the next thing, the next achievement, the next milestone. But what if the point is right here? In the warmth of a coffee cup, the quiet before the world wakes up, the gentle start of a new day.\n\nMaybe that's what I'm learning: to be present. To notice. To appreciate the small, beautiful things that make up a life.",
    
    "Some words sit heavy on your tongue, too afraid to be spoken. They gather there, building weight, until you're not sure if you're protecting someone else or just yourself.\n\nI've carried these words for months now. They're simple, really. Just three syllables that could change everything or nothing at all. But the fear of knowing which one keeps them locked away.\n\nTonight, I'm writing them down instead. Maybe that's enough. Maybe some truths are meant to live on paper, not in the air between us.",
    
    "Coffee shops are my favorite kind of church. The ritual of ordering, finding a corner table, opening a notebook. The ambient noise that somehow makes it easier to think.\n\nI come here to write, but mostly I come here to watch. The couple by the window, having the same argument they've had a hundred times. The student with headphones, drowning in textbooks. The old man who comes every Tuesday at 3pm, always orders black coffee, always sits alone.\n\nWe're all here together, separately. Finding solace in shared solitude.",
    
    "Dear You,\n\nI'm writing this knowing you'll never read it. Maybe that's what makes it easier to be honest.\n\nI want to tell you about the way your laugh sounds like home. How I notice when you're tired, even when you try to hide it. The small things you do that you think no one sees—I see them all.\n\nBut I also want to tell you that I'm learning to be okay with the distance between us. That some feelings are meant to be felt, not acted upon. That loving someone doesn't always mean being with them.\n\nI hope you're happy. I really do.\n\nAlways,\nMe",
    
    "Letting go is not a single moment. It's a thousand small releases, spread across days and weeks and months.\n\nIt's deleting their number, then memorizing it anyway. It's boxing up their things, then keeping one shirt that still smells like them. It's saying you're over it, then crying in the shower where no one can hear.\n\nBut slowly, imperceptibly, the grip loosens. The memories lose their sharp edges. You wake up one day and realize you didn't think about them first thing in the morning.\n\nThat's when you know: you're not there yet, but you're getting closer.",
]

DRAFT_TITLES = [
    "Untitled Thoughts",
    "Work in Progress",
    "Half-Formed Ideas",
    "Notes to Self",
    "Maybe Someday",
]

NOTE_CONTENTS = [
    "Remember: vulnerability is not weakness. It's the most honest thing we can offer.",
    "Idea: Write about the difference between loneliness and solitude.",
    "Quote to explore: 'We read to know we're not alone.' - C.S. Lewis",
    "Observation: The way people hold their coffee cups says a lot about them.",
    "Reminder: Not every thought needs to be a chapter. Some are just for me.",
]

MARGIN_COMMENTS = [
    "This resonates so deeply. Thank you for sharing.",
    "Beautiful. I felt this in my bones.",
    "Your words always find me when I need them most.",
    "This is exactly what I needed to read today.",
    "The way you capture these moments is incredible.",
    "I've been feeling this too. Thank you for putting it into words.",
    "This made me cry (in the best way).",
    "Saving this to read again and again.",
]


def create_users(db: Session) -> list[User]:
    """Create demo users."""
    print("Creating users...")
    users = []
    
    for user_data in USERS:
        user = User(
            username=user_data["username"],
            email=user_data["email"],
            password_hash=get_password_hash("password123"),  # Demo password
            open_pages=3,
        )
        db.add(user)
        users.append(user)
    
    db.commit()
    print(f"✓ Created {len(users)} users")
    return users


def create_chapters(db: Session, users: list[User]) -> list[Chapter]:
    """Create published chapters."""
    print("Creating chapters...")
    chapters = []
    
    # Import ChapterBlock and BlockType here
    from app.models.chapter import ChapterBlock, BlockType
    
    # Each user publishes 2-4 chapters
    for user in users:
        num_chapters = random.randint(2, 4)
        
        for i in range(num_chapters):
            # Random publish date in the last 30 days
            days_ago = random.randint(1, 30)
            published_at = datetime.utcnow() - timedelta(days=days_ago)
            edit_window_expires = published_at + timedelta(hours=24)
            
            chapter = Chapter(
                author_id=user.id,
                title=random.choice(CHAPTER_TITLES),
                published_at=published_at,
                edit_window_expires=edit_window_expires,
            )
            db.add(chapter)
            db.flush()  # Get the chapter ID
            
            # Add a text block with content
            block = ChapterBlock(
                chapter_id=chapter.id,
                position=0,
                block_type=BlockType.TEXT,
                content={"text": random.choice(CHAPTER_CONTENTS)}
            )
            db.add(block)
            
            chapters.append(chapter)
    
    db.commit()
    print(f"✓ Created {len(chapters)} chapters")
    return chapters


def create_drafts(db: Session, users: list[User]):
    """Create drafts for users."""
    print("Creating drafts...")
    draft_count = 0
    
    for user in users:
        # Each user has 1-3 drafts
        num_drafts = random.randint(1, 3)
        
        for i in range(num_drafts):
            draft = Draft(
                author_id=user.id,
                title=random.choice(DRAFT_TITLES) if random.random() > 0.3 else None,
            )
            db.add(draft)
            draft_count += 1
    
    db.commit()
    print(f"✓ Created {draft_count} drafts")


def create_notes(db: Session, users: list[User]):
    """Create notes for users."""
    print("Creating notes...")
    note_count = 0
    
    for user in users:
        # Each user has 2-5 notes
        num_notes = random.randint(2, 5)
        
        for i in range(num_notes):
            note = Note(
                author_id=user.id,
                title=f"Note {i+1}",
                content=random.choice(NOTE_CONTENTS),
                tags=random.sample(["ideas", "quotes", "observations", "reminders", "inspiration"], k=random.randint(1, 3)),
            )
            db.add(note)
            note_count += 1
    
    db.commit()
    print(f"✓ Created {note_count} notes")


def create_follows(db: Session, users: list[User]):
    """Create follow relationships."""
    print("Creating follows...")
    follow_count = 0
    
    for user in users:
        # Each user follows 2-4 other users
        other_users = [u for u in users if u.id != user.id]
        num_follows = min(random.randint(2, 4), len(other_users))
        followed_users = random.sample(other_users, num_follows)
        
        for followed in followed_users:
            follow = Follow(
                follower_id=user.id,
                followed_id=followed.id,
            )
            db.add(follow)
            follow_count += 1
    
    db.commit()
    print(f"✓ Created {follow_count} follows")


def create_hearts(db: Session, users: list[User], chapters: list[Chapter]):
    """Create hearts on chapters."""
    print("Creating hearts...")
    heart_count = 0
    
    for chapter in chapters:
        # Each chapter gets 0-3 hearts from random users (not the author)
        other_users = [u for u in users if u.id != chapter.author_id]
        num_hearts = random.randint(0, min(3, len(other_users)))
        hearting_users = random.sample(other_users, num_hearts)
        
        for user in hearting_users:
            heart = Heart(
                user_id=user.id,
                chapter_id=chapter.id,
            )
            db.add(heart)
            heart_count += 1
            # Update heart count on chapter
            chapter.heart_count += 1
    
    db.commit()
    print(f"✓ Created {heart_count} hearts")


def create_bookmarks(db: Session, users: list[User], chapters: list[Chapter]):
    """Create bookmarks."""
    print("Creating bookmarks...")
    bookmark_count = 0
    
    for user in users:
        # Each user bookmarks 1-3 chapters
        other_chapters = [c for c in chapters if c.author_id != user.id]
        num_bookmarks = min(random.randint(1, 3), len(other_chapters))
        bookmarked_chapters = random.sample(other_chapters, num_bookmarks)
        
        for chapter in bookmarked_chapters:
            bookmark = Bookmark(
                user_id=user.id,
                chapter_id=chapter.id,
            )
            db.add(bookmark)
            bookmark_count += 1
    
    db.commit()
    print(f"✓ Created {bookmark_count} bookmarks")


def create_margins(db: Session, users: list[User], chapters: list[Chapter]):
    """Create margin comments."""
    print("Creating margins...")
    margin_count = 0
    
    for chapter in chapters:
        # Each chapter gets 0-2 comments
        other_users = [u for u in users if u.id != chapter.author_id]
        num_comments = random.randint(0, min(2, len(other_users)))
        commenting_users = random.sample(other_users, num_comments)
        
        for user in commenting_users:
            margin = Margin(
                author_id=user.id,
                chapter_id=chapter.id,
                content=random.choice(MARGIN_COMMENTS),
            )
            db.add(margin)
            margin_count += 1
    
    db.commit()
    print(f"✓ Created {margin_count} margins")


def seed_database():
    """Main seeding function."""
    print("\n" + "="*50)
    print("🌱 Seeding Chapters Database")
    print("="*50 + "\n")
    
    db = SessionLocal()
    
    try:
        # Create all data
        users = create_users(db)
        chapters = create_chapters(db, users)
        create_drafts(db, users)
        create_notes(db, users)
        create_follows(db, users)
        create_hearts(db, users, chapters)
        create_bookmarks(db, users, chapters)
        create_margins(db, users, chapters)
        
        print("\n" + "="*50)
        print("✅ Database seeded successfully!")
        print("="*50)
        print("\nDemo accounts (all use password: password123):")
        for user_data in USERS:
            print(f"  • {user_data['username']} ({user_data['display_name']})")
        print("\n")
        
    except Exception as e:
        print(f"\n❌ Error seeding database: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
