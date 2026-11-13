from flask import Blueprint, jsonify, request, g
from app.services.chat_service import ChatService
from app.middleware.auth_guard import jwt_required, optional_jwt

chat_bp = Blueprint("chat", __name__, url_prefix="/chat")

@chat_bp.route("/conversations", methods=["GET"])
@optional_jwt
def get_conversations():
    """Retrieve active conversations for the user."""
    user_id = g.current_user.id if hasattr(g, "current_user") and g.current_user else None
    if not user_id:
        from app.models.user import User
        demo_user = User.query.first()
        user_id = demo_user.id if demo_user else None

    convs = ChatService.get_user_conversations(user_id=user_id) if user_id else []
    return jsonify({
        "success": True,
        "count": len(convs),
        "conversations": convs,
    }), 200

@chat_bp.route("/conversations", methods=["POST"])
@optional_jwt
def start_conversation():
    """Start or retrieve duplex conversation between two users."""
    data = request.get_json(silent=True) or {}
    recipient_id = data.get("recipient_id")
    request_id = data.get("request_id")

    if not recipient_id:
        return jsonify({"error": "VALIDATION_ERROR", "message": "recipient_id is required"}), 400

    sender_id = g.current_user.id if hasattr(g, "current_user") and g.current_user else None
    if not sender_id:
        from app.models.user import User
        demo_user = User.query.first()
        sender_id = demo_user.id if demo_user else None

    try:
        conv = ChatService.get_or_create_conversation(
            user1_id=sender_id,
            user2_id=recipient_id,
            request_id=request_id,
        )
        return jsonify({
            "success": True,
            "conversation": conv.to_dict(current_user_id=sender_id),
        }), 201
    except ValueError as err:
        return jsonify({"error": "CHAT_ERROR", "message": str(err)}), 400

@chat_bp.route("/conversations/<string:conversation_id>/messages", methods=["GET"])
@optional_jwt
def get_messages(conversation_id):
    """Retrieve paginated messages for a conversation."""
    user_id = g.current_user.id if hasattr(g, "current_user") and g.current_user else None
    if not user_id:
        from app.models.chat import Conversation
        conv = Conversation.query.filter_by(id=conversation_id).first()
        user_id = conv.user1_id if conv else None

    try:
        msgs = ChatService.get_messages(conversation_id=conversation_id, user_id=user_id)
        return jsonify({
            "success": True,
            "count": len(msgs),
            "messages": msgs,
        }), 200
    except ValueError as err:
        return jsonify({"error": "CHAT_ERROR", "message": str(err)}), 400

@chat_bp.route("/conversations/<string:conversation_id>/messages", methods=["POST"])
@optional_jwt
def send_message(conversation_id):
    """Append a message to a conversation."""
    data = request.get_json(silent=True) or {}
    content = data.get("content", "")
    message_type = data.get("message_type", "text")

    sender_id = g.current_user.id if hasattr(g, "current_user") and g.current_user else None
    if not sender_id:
        from app.models.chat import Conversation
        conv = Conversation.query.filter_by(id=conversation_id).first()
        sender_id = conv.user1_id if conv else None

    try:
        msg = ChatService.send_message(
            conversation_id=conversation_id,
            sender_id=sender_id,
            content=content,
            message_type=message_type,
        )
        return jsonify({
            "success": True,
            "message": msg.to_dict(),
        }), 201
    except ValueError as err:
        return jsonify({"error": "CHAT_ERROR", "message": str(err)}), 400

