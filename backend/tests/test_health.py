import pytest
from app import create_app

@pytest.fixture
def client():
    app = create_app("development")
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client

def test_health_endpoint(client):
    """Test that /api/v1/health returns HTTP 200 and expected payload structure."""
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.get_json()
    assert "status" in data
    assert data["service"] == "WAVY API Core"
    assert "database" in data
    assert "version" in data

def test_not_found_endpoint(client):
    """Test that nonexistent endpoints return our structured 404 JSON."""
    response = client.get("/api/v1/nonexistent-route")
    assert response.status_code == 404
    data = response.get_json()
    assert data["error"] == "RESOURCE_NOT_FOUND"

