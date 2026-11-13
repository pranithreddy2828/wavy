import uuid
from datetime import datetime, timezone
from sqlalchemy import (
    Column,
    String,
    Text,
    Numeric,
    DateTime,
    ForeignKey,
    UniqueConstraint,
    Enum as SQLEnum,
)
from sqlalchemy.orm import relationship
from app import db

def generate_uuid():
    return str(uuid.uuid4())

class Offer(db.Model):
    __tablename__ = "offers"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    request_id = Column(String(36), ForeignKey("requests.id", ondelete="CASCADE"), nullable=False, index=True)
    helper_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    proposed_price = Column(Numeric(10, 2), nullable=False)
    estimated_completion = Column(String(100), nullable=False)
    note = Column(Text, nullable=True)
    status = Column(
        SQLEnum("submitted", "negotiating", "accepted", "rejected", "withdrawn", name="offer_status_enum"),
        default="submitted",
        nullable=False,
        index=True,
    )
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    __table_args__ = (UniqueConstraint("request_id", "helper_id", name="uq_request_helper"),)

    # Relationships
    request = relationship("Request", back_populates="offers")
    helper = relationship("User", foreign_keys=[helper_id])
    negotiations = relationship("Negotiation", back_populates="offer", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "request_id": self.request_id,
            "helper_id": self.helper_id,
            "proposed_price": float(self.proposed_price),
            "estimated_completion": self.estimated_completion,
            "note": self.note,
            "status": self.status,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "helper": {
                "id": self.helper.id,
                "display_name": self.helper.profile.display_name if self.helper.profile else "Helper",
                "avatar_url": self.helper.profile.avatar_url if self.helper.profile else None,
                "rating_avg": float(self.helper.profile.rating_avg) if self.helper.profile else 5.0,
                "reviews_count": self.helper.profile.reviews_count if self.helper.profile else 0,
                "is_verified": self.helper.profile.is_id_verified if self.helper.profile else False,
            } if self.helper else None,
        }

class Negotiation(db.Model):
    __tablename__ = "negotiations"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    offer_id = Column(String(36), ForeignKey("offers.id", ondelete="CASCADE"), nullable=False)
    proposer_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    proposed_price = Column(Numeric(10, 2), nullable=False)
    message = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    offer = relationship("Offer", back_populates="negotiations")
    proposer = relationship("User", foreign_keys=[proposer_id])

    def to_dict(self):
        return {
            "id": self.id,
            "offer_id": self.offer_id,
            "proposer_id": self.proposer_id,
            "proposed_price": float(self.proposed_price),
            "message": self.message,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }

class Activity(db.Model):
    __tablename__ = "activities"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    request_id = Column(String(36), ForeignKey("requests.id", ondelete="RESTRICT"), unique=True, nullable=False)
    offer_id = Column(String(36), ForeignKey("offers.id", ondelete="RESTRICT"), unique=True, nullable=False)
    requester_id = Column(String(36), ForeignKey("users.id", ondelete="RESTRICT"), nullable=False)
    helper_id = Column(String(36), ForeignKey("users.id", ondelete="RESTRICT"), nullable=False)
    agreed_price = Column(Numeric(10, 2), nullable=False)
    status = Column(
        SQLEnum("in_progress", "completed", "cancelled", "disputed", name="activity_status_enum"),
        default="in_progress",
        nullable=False,
        index=True,
    )
    started_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    completed_at = Column(DateTime, nullable=True)
    cancelled_at = Column(DateTime, nullable=True)
    cancellation_reason = Column(Text, nullable=True)

    request = relationship("Request")
    offer = relationship("Offer")
    requester = relationship("User", foreign_keys=[requester_id])
    helper = relationship("User", foreign_keys=[helper_id])

    def to_dict(self):
        return {
            "id": self.id,
            "request_id": self.request_id,
            "offer_id": self.offer_id,
            "requester_id": self.requester_id,
            "helper_id": self.helper_id,
            "title": self.request.title if self.request else "Community Assist",
            "category": self.request.category.name if self.request and self.request.category else "Assistance",
            "agreed_price": float(self.agreed_price),
            "status": self.status,
            "started_at": self.started_at.isoformat() if self.started_at else None,
            "completed_at": self.completed_at.isoformat() if self.completed_at else None,
            "requester_name": self.requester.profile.display_name if self.requester and self.requester.profile else "Requester",
            "helper_name": self.helper.profile.display_name if self.helper and self.helper.profile else "Helper",
        }

