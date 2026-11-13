import uuid
from datetime import datetime, timezone
from sqlalchemy import (
    Column,
    String,
    Text,
    Boolean,
    DateTime,
    ForeignKey,
    UniqueConstraint,
    Enum as SQLEnum,
)
from sqlalchemy.orm import relationship
from app import db

def generate_uuid():
    return str(uuid.uuid4())

class Conversation(db.Model):
    __tablename__ = "conversations"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    request_id = Column(String(36), ForeignKey("requests.id", ondelete="SET NULL"), nullable=True)
    user1_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    user2_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    __table_args__ = (UniqueConstraint("request_id", "user1_id", "user2_id", name="uq_conversation_participants"),)

    user1 = relationship("User", foreign_keys=[user1_id])
    user2 = relationship("User", foreign_keys=[user2_id])
    messages = relationship("Message", back_populates="conversation", cascade="all, delete-orphan", order_by="Message.created_at.asc()")

    def to_dict(self, current_user_id=None):
        other_user = self.user2 if current_user_id == self.user1_id else self.user1
        last_msg = self.messages[-1] if self.messages else None
        return {
            "id": self.id,
            "request_id": self.request_id,
            "other_user": {
                "id": other_user.id,
                "display_name": other_user.profile.display_name if other_user.profile else "Neighbour",
                "avatar_url": other_user.profile.avatar_url if other_user.profile else None,
            } if other_user else None,
            "last_message": last_msg.to_dict() if last_msg else None,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }

class Message(db.Model):
    __tablename__ = "messages"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    conversation_id = Column(String(36), ForeignKey("conversations.id", ondelete="CASCADE"), nullable=False, index=True)
    sender_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    message_type = Column(
        SQLEnum("text", "image", "location_pin", "system", name="message_type_enum"),
        default="text",
        nullable=False,
    )
    content = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    conversation = relationship("Conversation", back_populates="messages")
    sender = relationship("User", foreign_keys=[sender_id])

    def to_dict(self):
        return {
            "id": self.id,
            "conversation_id": self.conversation_id,
            "sender_id": self.sender_id,
            "sender_name": self.sender.profile.display_name if self.sender and self.sender.profile else "User",
            "message_type": self.message_type,
            "content": self.content,
            "is_read": self.is_read,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }

