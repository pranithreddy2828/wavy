import pytest
import json

def test_register_and_login_flow(client):
    """Test full registration and login flow with Argon2id and JWT generation."""
    # 1. Register new user
    reg_payload = {
        "email": "priya.sharma@example.com",
        "password": "SecurePassword123!",
        "display_name": "Priya Sharma",
        "username": "priyasharma",
        "city": "Hyderabad"
    }
    res = client.post("/api/v1/auth/register", json=reg_payload)
    assert res.status_code == 201
    reg_data = res.get_json()
    assert reg_data["success"] is True
    assert "access_token" in reg_data["data"]
    assert "refresh_token" in reg_data["data"]
    assert reg_data["data"]["user"]["email"] == "priya.sharma@example.com"

    # 2. Login with valid credentials
    login_payload = {
        "email": "priya.sharma@example.com",
        "password": "SecurePassword123!"
    }
    res_login = client.post("/api/v1/auth/login", json=login_payload)
    assert res_login.status_code == 200
    login_data = res_login.get_json()
    assert login_data["success"] is True
    access_token = login_data["data"]["access_token"]
    refresh_token = login_data["data"]["refresh_token"]

    # 3. Access protected route with Bearer token
    headers = {"Authorization": f"Bearer {access_token}"}
    res_me = client.get("/api/v1/auth/me", headers=headers)
    assert res_me.status_code == 200
    me_data = res_me.get_json()
    assert me_data["user"]["email"] == "priya.sharma@example.com"

    # 4. Refresh token rotation
    res_ref = client.post("/api/v1/auth/refresh", json={"refresh_token": refresh_token})
    assert res_ref.status_code == 200
    ref_data = res_ref.get_json()
    assert "access_token" in ref_data["data"]
    assert "refresh_token" in ref_data["data"]
    new_refresh_token = ref_data["data"]["refresh_token"]
    assert new_refresh_token != refresh_token

    # 5. Security: Re-using the OLD refresh token triggers breach containment
    res_reuse = client.post("/api/v1/auth/refresh", json={"refresh_token": refresh_token})
    assert res_reuse.status_code == 401
    reuse_data = res_reuse.get_json()
    assert reuse_data["error"] == "BREACH_CONTAINMENT"

def test_registration_validation(client):
    """Test validation errors for email and password rules."""
    # Weak password (<8 chars)
    res = client.post("/api/v1/auth/register", json={
        "email": "weak@example.com",
        "password": "short",
        "display_name": "Weak User",
        "username": "weakuser"
    })
    assert res.status_code == 400
    assert res.get_json()["error"] == "WEAK_PASSWORD"

    # Missing fields
    res2 = client.post("/api/v1/auth/register", json={"email": "only@example.com"})
    assert res2.status_code == 400
    assert res2.get_json()["error"] == "VALIDATION_ERROR"

def test_login_invalid_credentials(client):
    """Test invalid password rejection."""
    # Register user first
    client.post("/api/v1/auth/register", json={
        "email": "karthik@example.com",
        "password": "CorrectPassword123!",
        "display_name": "Karthik Nair",
        "username": "karthiknair"
    })

    # Attempt wrong password
    res = client.post("/api/v1/auth/login", json={
        "email": "karthik@example.com",
        "password": "WrongPassword999!"
    })
    assert res.status_code == 401
    assert res.get_json()["error"] == "INVALID_CREDENTIALS"

def test_dpdp_account_deletion(client):
    """Test DPDP Right to Erasure / account deletion."""
    res_reg = client.post("/api/v1/auth/register", json={
        "email": "delete.me@example.com",
        "password": "Password12345!",
        "display_name": "Temporary User",
        "username": "temporaryuser"
    })
    access_token = res_reg.get_json()["data"]["access_token"]
    headers = {"Authorization": f"Bearer {access_token}"}

    # Delete account
    res_del = client.delete("/api/v1/auth/account", headers=headers)
    assert res_del.status_code == 200

    # User can no longer access /me
    res_me_after = client.get("/api/v1/auth/me", headers=headers)
    assert res_me_after.status_code == 403

