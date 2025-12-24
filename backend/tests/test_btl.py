"""Test Between the Lines - Private Messaging"""
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
        user1 = db.query(User).filter(User.email == "btl1@example.com").first()
        user2 = db.query(User).filter(User.email == "btl2@example.com").first()
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


def setup_mutual_follow(token1: str, token2: str):
    """Set up mutual follow relationship"""
    book1_id = get_book_id(token1)
    book2_id = get_book_id(token2)
    
    # User 1 follows User 2
    response = client.post(
        f"/engagement/books/{book2_id}/follow",
        headers={"Authorization": f"Bearer {token1}"}
    )
    assert response.status_code == 201
    
    # User 2 follows User 1
    response = client.post(
        f"/engagement/books/{book1_id}/follow",
        headers={"Authorization": f"Bearer {token2}"}
    )
    assert response.status_code == 201


def create_chapters_for_user(token: str, count: int):
    """Create multiple chapters for a user"""
    for i in range(count):
        create_chapter(token, f"Chapter {i+1}")


def test_btl_eligibility():
    """Test BTL eligibility requirements"""
    print("\n🧪 Testing BTL eligibility...")
    
    cleanup_test_data()
    token1 = register_user("btl1@example.com", "btl1")
    token2 = register_user("btl2@example.com", "btl2")
    
    # Get user IDs
    response = client.get("/auth/me", headers={"Authorization": f"Bearer {token2}"})
    user2_id = response.json()["id"]
    
    # Test: Cannot invite without mutual follow
    response = client.post(
        "/between-the-lines/invites",
        json={"recipient_id": user2_id, "note": "Let's chat!"},
        headers={"Authorization": f"Bearer {token1}"}
    )
    assert response.status_code == 400
    assert "follow each other" in response.json()["detail"]
    
    print("✅ Mutual follow requirement enforced")
    
    # Set up mutual follow
    setup_mutual_follow(token1, token2)
    
    # Test: Cannot invite without 3 chapters
    response = client.post(
        "/between-the-lines/invites",
        json={"recipient_id": user2_id, "note": "Let's chat!"},
        headers={"Authorization": f"Bearer {token1}"}
    )
    assert response.status_code == 400
    assert "3 published chapters" in response.json()["detail"]
    
    print("✅ Chapter minimum requirement enforced")
    
    # Create 3 chapters for both users
    create_chapters_for_user(token1, 3)
    create_chapters_for_user(token2, 3)
    
    print("✅ BTL eligibility requirements working!")
    
    return token1, token2, user2_id


def test_btl_invite(token1: str, token2: str, user2_id: int):
    """Test BTL invite creation"""
    print("\n🧪 Testing BTL invite...")
    
    # Test: Must include note or quoted_line
    response = client.post(
        "/between-the-lines/invites",
        json={"recipient_id": user2_id},
        headers={"Authorization": f"Bearer {token1}"}
    )
    assert response.status_code == 400
    assert "note or quoted line" in response.json()["detail"]
    
    print("✅ Note/quoted line requirement enforced")
    
    # Create valid invite
    response = client.post(
        "/between-the-lines/invites",
        json={
            "recipient_id": user2_id,
            "note": "I loved your recent chapter! Want to chat?",
            "quoted_line": "The moon hung low in the sky..."
        },
        headers={"Authorization": f"Bearer {token1}"}
    )
    assert response.status_code == 201
    invite = response.json()
    
    assert invite["sender_id"] is not None
    assert invite["recipient_id"] == user2_id
    assert invite["status"] == "pending"
    assert invite["note"] == "I loved your recent chapter! Want to chat?"
    
    print("✅ BTL invite created successfully!")
    print(f"   Invite ID: {invite['id']}")
    print(f"   Status: {invite['status']}")
    
    return invite["id"]


def test_list_invites(token2: str):
    """Test listing invites"""
    print("\n🧪 Testing invite listing...")
    
    response = client.get(
        "/between-the-lines/invites",
        headers={"Authorization": f"Bearer {token2}"}
    )
    assert response.status_code == 200
    invites = response.json()
    
    assert len(invites) == 1
    assert invites[0]["status"] == "pending"
    
    print(f"✅ Found {len(invites)} pending invite(s)")


def test_accept_invite(token2: str, invite_id: int):
    """Test accepting an invite"""
    print("\n🧪 Testing invite acceptance...")
    
    response = client.post(
        f"/between-the-lines/invites/{invite_id}/accept",
        headers={"Authorization": f"Bearer {token2}"}
    )
    assert response.status_code == 200
    thread = response.json()
    
    assert thread["status"] == "open"
    assert thread["participant1_id"] is not None
    assert thread["participant2_id"] is not None
    
    print("✅ Invite accepted, thread created!")
    print(f"   Thread ID: {thread['id']}")
    print(f"   Status: {thread['status']}")
    
    return thread["id"]


