from app.services.location_service import haversine_distance_km, fuzz_coordinates

def test_haversine_and_fuzzing():
    # Gachibowli to Hitech City is ~3 km
    gachi = (17.4401, 78.3489)
    hitech = (17.4474, 78.3762)
    dist = haversine_distance_km(gachi[0], gachi[1], hitech[0], hitech[1])
    assert 2.0 <= dist <= 4.0

    # Test coordinate fuzzing within ~1 km
    f_lat, f_lon = fuzz_coordinates(gachi[0], gachi[1], max_radius_km=1.0)
    diff_km = haversine_distance_km(gachi[0], gachi[1], f_lat, f_lon)
    assert diff_km <= 1.5

def test_admin_analytics_endpoint(client):
    res = client.get("/api/v1/admin/stats")
    assert res.status_code == 200
    data = res.get_json()
    assert data["success"] is True
    assert "analytics" in data
    assert "total_users" in data["analytics"]
    assert "active_requests" in data["analytics"]
    assert data["analytics"]["currency"] == "INR"

def test_report_and_block_flow(client):
    # Register two users
    u1 = client.post("/api/v1/auth/register", json={
        "email": "reporter@wavy.local", "password": "Password123!", "display_name": "Reporter", "username": "reporter1"
    }).get_json()["data"]["user"]["id"]

    u2 = client.post("/api/v1/auth/register", json={
        "email": "spammer@wavy.local", "password": "Password123!", "display_name": "Spammer", "username": "spammer1"
    }).get_json()["data"]["user"]["id"]

    # Reporter reports spammer
    rep_res = client.post(f"/api/v1/users/{u2}/report", json={
        "reason": "spam",
        "details": "Sent irrelevant spam messages",
    })
    assert rep_res.status_code == 201

    # Admin lists reports
    admin_reports = client.get("/api/v1/admin/reports")
    assert admin_reports.status_code == 200
    assert admin_reports.get_json()["count"] >= 1

    # Block user
    block_res = client.post(f"/api/v1/users/{u2}/block")
    assert block_res.status_code == 200

