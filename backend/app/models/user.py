import uuid
from datetime import datetime, timezone, timedelta
from sqlalchemy import (
    Column,
    String,
    Boolean,
    DateTime,
    ForeignKey,
    Numeric,
    Integer,
    JSON,
    Text,
    Enum as SQLEnum,
)
from sqlalchemy.orm import relationship
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError
from app import db

ph = PasswordHasher()

def generate_uuid():
    return str(uuid.uuid4())

class User(db.Model):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=True)
    google_id = Column(String(255), unique=True, nullable=True)
    role = Column(
        SQLEnum("user", "moderator", "admin", name="user_role_enum"),
        default="user",
        nullable=False,
    )
    is_email_verified = Column(Boolean, default=False, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Relationships
    profile = relationship("UserProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    refresh_tokens = relationship("RefreshToken", back_populates="user", cascade="all, delete-orphan")

    def set_password(self, password: str):
        """Hashes password using Argon2id."""
        self.password_hash = ph.hash(password)

    def check_password(self, password: str) -> bool:
        """Verifies candidate password with stored Argon2id hash."""
        if not self.password_hash:
            return False
        try:
            return ph.verify(self.password_hash, password)
        except VerifyMismatchError:
            return False

    def to_dict(self):
        return {
            "id": self.id,
            "email": self.email,
            "role": self.role,
            "is_email_verified": self.is_email_verified,
            "is_active": self.is_active,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "profile": self.profile.to_dict() if self.profile else None,
        }

class UserProfile(db.Model):
    __tablename__ = "user_profiles"

    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    display_name = Column(String(100), nullable=False)
    username = Column(String(50), unique=True, nullable=False, index=True)
    bio = Column(Text, nullable=True)
    avatar_url = Column(String(500), nullable=True)
    city = Column(String(100), default="Hyderabad", nullable=False)
    general_locality = Column(String(150), default="Gachibowli", nullable=True)
    skills = Column(JSON, nullable=True)
    interests = Column(JSON, nullable=True)
    services_offered = Column(JSON, nullable=True)
    rating_avg = Column(Numeric(3, 2), default=5.00, nullable=False)
    reviews_count = Column(Integer, default=0, nullable=False)
    completed_activities_count = Column(Integer, default=0, nullable=False)
    is_id_verified = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    user = relationship("User", back_populates="profile")

    def to_dict(self):
        return {
            "user_id": self.user_id,
            "display_name": self.display_name,
            "username": self.username,
            "bio": self.bio,
            "avatar_url": self.avatar_url,
            "city": self.city,
            "general_locality": self.general_locality,
            "skills": self.skills or [],
            "interests": self.interests or [],
            "services_offered": self.services_offered or [],
            "rating_avg": float(self.rating_avg) if self.rating_avg else 5.0,
            "reviews_count": self.reviews_count,
            "completed_activities_count": self.completed_activities_count,
            "is_id_verified": self.is_id_verified,
        }

class RefreshToken(db.Model):
    __tablename__ = "refresh_tokens"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    token_hash = Column(String(255), unique=True, nullable=False, index=True)
    family_id = Column(String(36), nullable=False, index=True)
    is_revoked = Column(Boolean, default=False, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    user = relationship("User", back_populates="refresh_tokens")

class UserVerification(db.Model):
    __tablename__ = "user_verifications"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    verification_type = Column(
        SQLEnum("email_otp", "password_reset", "id_document", name="verification_type_enum"),
        nullable=False,
    )
    token_hash = Column(String(255), nullable=False)
    expires_at = Column(DateTime, nullable=False)
    is_used = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

