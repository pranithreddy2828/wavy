def test_offer_and_activity_lifecycle(client):
    # 1. Create a request first
    req_res = client.post("/api/v1/requests", json={
        "title": "Need Help Assembling IKEA Study Table",
        "description": "Have Allen key set, need second pair of hands for 30 minutes in Kondapur.",
        "category_id": 1,
        "urgency": "medium",
        "budget": 300.0,
        "area_name": "Kondapur",
    })
    req_id = req_res.get_json()["request"]["id"]

    # 2. Register helper user
    helper_res = client.post("/api/v1/auth/register", json={
        "email": "helper.kondapur@wavy.local",
        "password": "Password123!",
        "display_name": "Vikram Carpenter",
        "username": "vikram_kondapur",
    })
    helper_token = helper_res.get_json()["data"]["access_token"]
    headers = {"Authorization": f"Bearer {helper_token}"}

    # 3. Helper submits offer
    offer_res = client.post(f"/api/v1/requests/{req_id}/offers", json={
        "proposed_price": 350.0,
        "estimated_completion": "Today in 45 mins",
        "note": "Experienced with flat-pack furniture assembly.",
    }, headers=headers)
    assert offer_res.status_code == 201
    offer_id = offer_res.get_json()["offer"]["id"]

    # 4. List offers for request
    list_res = client.get(f"/api/v1/requests/{req_id}/offers")
    assert list_res.status_code == 200
    assert list_res.get_json()["count"] >= 1

    # 5. Counter-offer negotiation
    counter_res = client.post(f"/api/v1/offers/{offer_id}/counter", json={
        "proposed_price": 320.0,
        "message": "Can meet at 320 INR?",
    })
    assert counter_res.status_code == 200
    assert counter_res.get_json()["negotiation"]["proposed_price"] == 320.0

    # 6. Accept offer -> Creates active Activity
    accept_res = client.post(f"/api/v1/offers/{offer_id}/accept")
    assert accept_res.status_code == 200
    act_data = accept_res.get_json()
    assert act_data["success"] is True
    act_id = act_data["activity"]["id"]
    assert act_data["activity"]["status"] == "in_progress"

    # 7. Complete Activity
    comp_res = client.post(f"/api/v1/activities/{act_id}/complete")
    assert comp_res.status_code == 200
    assert comp_res.get_json()["activity"]["status"] == "completed"
