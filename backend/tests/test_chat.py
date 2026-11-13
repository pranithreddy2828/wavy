def test_chat_messaging_flow(client):
    # 1. Register two participants
    res1 = client.post("/api/v1/auth/register", json={
        "email": "user.chat1@wavy.local",
        "password": "Password123!",
        "display_name": "Chat User 1",
        "username": "chat_user1",
    })
    token1 = res1.get_json()["data"]["access_token"]
    u1_id = res1.get_json()["data"]["user"]["id"]

    res2 = client.post("/api/v1/auth/register", json={
        "email": "user.chat2@wavy.local",
        "password": "Password123!",
        "display_name": "Chat User 2",
        "username": "chat_user2",
    })
    token2 = res2.get_json()["data"]["access_token"]
    u2_id = res2.get_json()["data"]["user"]["id"]

    # 2. User 1 starts conversation with User 2
    conv_res = client.post("/api/v1/chat/conversations", json={
        "recipient_id": u2_id,
    }, headers={"Authorization": f"Bearer {token1}"})
    assert conv_res.status_code == 201
    conv_id = conv_res.get_json()["conversation"]["id"]

    # 3. User 1 sends message
    send_res = client.post(f"/api/v1/chat/conversations/{conv_id}/messages", json={
        "content": "Hi, are you free for the assist today?",
    }, headers={"Authorization": f"Bearer {token1}"})
    assert send_res.status_code == 201
    assert send_res.get_json()["message"]["content"] == "Hi, are you free for the assist today?"

    # 4. User 2 reads conversation messages
    msgs_res = client.get(f"/api/v1/chat/conversations/{conv_id}/messages", headers={"Authorization": f"Bearer {token2}"})
    assert msgs_res.status_code == 200
    assert msgs_res.get_json()["count"] == 1
