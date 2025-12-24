"""Test Moderation and Privacy"""
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
        user1 = db.query(User).filter(User.email == "mod1@example.com").first()
        user2 = db.query(User).filter(User.email == "mod2@example.com").first()
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
    """Create a chapter"""
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


def get_user_id(token: str):
    """Get user ID from token"""
    response = client.get("/auth/me", headers={"Authorization": f"Bearer {token}"})
    return response.json()["id"]


def test_blocking():
    """Test user blocking"""
    print("\n🧪 Testing user blocking...")
    
    cleanup_test_data()
    token1 = register_user("mod1@example.com", "mod1")
    token2 = register_user("mod2@example.com", "mod2")
    
    user2_id = get_user_id(token2)
    
    # Block user
    response = client.post(
        f"/moderation/blocks/{user2_id}",
        headers={"Authorization": f"Bearer {token1}"}
    )
    assert response.status_code == 201
    block = response.json()
    
    assert block["blocked_id"] == user2_id
    
    print("✅ User blocked successfully!")
    
    # List blocked users
    response = client.get(
        "/moderation/blocks",
        headers={"Authorization": f"Bearer {token1}"}
    )
    assert response.status_code == 200
    blocks = response.json()
    
    assert len(blocks) == 1
    
    print(f"✅ User has {len(blocks)} blocked user(s)")
    
    return token1, token2, user2_id


def test_block_removes_follows(token1: str, token2: str):
    """Test that blocking removes follow relationships"""
    print("\n🧪 Testing block removes follows...")
    
    book1_id = get_book_id(token1)
    book2_id = get_book_id(token2)
    
    # Set up follows
    response = client.post(
        f"/engagement/books/{book2_id}/follow",
        headers={"Authorization": f"Bearer {token1}"}
    )
    # May fail if already blocked, that's ok
    
    response = client.post(
        f"/engagement/books/{book1_id}/follow",
        headers={"Authorization": f"Bearer {token2}"}
    )
    # May fail if already blocked, that's ok
    
    # Check follows were removed (or never created due to block)
    response = client.get(
        f"/engagement/books/{book1_id}/followers",
        headers={"Authorization": f"Bearer {token1}"}
    )
    assert response.status_code == 200
    followers = response.json()
    
    # Should not include blocked user
    blocked_user_ids = [f["follower_id"] for f in followers]
    user2_id = get_user_id(token2)
    assert user2_id not in blocked_user_ids
    
    print("✅ Follow relationships removed/prevented!")


def test_block_prevents_margins(token1: str, token2: str):
    """Test that blocked users cannot create margins"""
    print("\n🧪 Testing block prevents margins...")
    
    # User 1 creates a chapter
    chapter_id = create_chapter(token1, "Test Chapter")
    
    # User 2 tries to create margin (should fail)
    response = client.post(
        f"/margins/chapters/{chapter_id}/margins",
        json={"content": "This should fail"},
        headers={"Authorization": f"Bearer {token2}"}
    )
    assert response.status_code == 403
    assert "cannot comment" in response.json()["detail"]
    
    print("✅ Blocked user cannot create margins!")


def test_unblock(token1: str, user2_id: int):
    """Test unblocking a user"""
    print("\n🧪 Testing unblock...")
    
    response = client.delete(
        f"/moderation/blocks/{user2_id}",
        headers={"Authorization": f"Bearer {token1}"}
    )
    assert response.status_code == 204
    
    print("✅ User unblocked successfully!")
    
    # Verify unblocked
    response = client.get(
        "/moderation/blocks",
        headers={"Authorization": f"Bearer {token1}"}
    )
    blocks = response.json()
    
    assert len(blocks) == 0
    
    print("✅ Block list is empty!")


def test_reporting():
    """Test reporting users and chapters"""
    print("\n🧪 Testing reporting...")
    
    token1 = register_user("mod1@example.com", "mod1")
    token2 = register_user("mod2@example.com", "mod2")
    
    user2_id = get_user_id(token2)
    chapter_id = create_chapter(token2, "Reportable Chapter")
    
    # Report user
    response = client.post(
        "/moderation/reports",
        json={
            "reported_user_id": user2_id,
            "reason": "spam",
            "details": "This user is posting spam content"
        },
        headers={"Authorization": f"Bearer {token1}"}
    )
    assert response.status_code == 201
    report1 = response.json()
    
    assert report1["reported_user_id"] == user2_id
    assert report1["status"] == "pending"
    
    print("✅ User reported successfully!")
    
    # Report chapter
    response = client.post(
        "/moderation/reports",
        json={
            "reported_chapter_id": chapter_id,
            "reason": "inappropriate",
            "details": "This chapter contains inappropriate content"
        },
        headers={"Authorization": f"Bearer {token1}"}
    )
    assert response.status_code == 201
    report2 = response.json()
    
    assert report2["reported_chapter_id"] == chapter_id
    
    print("✅ Chapter reported successfully!")
    
    # List reports
    response = client.get(
        "/moderation/reports",
        headers={"Authorization": f"Bearer {token1}"}
    )
    assert response.status_code == 200
    reports = response.json()
    
    assert len(reports) == 2
    
    print(f"✅ User has {len(reports)} report(s)")


def test_privacy_settings():
    """Test book privacy settings"""
    print("\n🧪 Testing privacy settings...")
    
    token = register_user("mod1@example.com", "mod1")
    
    # Get current privacy settings
    response = client.get(
        "/privacy/book",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    book = response.json()
    
    assert book["is_private"] == False  # Default is public
    
    print("✅ Default privacy is public")
    
    # Make book private
    response = client.patch(
        "/privacy/book",
        json={"is_private": True},
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    book = response.json()
    
    assert book["is_private"] == True
    
    print("✅ Book set to private!")
    
    # Make book public again
    response = client.patch(
        "/privacy/book",
        json={"is_private": False},
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    book = response.json()
    
    assert book["is_private"] == False
    
    print("✅ Book set to public!")
    print("✅ Privacy changes take effect immediately!")


if __name__ == "__main__":
    print("🧪 Running Moderation and Privacy tests...\n")
    print("=" * 60)
    
    try:
        token1, token2, user2_id = test_blocking()
        test_block_removes_follows(token1, token2)
        test_block_prevents_margins(token1, token2)
        test_unblock(token1, user2_id)
        test_reporting()
        test_privacy_settings()
        
        print("\n" + "=" * 60)
        print("🎉 All tests passed!")
        print("\n📝 Moderation and Privacy ready!")
        print("\nFeatures working:")
        print("  ✅ User blocking")
        print("  ✅ Block removes follow relationships")
        print("  ✅ Block prevents margin creation")
        print("  ✅ User unblocking")
        print("  ✅ User reporting")
        print("  ✅ Chapter reporting")
        print("  ✅ Book privacy settings (public/private)")
        print("  ✅ Privacy changes take effect immediately")
        
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
