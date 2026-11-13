import os
import uuid
import hashlib
import jwt
from datetime import datetime, timezone, timedelta
from typing import Tuple, Dict, Any, Optional
import urllib.request
import json
from app import db
from app.models.user import User, UserProfile, RefreshToken

SECRET_KEY = os.getenv("JWT_SECRET_KEY", "fallback-jwt-secret-wavy-2026")
ACCESS_TOKEN_MINUTES = int(os.getenv("JWT_ACCESS_EXPIRES_MINUTES", "15"))
REFRESH_TOKEN_DAYS = int(os.getenv("JWT_REFRESH_EXPIRES_DAYS", "30"))

def _hash_token(raw_token: str) -> str:
    """Returns SHA-256 hash of a raw token for safe database persistence."""
    return hashlib.sha256(raw_token.encode("utf-8")).hexdigest()

class AuthService:

    @staticmethod
    def generate_access_token(user_id: str, role: str = "user") -> str:
        """Generates a short-lived (15 minutes) signed JWT access token."""
        now = datetime.now(timezone.utc)
        payload = {
            "sub": user_id,
            "role": role,
            "iat": now,
            "exp": now + timedelta(minutes=ACCESS_TOKEN_MINUTES),
        }
        return jwt.encode(payload, SECRET_KEY, algorithm="HS256")

    @staticmethod
    def generate_refresh_token(user_id: str, family_id: Optional[str] = None) -> Tuple[str, RefreshToken]:
        """Generates a single-use cryptographically secure refresh token in a family chain."""
        raw_token = f"wvy_rf_{uuid.uuid4().hex}{uuid.uuid4().hex}"
        token_hash = _hash_token(raw_token)
        now = datetime.now(timezone.utc)
        expires_at = now + timedelta(days=REFRESH_TOKEN_DAYS)

        if not family_id:
            family_id = str(uuid.uuid4())

        refresh_record = RefreshToken(
            id=str(uuid.uuid4()),
            user_id=user_id,
            token_hash=token_hash,
            family_id=family_id,
            is_revoked=False,
            expires_at=expires_at,
            created_at=now,
        )
        db.session.add(refresh_record)
        return raw_token, refresh_record

    @staticmethod
    def verify_access_token(token: str) -> Dict[str, Any]:
        """Decodes and validates a JWT access token."""
        try:
            return jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            raise ValueError("TOKEN_EXPIRED")
        except jwt.InvalidTokenError:
            raise ValueError("TOKEN_INVALID")

    @staticmethod
    def rotate_refresh_token(raw_token: str) -> Dict[str, Any]:
        """
        Rotates refresh token. Implements Refresh Token Family Rotation:
        If an already revoked token is used, revokes ALL tokens in that family (breach detection).
        """
        token_hash = _hash_token(raw_token)
        token_record = RefreshToken.query.filter_by(token_hash=token_hash).first()

        if not token_record:
            raise ValueError("INVALID_REFRESH_TOKEN")

        # Reuse of revoked token -> Potential compromise of client storage!
        if token_record.is_revoked:
            # Revoke all tokens in this family immediately
            RefreshToken.query.filter_by(family_id=token_record.family_id).update({"is_revoked": True})
            db.session.commit()
            raise ValueError("TOKEN_REUSE_DETECTED_FAMILY_REVOKED")

        # Check expiration
        now = datetime.now(timezone.utc)
        if token_record.expires_at.replace(tzinfo=timezone.utc) < now:
            token_record.is_revoked = True
            db.session.commit()
            raise ValueError("REFRESH_TOKEN_EXPIRED")

        # Invalidate current token
        token_record.is_revoked = True

        # Fetch user
        user = db.session.get(User, token_record.user_id)
        if not user or not user.is_active:
            raise ValueError("USER_INACTIVE")

        # Issue new token pair preserving the family ID
        new_access_token = AuthService.generate_access_token(user.id, user.role)
        new_raw_refresh, _ = AuthService.generate_refresh_token(user.id, family_id=token_record.family_id)
        db.session.commit()

        return {
            "access_token": new_access_token,
            "refresh_token": new_raw_refresh,
            "expires_in": ACCESS_TOKEN_MINUTES * 60,
        }

    @staticmethod
    def register_user(
        email: str,
        password: str,
        display_name: str,
        username: str,
        city: str = "Hyderabad",
    ) -> Dict[str, Any]:
        """Registers a new user with Argon2id password hash and default profile."""
        email = email.strip().lower()
        username = username.strip().lower().replace("@", "")

        if User.query.filter_by(email=email).first():
            raise ValueError("EMAIL_ALREADY_EXISTS")

        if UserProfile.query.filter_by(username=username).first():
            raise ValueError("USERNAME_ALREADY_EXISTS")

        user = User(
            id=str(uuid.uuid4()),
            email=email,
            role="user",
            is_email_verified=False,
            is_active=True,
        )
        user.set_password(password)
        db.session.add(user)

        profile = UserProfile(
            user_id=user.id,
            display_name=display_name.strip(),
            username=username,
            city=city,
            general_locality="Gachibowli",
            rating_avg=5.00,
            reviews_count=0,
            completed_activities_count=0,
            is_id_verified=False,
        )
        db.session.add(profile)

        access_token = AuthService.generate_access_token(user.id, user.role)
        raw_refresh, _ = AuthService.generate_refresh_token(user.id)

        db.session.commit()

        return {
            "user": user.to_dict(),
            "access_token": access_token,
            "refresh_token": raw_refresh,
            "expires_in": ACCESS_TOKEN_MINUTES * 60,
        }

    @staticmethod
    def login_user(email: str, password: str) -> Dict[str, Any]:
        """Authenticates user via email and Argon2id password."""
        email = email.strip().lower()
        user = User.query.filter_by(email=email).first()

        if not user or not user.check_password(password):
            raise ValueError("INVALID_CREDENTIALS")

        if not user.is_active:
            raise ValueError("ACCOUNT_SUSPENDED")

        access_token = AuthService.generate_access_token(user.id, user.role)
        raw_refresh, _ = AuthService.generate_refresh_token(user.id)
        db.session.commit()

        return {
            "user": user.to_dict(),
            "access_token": access_token,
            "refresh_token": raw_refresh,
            "expires_in": ACCESS_TOKEN_MINUTES * 60,
        }

    @staticmethod
    def verify_google_identity(id_token: str) -> Dict[str, Any]:
        """
        Validates Google ID Token server-side via Google's tokeninfo service.
        Prevents client-side identity spoofing.
        """
        try:
            url = f"https://oauth2.googleapis.com/tokeninfo?id_token={id_token}"
            req = urllib.request.Request(url, headers={"User-Agent": "WAVY-Backend-Service"})
            with urllib.request.urlopen(req, timeout=5) as response:
                if response.status != 200:
                    raise ValueError("INVALID_GOOGLE_TOKEN")
                data = json.loads(response.read().decode("utf-8"))
        except Exception:
            raise ValueError("GOOGLE_VERIFICATION_FAILED")

        google_id = data.get("sub")
        email = data.get("email", "").lower()
        display_name = data.get("name", "Wavy User")
        avatar_url = data.get("picture")

        if not google_id or not email:
            raise ValueError("INVALID_GOOGLE_PAYLOAD")

        # Check existing user
        user = User.query.filter((User.google_id == google_id) | (User.email == email)).first()

        if not user:
            # Register user automatically
            user = User(
                id=str(uuid.uuid4()),
                email=email,
                google_id=google_id,
                role="user",
                is_email_verified=True,
                is_active=True,
            )
            db.session.add(user)

            base_username = email.split("@")[0].lower()
            username = base_username
            suffix = 1
            while UserProfile.query.filter_by(username=username).first():
                username = f"{base_username}{suffix}"
                suffix += 1

            profile = UserProfile(
                user_id=user.id,
                display_name=display_name,
                username=username,
                avatar_url=avatar_url,
                city="Hyderabad",
                general_locality="Gachibowli",
                is_id_verified=False,
            )
            db.session.add(profile)
        else:
            if not user.google_id:
                user.google_id = google_id
            user.is_email_verified = True

        access_token = AuthService.generate_access_token(user.id, user.role)
        raw_refresh, _ = AuthService.generate_refresh_token(user.id)
        db.session.commit()

        return {
            "user": user.to_dict(),
            "access_token": access_token,
            "refresh_token": raw_refresh,
            "expires_in": ACCESS_TOKEN_MINUTES * 60,
        }

    @staticmethod
    def revoke_all_user_tokens(user_id: str) -> None:
        """Revokes all active refresh token families for user (logout all devices)."""
        RefreshToken.query.filter_by(user_id=user_id).update({"is_revoked": True})
        db.session.commit()

    @staticmethod
    def delete_account(user_id: str) -> None:
        """DPDP Act Right to Erasure: Permanently removes user account and cascades."""
        user = db.session.get(User, user_id)
        if not user:
            raise ValueError("USER_NOT_FOUND")

        db.session.delete(user)
        db.session.commit()
