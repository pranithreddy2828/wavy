from datetime import datetime, timezone
from sqlalchemy import or_, and_
from app import db
from app.models.chat import Conversation, Message

class ChatService:
    @staticmethod
    def get_or_create_conversation(user1_id: str, user2_id: str, request_id: str = None) -> Conversation:
        """Finds or creates duplex direct conversation between two users."""
        if user1_id == user2_id:
            raise ValueError("CANNOT_CHAT_WITH_SELF")

        conv = Conversation.query.filter(
            or_(
                and_(Conversation.user1_id == user1_id, Conversation.user2_id == user2_id),
                and_(Conversation.user1_id == user2_id, Conversation.user2_id == user1_id),
            )
        ).first()

        if not conv:
            conv = Conversation(
                user1_id=user1_id,
                user2_id=user2_id,
                request_id=request_id,
            )
            db.session.add(conv)
            db.session.commit()

        return conv

    @staticmethod
    def get_user_conversations(user_id: str) -> list[dict]:
        """Lists active conversations for a user."""
        convs = Conversation.query.filter(
            or_(Conversation.user1_id == user_id, Conversation.user2_id == user_id)
        ).order_by(Conversation.created_at.desc()).all()
        return [c.to_dict(current_user_id=user_id) for c in convs]

    @staticmethod
    def get_messages(conversation_id: str, user_id: str, limit: int = 50) -> list[dict]:
        """Retrieves paginated chat history for authorized participant."""
        conv = Conversation.query.filter_by(id=conversation_id).first()
        if not conv or user_id not in [conv.user1_id, conv.user2_id]:
            raise ValueError("UNAUTHORIZED_OR_NOT_FOUND")

        messages = Message.query.filter_by(conversation_id=conversation_id).order_by(Message.created_at.asc()).limit(limit).all()
        return [m.to_dict() for m in messages]

    @staticmethod
    def send_message(conversation_id: str, sender_id: str, content: str, message_type: str = "text") -> Message:
        """Appends and persists message to conversation."""
        conv = Conversation.query.filter_by(id=conversation_id).first()
        if not conv or sender_id not in [conv.user1_id, conv.user2_id]:
            raise ValueError("UNAUTHORIZED_OR_NOT_FOUND")

        if not content.strip():
            raise ValueError("EMPTY_MESSAGE")

        msg = Message(
            conversation_id=conversation_id,
            sender_id=sender_id,
            content=content.strip(),
            message_type=message_type,
            is_read=False,
        )
        db.session.add(msg)
        db.session.commit()
        return msg

