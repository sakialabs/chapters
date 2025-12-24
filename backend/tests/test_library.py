"""Test Library and Feed System"""
import sys
import os

backend_dir = os.path.dirname(os.path.dirname(__file__))
os.chdir(backend_dir)
sys.path.insert(0, backend_dir)

from fastapi.testclient import TestClient
from app.main import app
from app.database import SessionLocal
from app.models import User, Book

client = TestClient(app)


def cleanup_test_data():
    """Clean up test data"""
    db = SessionLocal()
    try:
        user1 = db.query(User).filter(User.email == "library1@example.com").first()
        user2 = db.query(User).filter(User.email == "library2@example.com").first()
        if user1:
            db.delete(user1)
        if user2:
            db.delete(user2)
        db.commit()
    finally:
        db.close()


def register_user(email: str, username: str):
    """Register a user and return token"""
    response = client.post("/auth/register", json={
        "email": email,
        "username": username,
        "password": "testpassword123"
    })
    assert response.status_code == 201
    return response.json()["access_token"]


def create_chapter(token: str, title: str):
    """Create a chapter and return chapter ID"""
    chapter_data = {
        "title": title,
        "blocks": [
            {"position": 0, "block_type": "text", "content": {"text": f"Content for {title}"}}
        ]
    }
    response = client.post(
        "/chapters",
        json=chapter_data,
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 201
    return response.json()["id"]


def get_book_id(token: str):
    """Get user's book ID"""
    response = client.get("/auth/me", headers={"Authorization": f"Bearer {token}"})
    user = response.json()
    user_id = user["id"]
    
    db = SessionLocal()
    try:
        book = db.query(Book).filter(Book.user_id == user_id).first()
        return book.id
    finally:
        db.close()


def test_bookshelf_spines():
    """Test bookshelf spines endpoint"""
    print("\n🧪 Testing bookshelf spines...")
    
    cleanup_test_data()
    token1 = register_user("library1@example.com", "library1")
    token2 = register_user("library2@example.com", "library2")
    
    # User 1 creates chapters
    create_chapter(token1, "Chapter 1")
    create_chapter(token1, "Chapter 2")
    
    # User 2 follows User 1
    book1_id = get_book_id(token1)
    response = client.post(
        f"/engagement/books/{book1_id}/follow",
        headers={"Authorization": f"Bearer {token2}"}
    )
    assert response.status_code == 201
    
    # User 2 gets bookshelf spines
    response = client.get(
        "/library/spines",
        headers={"Authorization": f"Bearer {token2}"}
    )
    assert response.status_code == 200
    spines = response.json()
    
    assert len(spines) == 1
    assert spines[0]["username"] == "library1"
    assert spines[0]["unread_count"] == 2
    assert spines[0]["last_chapter_at"] is not None
    
    print("✅ Bookshelf spines working!")
    print(f"   Found {len(spines)} spine(s)")
    print(f"   Unread count: {spines[0]['unread_count']}")
    
    return token1, token2


def test_new_chapters_feed(token1: str, token2: str):
    """Test new chapters feed"""
    print("\n🧪 Testing new chapters feed...")
    
    # User 2 gets feed
    response = client.get(
        "/library/new",
        headers={"Authorization": f"Bearer {token2}"}
    )
    assert response.status_code == 200
    feed = response.json()
    
    assert "chapters" in feed
    assert "pagination" in feed
    assert len(feed["chapters"]) > 0
    assert feed["pagination"]["page"] == 1
    assert feed["pagination"]["total"] <= 100  # Bounded to 100
    
    print("✅ New chapters feed working!")
    print(f"   Found {len(feed['chapters'])} chapter(s)")
    print(f"   Total: {feed['pagination']['total']}")
    print(f"   Has more: {feed['pagination']['has_more']}")


def test_feed_pagination(token1: str, token2: str):
    """Test feed pagination"""
    print("\n🧪 Testing feed pagination...")
    
    # Get page 1
    response = client.get(
        "/library/new?page=1&per_page=1",
        headers={"Authorization": f"Bearer {token2}"}
    )
    assert response.status_code == 200
    page1 = response.json()
    
    assert len(page1["chapters"]) == 1
    assert page1["pagination"]["page"] == 1
    assert page1["pagination"]["per_page"] == 1
    
    # Get page 2
    response = client.get(
        "/library/new?page=2&per_page=1",
        headers={"Authorization": f"Bearer {token2}"}
    )
    assert response.status_code == 200
    page2 = response.json()
    
    assert len(page2["chapters"]) == 1
    assert page2["pagination"]["page"] == 2
    
    # Verify different chapters
    assert page1["chapters"][0]["id"] != page2["chapters"][0]["id"]
    
    print("✅ Feed pagination working!")


def test_book_chapters(token1: str, token2: str):
    """Test book chapters endpoint"""
    print("\n🧪 Testing book chapters endpoint...")
    
    book1_id = get_book_id(token1)
    
    # User 2 gets User 1's chapters
    response = client.get(
        f"/library/books/{book1_id}/chapters",
        headers={"Authorization": f"Bearer {token2}"}
    )
    assert response.status_code == 200
    chapters = response.json()
    
    assert len(chapters) == 2
    
    print("✅ Book chapters endpoint working!")
    print(f"   Found {len(chapters)} chapter(s)")


if __name__ == "__main__":
    print("🧪 Running Library and Feed tests...\n")
    print("=" * 60)
    
    try:
        token1, token2 = test_bookshelf_spines()
        test_new_chapters_feed(token1, token2)
        test_feed_pagination(token1, token2)
        test_book_chapters(token1, token2)
        
        print("\n" + "=" * 60)
        print("🎉 All tests passed!")
        print("\n📝 Library System ready!")
        print("\nFeatures working:")
        print("  ✅ Bookshelf spines with unread counts")
        print("  ✅ New chapters feed")
        print("  ✅ Feed pagination (bounded to 100)")
        print("  ✅ Book chapters listing")
        
        print("\n🧹 Cleaning up test data...")
        cleanup_test_data()
        print("✅ Cleanup complete!")
        
    except AssertionError as e:
        print(f"\n❌ Test failed: {e}")
        import traceback
        traceback.print_exc()
        cleanup_test_data()
    
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")
        import traceback
        traceback.print_exc()
        cleanup_test_data()
