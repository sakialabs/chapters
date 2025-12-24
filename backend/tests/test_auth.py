"""Test authentication endpoints"""
import sys
import os

# Change to backend directory
backend_dir = os.path.dirname(__file__)
os.chdir(backend_dir)
sys.path.insert(0, backend_dir)

from fastapi.testclient import TestClient
from app.main import app
from app.database import SessionLocal
from app.models import User, Book

client = TestClient(app)


def cleanup_test_user(email: str):
    """Clean up test user if exists"""
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == email).first()
        if user:
            db.delete(user)
            db.commit()
    finally:
        db.close()


def test_user_registration():
    """Test user registration"""
    print("\n🧪 Testing user registration...")
    
    # Clean up if test user exists
    test_email = "testuser@example.com"
    cleanup_test_user(test_email)
    
    # Register new user
    response = client.post("/auth/register", json={
        "email": test_email,
        "username": "testuser",
        "password": "securepassword123"
    })
    
    assert response.status_code == 201, f"Expected 201, got {response.status_code}: {response.text}"
    data = response.json()
    
    assert "access_token" in data
    assert "refresh_token" in data
    assert data["token_type"] == "bearer"
    
    print("✅ User registration works!")
    print(f"   Access token: {data['access_token'][:20]}...")
    
    # Verify user and book were created
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == test_email).first()
        assert user is not None
        assert user.username == "testuser"
        assert user.open_pages == 3
        assert user.book is not None
        print("✅ User and Book created correctly!")
    finally:
        db.close()
    
    return data["access_token"]


def test_duplicate_registration():
    """Test that duplicate registration fails"""
    print("\n🧪 Testing duplicate registration prevention...")
    
    # Try to register with same email
    response = client.post("/auth/register", json={
        "email": "testuser@example.com",
        "username": "testuser2",
        "password": "securepassword123"
    })
    
    assert response.status_code == 400
    assert "already registered" in response.json()["detail"].lower()
    
    print("✅ Duplicate email prevention works!")
    
    # Try to register with same username
    response = client.post("/auth/register", json={
        "email": "testuser2@example.com",
        "username": "testuser",
        "password": "securepassword123"
    })
    
    assert response.status_code == 400
    assert "already taken" in response.json()["detail"].lower()
    
    print("✅ Duplicate username prevention works!")


def test_user_login():
    """Test user login"""
    print("\n🧪 Testing user login...")
    
    # Login with correct credentials
    response = client.post("/auth/login", json={
        "email": "testuser@example.com",
        "password": "securepassword123"
    })
    
    assert response.status_code == 200
    data = response.json()
    
    assert "access_token" in data
    assert "refresh_token" in data
    
    print("✅ User login works!")
    
    # Try login with wrong password
    response = client.post("/auth/login", json={
        "email": "testuser@example.com",
        "password": "wrongpassword"
    })
    
    assert response.status_code == 401
    print("✅ Wrong password rejected!")
    
    return data["access_token"], data["refresh_token"]


def test_get_current_user(access_token: str):
    """Test getting current user info"""
    print("\n🧪 Testing get current user...")
    
    # Get user info with valid token
    response = client.get(
        "/auth/me",
        headers={"Authorization": f"Bearer {access_token}"}
    )
    
    if response.status_code != 200:
        print(f"❌ Error: {response.status_code}")
        print(f"   Response: {response.text}")
    
    assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
    data = response.json()
    
    assert data["email"] == "testuser@example.com"
    assert data["username"] == "testuser"
    assert data["open_pages"] == 3
    
    print("✅ Get current user works!")
    print(f"   User: {data['username']} ({data['email']})")
    print(f"   Open Pages: {data['open_pages']}")


def test_token_refresh(refresh_token: str):
    """Test token refresh"""
    print("\n🧪 Testing token refresh...")
    
    # Refresh tokens
    response = client.post(
        "/auth/refresh",
        params={"refresh_token": refresh_token}
    )
    
    assert response.status_code == 200
    data = response.json()
    
    assert "access_token" in data
    assert "refresh_token" in data
    
    print("✅ Token refresh works!")
    print(f"   New access token: {data['access_token'][:20]}...")


def test_invalid_token():
    """Test that invalid tokens are rejected"""
    print("\n🧪 Testing invalid token rejection...")
    
    # Try to access protected endpoint with invalid token
    response = client.get(
        "/auth/me",
        headers={"Authorization": "Bearer invalid_token_here"}
    )
    
    assert response.status_code == 401
    print("✅ Invalid token rejected!")


def test_password_hashing():
    """Test that passwords are properly hashed"""
    print("\n🧪 Testing password hashing...")
    
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == "testuser@example.com").first()
        
        # Password should be hashed, not plain text
        assert user.password_hash != "securepassword123"
        assert user.password_hash.startswith("$2b$")  # bcrypt hash
        
        print("✅ Password hashing works!")
        print(f"   Hash: {user.password_hash[:30]}...")
    finally:
        db.close()


if __name__ == "__main__":
    print("🧪 Running authentication tests...\n")
    print("=" * 60)
    
    try:
        # Run tests in order
        access_token = test_user_registration()
        test_duplicate_registration()
        access_token, refresh_token = test_user_login()  # Use token from login
        test_get_current_user(access_token)
        test_token_refresh(refresh_token)
        test_invalid_token()
        test_password_hashing()
        
        print("\n" + "=" * 60)
        print("🎉 All authentication tests passed!")
        print("\n📝 Authentication system is ready!")
        print("\nYou can now:")
        print("  1. Register users: POST /auth/register")
        print("  2. Login: POST /auth/login")
        print("  3. Get user info: GET /auth/me")
        print("  4. Refresh tokens: POST /auth/refresh")
        
        # Clean up
        print("\n🧹 Cleaning up test data...")
        cleanup_test_user("testuser@example.com")
        print("✅ Cleanup complete!")
        
    except AssertionError as e:
        print(f"\n❌ Test failed: {e}")
        import traceback
        traceback.print_exc()
        
        # Clean up on failure too
        cleanup_test_user("testuser@example.com")
    
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")
        import traceback
        traceback.print_exc()
        
        # Clean up on failure too
        cleanup_test_user("testuser@example.com")
