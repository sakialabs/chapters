"""Quick test to verify models work correctly"""
import sys
import os
from datetime import datetime, timezone, timedelta

# Change to backend directory
backend_dir = os.path.dirname(__file__)
os.chdir(backend_dir)
sys.path.insert(0, backend_dir)

from app.database import SessionLocal
from app.models import User, Book, Chapter, ChapterBlock
from app.models.chapter import BlockType

def test_user_book_relationship():
    """Test User-Book one-to-one relationship"""
    db = SessionLocal()
    try:
        # Create a user
        user = User(
            email="test@example.com",
            username="testuser",
            password_hash="hashed_password",
            open_pages=3
        )
        db.add(user)
        db.flush()  # Get the user ID
        
        # Create associated book
        book = Book(
            user_id=user.id,
            display_name="Test User",
            bio="A test user's book"
        )
        db.add(book)
        db.commit()
        
        # Verify relationship
        assert user.book is not None
        assert user.book.display_name == "Test User"
        assert book.user.username == "testuser"
        
        print("✅ User-Book relationship works!")
        
        # Clean up
        db.delete(user)  # Cascade will delete book
        db.commit()
        
    finally:
        db.close()


def test_chapter_with_blocks():
    """Test Chapter with ChapterBlocks"""
    db = SessionLocal()
    try:
        # Create user and book
        user = User(
            email="author@example.com",
            username="author",
            password_hash="hashed_password",
            open_pages=2
        )
        db.add(user)
        db.flush()
        
        book = Book(user_id=user.id)
        db.add(book)
        db.flush()
        
        # Create chapter
        chapter = Chapter(
            author_id=user.id,
            title="My First Chapter",
            mood="contemplative",
            theme="growth",
            edit_window_expires=datetime.now(timezone.utc) + timedelta(minutes=30)
        )
        db.add(chapter)
        db.flush()
        
        # Add blocks
        text_block = ChapterBlock(
            chapter_id=chapter.id,
            position=0,
            block_type=BlockType.TEXT,
            content={"text": "This is the opening paragraph."}
        )
        image_block = ChapterBlock(
            chapter_id=chapter.id,
            position=1,
            block_type=BlockType.IMAGE,
            content={"url": "https://example.com/image.jpg", "alt": "A beautiful sunset"}
        )
        db.add_all([text_block, image_block])
        db.commit()
        
        # Verify
        assert len(chapter.blocks) == 2
        assert chapter.blocks[0].block_type == BlockType.TEXT
        assert chapter.blocks[1].block_type == BlockType.IMAGE
        assert chapter.author.username == "author"
        
        print("✅ Chapter with blocks works!")
        
        # Clean up
        db.delete(user)
        db.commit()
        
    finally:
        db.close()


def test_open_pages_system():
    """Test Open Pages field"""
    db = SessionLocal()
    try:
        user = User(
            email="pages@example.com",
            username="pagesuser",
            password_hash="hashed_password",
            open_pages=3,
            last_open_page_grant=datetime.now(timezone.utc)
        )
        db.add(user)
        db.commit()
        
        # Verify
        assert user.open_pages == 3
        assert user.last_open_page_grant is not None
        
        # Simulate consuming an Open Page
        user.open_pages -= 1
        db.commit()
        
        assert user.open_pages == 2
        
        print("✅ Open Pages system works!")
        
        # Clean up
        db.delete(user)
        db.commit()
        
    finally:
        db.close()


if __name__ == "__main__":
    print("🧪 Running model tests...\n")
    
    try:
        test_user_book_relationship()
        test_chapter_with_blocks()
        test_open_pages_system()
        
        print("\n🎉 All tests passed!")
        
    except Exception as e:
        print(f"\n❌ Test failed: {e}")
        import traceback
        traceback.print_exc()
