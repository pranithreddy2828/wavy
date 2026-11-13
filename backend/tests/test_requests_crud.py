def test_create_and_fetch_request(client):
    # 1. Create a new community request
    payload = {
        "title": "Need 500W Power Drill for 1 Hour",
        "description": "Mounting wall frame near Gachibowli DLF. Will return within 90 minutes.",
        "category_id": 1,
        "urgency": "urgent",
        "budget": 150.0,
        "area_name": "Gachibowli",
        "visibility_radius_km": 5,
    }
    create_res = client.post("/api/v1/requests", json=payload)
    assert create_res.status_code == 201
    create_data = create_res.get_json()
    assert create_data["success"] is True
    assert "request" in create_data
    req_id = create_data["request"]["id"]
    assert req_id is not None
    assert create_data["request"]["title"] == payload["title"]

    # 2. Fetch the request details
    get_res = client.get(f"/api/v1/requests/{req_id}")
    assert get_res.status_code == 200
    get_data = get_res.get_json()
    assert get_data["success"] is True
    assert get_data["request"]["id"] == req_id
    assert get_data["request"]["location"]["area_name"] == "Gachibowli"
    # Ensure raw GPS is masked (fuzzy coordinates provided)
    assert "fuzzy_latitude" in get_data["request"]["location"]

