import pytest
from app import create_app

@pytest.fixture
def client():
    app = create_app("development")
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client

def test_categories_endpoint(client):
    response = client.get("/api/v1/categories")
    assert response.status_code == 200
    data = response.get_json()
    assert data["success"] is True
    assert len(data["categories"]) >= 14
    slugs = [c["slug"] for c in data["categories"]]
    assert "printing" in slugs
    assert "transportation" in slugs
    assert "tutoring" in slugs

def test_feed_endpoint(client):
    response = client.get("/api/v1/requests/feed")
    assert response.status_code == 200
    data = response.get_json()
    assert data["success"] is True
    assert len(data["requests"]) > 0
    assert data["city"] == "Hyderabad"

def test_feed_category_filter(client):
    response = client.get("/api/v1/requests/feed?category=printing")
    assert response.status_code == 200
    data = response.get_json()
    for req in data["requests"]:
        assert req["category_slug"] == "printing"