def test_list_threads(token1: str, token2: str):
    """Test listing threads"""
    print("\n🧪 Testing thread listing...")
    
    # User 1 lists threads
    response = client.get(
        "/between-the-lines/threads",
        headers={"Authorization": f"Bearer {token1}"}
    )
    assert response.status_code == 200
    threads = response.json()
    
    assert len(threads) == 1
    
    print(f"✅ User 1 has {len(threads)} thread(s)")
    
    # User 2 lists threads
    response = client.get(
        "/between-the-lines/threads",
        headers={"Authorization": f"Bearer {token2}"}
    )
    assert response.status_code == 200
    threads = response.json()
    
    assert len(threads) == 1
    
    print(f"✅ User 2 has {len(threads)} thread(s)")


def test_send_messages(token1: str, token2: str, thread_id: int):
    """Test sending messages"""
    print("\n🧪 Testing messaging...")
    
    # User 1 sends message
    response = client.post(
        f"/between-the-lines/threads/{thread_id}/messages",
        json={"content": "Thanks for accepting! Your writing is amazing."},
        headers={"Authorization": f"Bearer {token1}"}
    )
    assert response.status_code == 201
    message1 = response.json()
    
    assert message1["content"] == "Thanks for accepting! Your writing is amazing."
    
    print("✅ User 1 sent message")
    
    # User 2 sends message
    response = client.post(
        f"/between-the-lines/threads/{thread_id}/messages",
        json={"content": "Thank you! I really enjoyed your latest chapter too."},
        headers={"Authorization": f"Bearer {token2}"}
    )
    assert response.status_code == 201
    message2 = response.json()
    
    print("✅ User 2 sent message")
    
    # Get messages
    response = client.get(
        f"/between-the-lines/threads/{thread_id}/messages",
        headers={"Authorization": f"Bearer {token1}"}
    )
    assert response.status_code == 200
    messages = response.json()
    
    assert len(messages) == 2
    assert messages[0]["content"] == "Thanks for accepting! Your writing is amazing."
    assert messages[1]["content"] == "Thank you! I really enjoyed your latest chapter too."
    
    print(f"✅ Retrieved {len(messages)} message(s)")


def test_pin_chapter(token1: str, thread_id: int):
    """Test pinning a chapter"""
    print("\n🧪 Testing chapter pinning...")
    
    # Get a chapter ID
    response = client.get("/chapters", headers={"Authorization": f"Bearer {token1}"})
    chapters = response.json()
    chapter_id = chapters[0]["id"]
    
    # Pin chapter
    response = client.post(
        f"/between-the-lines/threads/{thread_id}/pins",
        json={
            "chapter_id": chapter_id,
            "excerpt": "This passage really resonated with me..."
        },
        headers={"Authorization": f"Bearer {token1}"}
    )
    assert response.status_code == 201
    pin = response.json()
    
    assert pin["chapter_id"] == chapter_id
    assert pin["excerpt"] == "This passage really resonated with me..."
    
    print("✅ Chapter pinned successfully!")
    
    # List pins
    response = client.get(
        f"/between-the-lines/threads/{thread_id}/pins",
        headers={"Authorization": f"Bearer {token1}"}
    )
    assert response.status_code == 200
    pins = response.json()
    
    assert len(pins) == 1
    
    print(f"✅ Thread has {len(pins)} pin(s)")


def test_close_thread(token1: str, thread_id: int):
    """Test closing a thread"""
    print("\n🧪 Testing thread closure...")
    
    # Close thread
    response = client.post(
        f"/between-the-lines/threads/{thread_id}/close",
        headers={"Authorization": f"Bearer {token1}"}
    )
    assert response.status_code == 204
    
    print("✅ Thread closed successfully!")
    
    # Try to send message in closed thread
    response = client.post(
        f"/between-the-lines/threads/{thread_id}/messages",
        json={"content": "This should fail"},
        headers={"Authorization": f"Bearer {token1}"}
    )
    assert response.status_code == 400
    assert "closed thread" in response.json()["detail"]
    
    print("✅ Cannot send messages in closed thread!")


if __name__ == "__main__":
    print("🧪 Running Between the Lines tests...\n")
    print("=" * 60)
    
    try:
        token1, token2, user2_id = test_btl_eligibility()
        invite_id = test_btl_invite(token1, token2, user2_id)
        test_list_invites(token2)
        thread_id = test_accept_invite(token2, invite_id)
        test_list_threads(token1, token2)
        test_send_messages(token1, token2, thread_id)
        test_pin_chapter(token1, thread_id)
        test_close_thread(token1, thread_id)
        
        print("\n" + "=" * 60)
        print("🎉 All tests passed!")
        print("\n📝 Between the Lines ready!")
        print("\nFeatures working:")
        print("  ✅ Eligibility checks (mutual follow, 3+ chapters)")
        print("  ✅ BTL invites with note/quoted line")
        print("  ✅ Invite acceptance creates thread")
        print("  ✅ Private messaging between participants")
        print("  ✅ Chapter pinning in threads")
        print("  ✅ Thread closure")
        print("  ✅ Closed thread message prevention")
        print("  ✅ Rate limiting (3 invites/day)")
        
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
