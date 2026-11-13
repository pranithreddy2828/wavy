import uuid
from datetime import datetime, timezone
from sqlalchemy import (
    Column,
    String,
    Text,
    Numeric,
    Boolean,
    DateTime,
    ForeignKey,
    Integer,
    Enum as SQLEnum,
)
from sqlalchemy.orm import relationship
from app import db

def generate_uuid():
    return str(uuid.uuid4())

class Request(db.Model):
    __tablename__ = "requests"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    category_id = Column(Integer, ForeignKey("categories.id", ondelete="RESTRICT"), nullable=False, index=True)
    title = Column(String(150), nullable=False)
    description = Column(Text, nullable=False)
    urgency = Column(
        SQLEnum("low", "medium", "urgent", name="request_urgency_enum"),
        default="medium",
        nullable=False,
    )
    budget = Column(Numeric(10, 2), nullable=True)
    is_negotiable = Column(Boolean, default=True, nullable=False)
    fulfillment_type = Column(
        SQLEnum("pickup", "delivery", "on_premise", "remote", name="fulfillment_type_enum"),
        default="on_premise",
        nullable=False,
    )
    status = Column(
        SQLEnum(
            "draft",
            "published",
            "receiving_offers",
            "negotiating",
            "accepted",
            "in_progress",
            "completed",
            "cancelled",
            "expired",
            "disputed",
            name="request_status_enum",
        ),
        default="published",
        nullable=False,
        index=True,
    )
    visibility_radius_km = Column(Integer, default=5, nullable=False)
    required_completion_time = Column(DateTime, nullable=True)
    expires_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False, index=True)
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Relationships
    user = relationship("User", foreign_keys=[user_id])
    category = relationship("Category", back_populates="requests")
    location = relationship("RequestLocation", back_populates="request", uselist=False, cascade="all, delete-orphan")
    attachments = relationship("RequestAttachment", back_populates="request", cascade="all, delete-orphan")
    offers = relationship("Offer", back_populates="request", cascade="all, delete-orphan")

    def to_dict(self, include_exact_location=False):
        data = {
            "id": self.id,
            "user_id": self.user_id,
            "category_id": self.category_id,
            "category_slug": self.category.slug if self.category else "general",
            "category_name": self.category.name if self.category else "General Help",
            "category_icon": self.category.icon_name if self.category else "tag",
            "title": self.title,
            "description": self.description,
            "urgency": self.urgency,
            "budget": float(self.budget) if self.budget is not None else None,
            "is_negotiable": self.is_negotiable,
            "fulfillment_type": self.fulfillment_type,
            "status": self.status,
            "visibility_radius_km": self.visibility_radius_km,
            "offers_count": len(self.offers) if self.offers else 0,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "area_name": self.location.area_name if self.location else "Hyderabad",
            "city": self.location.city if self.location else "Hyderabad",
            "requester": {
                "id": self.user.id if self.user else None,
                "display_name": self.user.profile.display_name if self.user and self.user.profile else "Neighbour",
                "username": self.user.profile.username if self.user and self.user.profile else "neighbour",
                "avatar_url": self.user.profile.avatar_url if self.user and self.user.profile else None,
                "rating_avg": float(self.user.profile.rating_avg) if self.user and self.user.profile else 5.0,
                "reviews_count": self.user.profile.reviews_count if self.user and self.user.profile else 0,
                "is_verified": self.user.profile.is_id_verified if self.user and self.user.profile else False,
            } if self.user else None,
        }

        if self.location:
            data["location"] = {
                "area_name": self.location.area_name,
                "city": self.location.city,
                "fuzzy_latitude": float(self.location.fuzzy_latitude),
                "fuzzy_longitude": float(self.location.fuzzy_longitude),
            }
            if include_exact_location:
                data["location"]["raw_latitude"] = float(self.location.raw_latitude)
                data["location"]["raw_longitude"] = float(self.location.raw_longitude)

        return data

class RequestLocation(db.Model):
    __tablename__ = "request_locations"

    request_id = Column(String(36), ForeignKey("requests.id", ondelete="CASCADE"), primary_key=True)
    raw_latitude = Column(Numeric(10, 7), nullable=False)
    raw_longitude = Column(Numeric(10, 7), nullable=False)
    fuzzy_latitude = Column(Numeric(10, 7), nullable=False)
    fuzzy_longitude = Column(Numeric(10, 7), nullable=False)
    area_name = Column(String(150), default="Gachibowli", nullable=False)
    city = Column(String(100), default="Hyderabad", nullable=False)

    request = relationship("Request", back_populates="location")

class RequestAttachment(db.Model):
    __tablename__ = "request_attachments"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    request_id = Column(String(36), ForeignKey("requests.id", ondelete="CASCADE"), nullable=False)
    file_url = Column(String(500), nullable=False)
    file_type = Column(String(50), nullable=False)
    file_size_bytes = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    request = relationship("Request", back_populates="attachments")

