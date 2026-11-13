from functools import wraps
from flask import request, jsonify, g
from app import db
from app.services.auth_service import AuthService
from app.models.user import User

def jwt_required(f):
    """
    Middleware decorator that validates Bearer JWT access tokens on protected endpoints.
    Attaches the active user model to Flask's `g.current_user`.
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get("Authorization", None)
        if not auth_header or not auth_header.startswith("Bearer "):
            return jsonify({
                "error": "UNAUTHORIZED",
                "message": "Missing or malformed Authorization header with Bearer token."
            }), 401

        token = auth_header.split(" ")[1]
        try:
            payload = AuthService.verify_access_token(token)
        except ValueError as err:
            err_code = str(err)
            if err_code == "TOKEN_EXPIRED":
                return jsonify({
                    "error": "TOKEN_EXPIRED",
                    "message": "Access token has expired. Please refresh session."
                }), 401
            return jsonify({
                "error": "INVALID_TOKEN",
                "message": "Access token is invalid or corrupted."
            }), 401

        user_id = payload.get("sub")
        user = db.session.get(User, user_id)
        if not user or not user.is_active:
            return jsonify({
                "error": "ACCOUNT_DISABLED",
                "message": "User account is suspended, deleted, or inactive."
            }), 403

        g.current_user = user
        return f(*args, **kwargs)

    return decorated_function

def optional_jwt(f):
    """
    Middleware decorator that extracts JWT if present, but allows anonymous guest requests if absent.
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        g.current_user = None
        auth_header = request.headers.get("Authorization", None)
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
            try:
                payload = AuthService.verify_access_token(token)
                user_id = payload.get("sub")
                user = db.session.get(User, user_id)
                if user and user.is_active:
                    g.current_user = user
            except Exception:
                g.current_user = None
        return f(*args, **kwargs)

    return decorated_function

def role_required(*allowed_roles):
    """Restricts access to specific user roles (e.g. 'admin', 'moderator')."""
    def decorator(f):
        @wraps(f)
        @jwt_required
        def decorated_function(*args, **kwargs):
            if g.current_user.role not in allowed_roles:
                return jsonify({
                    "error": "FORBIDDEN",
                    "message": "You do not have permission to access this resource."
                }), 403
            return f(*args, **kwargs)

        return decorated_function
    return decorator
