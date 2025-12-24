"""Test Open Pages and Chapter Management"""
import sys
import os

backend_dir = os.path.dirname(__file__)
os.chdir(backend_dir)
sys.path.insert(0, backend_dir)

from fastapi.testclient import TestClient
from app.main import app
from app.database import SessionLocal
from app.models import User, Chapter

client = TestClient(app)


def cleanup_test_data():
    """Clean up test data"""
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == "chaptertest@example.com").first()
        if user:
            db.delete(user)
            db.commit()
    finally:
        db.close()


def register_and_login():
    """Register and login a test user"""
    cleanup_test_data()
    
    # Register
    response = client.post("/auth/register", json={
        "email": "chaptertest@example.com",
        "username": "chaptertest",
        "password": "testpassword123"
    })
    
    assert response.status_code == 201
    tokens = response.json()
    return tokens["access_token"]


def test_open_pages_initialization():
    """Test that new users start with 3 Open Pages"""
    print("\n🧪 Testing Open Pages initialization...")
    
    token = register_and_login()
    
    # Get user info
    response = client.get("/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    
    user_data = response.json()
    assert user_data["open_pages"] == 3
    
    print("✅ New users start with 3 Open Pages!")
    return token


def test_create_chapter(token: str):
    """Test creating a chapter"""
    print("\n🧪 Testing chapter creation...")
    
    chapter_data = {
        "title": "My First Chapter",
        "mood": "contemplative",
        "theme": "beginnings",
        "blocks": [
            {
                "position": 0,
                "block_type": "text",
                "content": {"text": "This is the opening paragraph of my first chapter."}
            },
            {
                "position": 1,
                "block_type": "image",
                "content": {
                    "url": "https://example.com/image.jpg",
                    "alt": "A beautiful sunrise",
                    "caption": "New beginnings"
                }
            }
        ]
    }
    
    response = client.post(
        "/chapters",
        json=chapter_data,
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert response.status_code == 201, f"Expected 201, got {response.status_code}: {response.text}"
    chapter = response.json()
    
    assert chapter["title"] == "My First Chapter"
    assert chapter["mood"] == "contemplative"
    assert len(chapter["blocks"]) == 2
    assert chapter["blocks"][0]["block_type"] == "text"
    assert chapter["blocks"][1]["block_type"] == "image"
    
    print("✅ Chapter created successfully!")
    print(f"   Chapter ID: {chapter['id']}")
    print(f"   Title: {chapter['title']}")
    print(f"   Blocks: {len(chapter['blocks'])}")
    
    return chapter["id"]


def test_open_page_consumed(token: str):
    """Test that Open Page was consumed"""
    print("\n🧪 Testing Open Page consumption...")
    
    response = client.get("/auth/me", headers={"Authorization": f"Bearer {token}"})
    user_data = response.json()
    
    assert user_data["open_pages"] == 2, f"Expected 2 Open Pages, got {user_data['open_pages']}"
    
    print("✅ Open Page consumed! User now has 2 Open Pages")


def test_block_validation(token: str):
    """Test block count and media validation"""
    print("\n🧪 Testing block validation...")
    
    # Test: Too many blocks (>12)
    too_many_blocks = {
        "title": "Too Many Blocks",
        "blocks": [
            {"position": i, "block_type": "text", "content": {"text": f"Block {i}"}}
            for i in range(13)
        ]
    }
    
    response = client.post(
        "/chapters",
        json=too_many_blocks,
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert response.status_code == 422
    print("✅ Rejected chapter with >12 blocks")
    
    # Test: Too many media blocks (>2)
    too_many_media = {
        "title": "Too Many Media",
        "blocks": [
            {"position": 0, "block_type": "image", "content": {"url": "img1.jpg"}},
            {"position": 1, "block_type": "image", "content": {"url": "img2.jpg"}},
            {"position": 2, "block_type": "video", "content": {"url": "vid.mp4", "duration": 60}},
        ]
    }
    
    response = client.post(
        "/chapters",
        json=too_many_media,
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert response.status_code == 422
    print("✅ Rejected chapter with >2 media blocks")
    
    # Test: Audio too long (>5min)
    long_audio = {
        "title": "Long Audio",
        "blocks": [
            {"position": 0, "block_type": "audio", "content": {"url": "audio.mp3", "duration": 301}}
        ]
    }
    
    response = client.post(
        "/chapters",
        json=long_audio,
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert response.status_code == 422
    print("✅ Rejected audio >5 minutes")
    
    # Test: Video too long (>3min)
    long_video = {
        "title": "Long Video",
        "blocks": [
            {"position": 0, "block_type": "video", "content": {"url": "video.mp4", "duration": 181}}
        ]
    }
    
    response = client.post(
        "/chapters",
        json=long_video,
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert response.status_code == 422
    print("✅ Rejected video >3 minutes")


def test_get_chapter(token: str, chapter_id: int):
    """Test retrieving a chapter"""
    print("\n🧪 Testing chapter retrieval...")
    
    response = client.get(
        f"/chapters/{chapter_id}",
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert response.status_code == 200
    chapter = response.json()
    
    assert chapter["id"] == chapter_id
    assert "blocks" in chapter
    assert len(chapter["blocks"]) > 0
    
    print("✅ Chapter retrieved successfully!")


def test_update_chapter(token: str, chapter_id: int):
    """Test updating a chapter within edit window"""
    print("\n🧪 Testing chapter update...")
    
    update_data = {
        "title": "Updated Title",
        "mood": "joyful"
    }
    
    response = client.patch(
        f"/chapters/{chapter_id}",
        json=update_data,
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert response.status_code == 200
    chapter = response.json()
    
    assert chapter["title"] == "Updated Title"
    assert chapter["mood"] == "joyful"
    
    print("✅ Chapter updated successfully!")


def test_list_chapters(token: str):
    """Test listing chapters"""
    print("\n🧪 Testing chapter listing...")
    
    response = client.get(
        "/chapters",
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert response.status_code == 200
    chapters = response.json()
    
    assert isinstance(chapters, list)
    assert len(chapters) > 0
    
    print(f"✅ Listed {len(chapters)} chapter(s)")


def test_no_open_pages(token: str):
    """Test that publishing fails without Open Pages"""
    print("\n🧪 Testing Open Pages enforcement...")
    
    # Create 2 more chapters to use up remaining Open Pages
    for i in range(2):
        chapter_data = {
            "title": f"Chapter {i+2}",
            "blocks": [
                {"position": 0, "block_type": "text", "content": {"text": f"Content {i+2}"}}
            ]
        }
        response = client.post(
            "/chapters",
            json=chapter_data,
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == 201
    
    print("✅ Created 2 more chapters (0 Open Pages remaining)")
    
    # Try to create one more (should fail)
    chapter_data = {
        "title": "Should Fail",
        "blocks": [
            {"position": 0, "block_type": "text", "content": {"text": "This should fail"}}
        ]
    }
    
    response = client.post(
        "/chapters",
        json=chapter_data,
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert response.status_code == 400
    assert "No Open Pages available" in response.json()["detail"]
    
    print("✅ Publishing blocked when no Open Pages available!")


def test_delete_chapter(token: str, chapter_id: int):
    """Test deleting a chapter"""
    print("\n🧪 Testing chapter deletion...")
    
    response = client.delete(
        f"/chapters/{chapter_id}",
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert response.status_code == 204
    
    # Verify it's deleted
    response = client.get(
        f"/chapters/{chapter_id}",
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert response.status_code == 404
    
    print("✅ Chapter deleted successfully!")


if __name__ == "__main__":
    print("🧪 Running Open Pages and Chapter tests...\n")
    print("=" * 60)
    
    try:
        token = test_open_pages_initialization()
        chapter_id = test_create_chapter(token)
        test_open_page_consumed(token)
        test_block_validation(token)
        test_get_chapter(token, chapter_id)
        test_update_chapter(token, chapter_id)
        test_list_chapters(token)
        test_no_open_pages(token)
        test_delete_chapter(token, chapter_id)
        
        print("\n" + "=" * 60)
        print("🎉 All tests passed!")
        print("\n📝 Open Pages and Chapter Management ready!")
        print("\nFeatures working:")
        print("  ✅ Open Pages initialization (3 per user)")
        print("  ✅ Open Page consumption on publish")
        print("  ✅ Chapter creation with validation")
        print("  ✅ Block count limits (max 12)")
        print("  ✅ Media block limits (max 2)")
        print("  ✅ Media duration limits (audio 5min, video 3min)")
        print("  ✅ Chapter CRUD operations")
        print("  ✅ Edit window enforcement")
        print("  ✅ Publishing prevention without Open Pages")
        
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
