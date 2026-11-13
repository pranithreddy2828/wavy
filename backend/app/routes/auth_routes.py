from flask import Blueprint, request, jsonify, g
from app.services.auth_service import AuthService
from app.middleware.auth_guard import jwt_required

auth_bp = Blueprint("auth", __name__, url_prefix="/auth")

@auth_bp.route("/register", methods=["POST"])
def register():
    """Register a new user account with email, password, and profile."""
    data = request.get_json(silent=True) or {}
    email = data.get("email")
    password = data.get("password")
    display_name = data.get("display_name")
    username = data.get("username")
    city = data.get("city", "Hyderabad")

    if not email or not password or not display_name or not username:
        return jsonify({
            "error": "VALIDATION_ERROR",
            "message": "email, password, display_name, and username are required."
        }), 400

    if len(password) < 8:
        return jsonify({
            "error": "WEAK_PASSWORD",
            "message": "Password must be at least 8 characters long."
        }), 400

    try:
        result = AuthService.register_user(
            email=email,
            password=password,
            display_name=display_name,
            username=username,
            city=city,
        )
        return jsonify({
            "success": True,
            "message": "Registration successful.",
            "data": result,
        }), 201
    except ValueError as err:
        err_msg = str(err)
        if err_msg == "EMAIL_ALREADY_EXISTS":
            return jsonify({"error": "EMAIL_TAKEN", "message": "Email is already registered."}), 409
        if err_msg == "USERNAME_ALREADY_EXISTS":
            return jsonify({"error": "USERNAME_TAKEN", "message": "Username is already taken."}), 409
        return jsonify({"error": "REGISTRATION_FAILED", "message": err_msg}), 400

@auth_bp.route("/login", methods=["POST"])
def login():
    """Authenticate user with email and Argon2id password."""
    data = request.get_json(silent=True) or {}
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({
            "error": "VALIDATION_ERROR",
            "message": "email and password are required."
        }), 400

    try:
        result = AuthService.login_user(email=email, password=password)
        return jsonify({
            "success": True,
            "message": "Login successful.",
            "data": result,
        }), 200
    except ValueError as err:
        err_msg = str(err)
        if err_msg == "INVALID_CREDENTIALS":
            return jsonify({"error": "INVALID_CREDENTIALS", "message": "Incorrect email or password."}), 401
        if err_msg == "ACCOUNT_SUSPENDED":
            return jsonify({"error": "ACCOUNT_SUSPENDED", "message": "Account has been suspended."}), 403
        return jsonify({"error": "LOGIN_FAILED", "message": err_msg}), 400

@auth_bp.route("/google", methods=["POST"])
def google_auth():
    """Server-side Google ID Token authentication."""
    data = request.get_json(silent=True) or {}
    id_token = data.get("id_token")

    if not id_token:
        return jsonify({
            "error": "VALIDATION_ERROR",
            "message": "Google id_token is required."
        }), 400

    try:
        result = AuthService.verify_google_identity(id_token=id_token)
        return jsonify({
            "success": True,
            "message": "Google authentication successful.",
            "data": result,
        }), 200
    except ValueError as err:
        return jsonify({"error": "GOOGLE_AUTH_FAILED", "message": str(err)}), 401

@auth_bp.route("/refresh", methods=["POST"])
def refresh():
    """Rotate single-use refresh token and issue new token pair."""
    data = request.get_json(silent=True) or {}
    refresh_token = data.get("refresh_token")

    if not refresh_token:
        return jsonify({
            "error": "VALIDATION_ERROR",
            "message": "refresh_token is required."
        }), 400

    try:
        result = AuthService.rotate_refresh_token(refresh_token)
        return jsonify({
            "success": True,
            "message": "Token refreshed successfully.",
            "data": result,
        }), 200
    except ValueError as err:
        err_msg = str(err)
        if err_msg == "TOKEN_REUSE_DETECTED_FAMILY_REVOKED":
            return jsonify({
                "error": "BREACH_CONTAINMENT",
                "message": "Token reuse detected. All sessions in this family have been revoked."
            }), 401
        return jsonify({"error": "REFRESH_FAILED", "message": err_msg}), 401

@auth_bp.route("/logout", methods=["POST"])
@jwt_required
def logout():
    """Revoke all active refresh sessions for the current user."""
    AuthService.revoke_all_user_tokens(g.current_user.id)
    return jsonify({
        "success": True,
        "message": "Logged out successfully from all active sessions."
    }), 200

@auth_bp.route("/me", methods=["GET"])
@jwt_required
def get_current_user():
    """Retrieve authenticated user's profile and credentials."""
    return jsonify({
        "success": True,
        "user": g.current_user.to_dict()
    }), 200

@auth_bp.route("/account", methods=["DELETE"])
@jwt_required
def delete_account():
    """DPDP Act Right to Erasure: Permanently delete account and all user data."""
    user_id = g.current_user.id
    AuthService.delete_account(user_id)
    return jsonify({
        "success": True,
        "message": "Your account and all associated personal data have been permanently deleted."
    }), 200

