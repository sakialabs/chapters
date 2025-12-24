"""Test that the API starts correctly"""
import sys
import os

# Change to backend directory
backend_dir = os.path.dirname(__file__)
os.chdir(backend_dir)
sys.path.insert(0, backend_dir)

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_root_endpoint():
    """Test the root endpoint"""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert "Chapters" in data["message"]
    print("✅ Root endpoint works!")
    print(f"   Response: {data}")

def test_health_endpoint():
    """Test the health check endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    print("✅ Health endpoint works!")
    print(f"   Response: {data}")

if __name__ == "__main__":
    print("🧪 Testing API endpoints...\n")
    
    try:
        test_root_endpoint()
        test_health_endpoint()
        
        print("\n🎉 All API tests passed!")
        print("\n📝 API is ready! You can start it with:")
        print("   cd backend")
        print("   python -m uvicorn app.main:app --reload")
        print("\n   Then visit: http://localhost:8000/docs")
        
    except Exception as e:
        print(f"\n❌ Test failed: {e}")
        import traceback
        traceback.print_exc()
