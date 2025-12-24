"""Test Study System - Drafts and Notes"""
import sys
import os

backend_dir = os.path.dirname(__file__)
os.chdir(backend_dir)
sys.path.insert(0, backend_dir)

from fastapi.testclient import TestClient
from app.main import app
from app.database import SessionLocal
from app.models import User, Draft, Note

client = TestClient(app)


def cleanup_test_data():
    """Clean up test data"""
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == "studytest@example.com").first()
        if user:
            db.delete(user)
            db.commit()
    finally:
        db.close()


def register_and_login():
    """Register and login a test user"""
    cleanup_test_data()
    
    response = client.post("/auth/register", json={
        "email": "studytest@example.com",
        "username": "studytest",
        "password": "testpassword123"
    })
    
    assert response.status_code == 201
    tokens = response.json()
    return tokens["access_token"]


def test_create_draft(token: str):
    """Test creating a draft"""
    print("\n🧪 Testing draft creation...")
    
    draft_data = {
        "title": "My First Draft",
        "mood": "reflective",
        "theme": "growth",
        "blocks": [
            {
                "position": 0,
                "block_type": "text",
                "content": {"text": "This is a draft I'm working on."}
            },
            {
                "position": 1,
                "block_type": "quote",
                "content": {
                    "text": "The journey of a thousand miles begins with one step.",
                    "author": "Lao Tzu"
                }
            }
        ]
    }
    
    response = client.post(
        "/study/drafts",
        json=draft_data,
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert response.status_code == 201, f"Expected 201, got {response.status_code}: {response.text}"
    draft = response.json()
    
    assert draft["title"] == "My First Draft"
    assert draft["mood"] == "reflective"
    assert len(draft["blocks"]) == 2
    
    print("✅ Draft created successfully!")
    print(f"   Draft ID: {draft['id']}")
    print(f"   Title: {draft['title']}")
    
    return draft["id"]


def test_list_drafts(token: str):
    """Test listing user's drafts"""
    print("\n🧪 Testing draft listing...")
    
    response = client.get(
        "/study/drafts",
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert response.status_code == 200
    drafts = response.json()
    
    assert isinstance(drafts, list)
    assert len(drafts) > 0
    
    print(f"✅ Listed {len(drafts)} draft(s)")


def test_get_draft(token: str, draft_id: int):
    """Test retrieving a specific draft"""
    print("\n🧪 Testing draft retrieval...")
    
    response = client.get(
        f"/study/drafts/{draft_id}",
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert response.status_code == 200
    draft = response.json()
    
    assert draft["id"] == draft_id
    assert "blocks" in draft
    
    print("✅ Draft retrieved successfully!")


def test_update_draft(token: str, draft_id: int):
    """Test updating a draft"""
    print("\n🧪 Testing draft update...")
    
    update_data = {
        "title": "Updated Draft Title",
        "mood": "hopeful"
    }
    
    response = client.patch(
        f"/study/drafts/{draft_id}",
        json=update_data,
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert response.status_code == 200
    draft = response.json()
    
    assert draft["title"] == "Updated Draft Title"
    assert draft["mood"] == "hopeful"
    
    print("✅ Draft updated successfully!")


def test_create_note(token: str):
    """Test creating a note"""
    print("\n🧪 Testing note creation...")
    
    note_data = {
        "title": "Story Idea",
        "content": "What if the protagonist discovers they've been living in a simulation?",
        "tags": ["sci-fi", "ideas", "plot"]
    }
    
    response = client.post(
        "/study/notes",
        json=note_data,
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert response.status_code == 201
    note = response.json()
    
    assert note["title"] == "Story Idea"
    assert len(note["tags"]) == 3
    assert "sci-fi" in note["tags"]
    
    print("✅ Note created successfully!")
    print(f"   Note ID: {note['id']}")
    print(f"   Tags: {note['tags']}")
    
    return note["id"]


def test_list_notes(token: str):
    """Test listing notes"""
    print("\n🧪 Testing note listing...")
    
    response = client.get(
        "/study/notes",
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert response.status_code == 200
    notes = response.json()
    
    assert isinstance(notes, list)
    assert len(notes) > 0
    
    print(f"✅ Listed {len(notes)} note(s)")


def test_list_notes_by_tag(token: str):
    """Test filtering notes by tag"""
    print("\n🧪 Testing note filtering by tag...")
    
    response = client.get(
        "/study/notes?tag=sci-fi",
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert response.status_code == 200
    notes = response.json()
    
    assert isinstance(notes, list)
    for note in notes:
        assert "sci-fi" in note["tags"]
    
    print(f"✅ Filtered notes by tag: {len(notes)} result(s)")


def test_update_note(token: str, note_id: int):
    """Test updating a note"""
    print("\n🧪 Testing note update...")
    
    update_data = {
        "content": "Updated: What if the protagonist discovers they've been living in a simulation and decides to stay?",
        "tags": ["sci-fi", "ideas", "plot", "character"]
    }
    
    response = client.patch(
        f"/study/notes/{note_id}",
        json=update_data,
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert response.status_code == 200
    note = response.json()
    
    assert "Updated:" in note["content"]
    assert len(note["tags"]) == 4
    
    print("✅ Note updated successfully!")


def test_promote_draft(token: str, draft_id: int):
    """Test promoting a draft to a chapter"""
    print("\n🧪 Testing draft promotion...")
    
    # Check Open Pages before
    response = client.get("/auth/me", headers={"Authorization": f"Bearer {token}"})
    user_before = response.json()
    open_pages_before = user_before["open_pages"]
    
    print(f"   Open Pages before: {open_pages_before}")
    
    # Promote draft
    response = client.post(
        f"/study/drafts/{draft_id}/promote",
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert response.status_code == 201, f"Expected 201, got {response.status_code}: {response.text}"
    chapter = response.json()
    
    assert "id" in chapter
    assert chapter["title"] == "Updated Draft Title"  # From previous update
    
    # Check Open Pages after
    response = client.get("/auth/me", headers={"Authorization": f"Bearer {token}"})
    user_after = response.json()
    open_pages_after = user_after["open_pages"]
    
    print(f"   Open Pages after: {open_pages_after}")
    
    assert open_pages_after == open_pages_before - 1
    
    print("✅ Draft promoted to chapter!")
    print(f"   Chapter ID: {chapter['id']}")
    print(f"   Open Page consumed!")
    
    return chapter["id"]


def test_draft_still_exists(token: str, draft_id: int):
    """Test that original draft still exists after promotion"""
    print("\n🧪 Testing draft persistence after promotion...")
    
    response = client.get(
        f"/study/drafts/{draft_id}",
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert response.status_code == 200
    draft = response.json()
    
    assert draft["id"] == draft_id
    
    print("✅ Original draft still exists after promotion!")


def test_delete_note(token: str, note_id: int):
    """Test deleting a note"""
    print("\n🧪 Testing note deletion...")
    
    response = client.delete(
        f"/study/notes/{note_id}",
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert response.status_code == 204
    
    # Verify it's deleted
    response = client.get(
        f"/study/notes/{note_id}",
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert response.status_code == 404
    
    print("✅ Note deleted successfully!")


def test_delete_draft(token: str, draft_id: int):
    """Test deleting a draft"""
    print("\n🧪 Testing draft deletion...")
    
    response = client.delete(
        f"/study/drafts/{draft_id}",
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert response.status_code == 204
    
    # Verify it's deleted
    response = client.get(
        f"/study/drafts/{draft_id}",
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert response.status_code == 404
    
    print("✅ Draft deleted successfully!")


if __name__ == "__main__":
    print("🧪 Running Study System tests...\n")
    print("=" * 60)
    
    try:
        token = register_and_login()
        draft_id = test_create_draft(token)
        test_list_drafts(token)
        test_get_draft(token, draft_id)
        test_update_draft(token, draft_id)
        note_id = test_create_note(token)
        test_list_notes(token)
        test_list_notes_by_tag(token)
        test_update_note(token, note_id)
        chapter_id = test_promote_draft(token, draft_id)
        test_draft_still_exists(token, draft_id)
        test_delete_note(token, note_id)
        test_delete_draft(token, draft_id)
        
        print("\n" + "=" * 60)
        print("🎉 All tests passed!")
        print("\n📝 Study System ready!")
        print("\nFeatures working:")
        print("  ✅ Draft creation and management")
        print("  ✅ Draft listing and retrieval")
        print("  ✅ Draft updates")
        print("  ✅ Note creation with tags")
        print("  ✅ Note filtering by tag")
        print("  ✅ Note updates")
        print("  ✅ Draft promotion to chapter")
        print("  ✅ Open Page consumption on promotion")
        print("  ✅ Draft persistence after promotion")
        print("  ✅ Draft and note deletion")
        
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
