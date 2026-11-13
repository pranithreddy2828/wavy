from flask import Blueprint, jsonify, request, g
from app.services.safety_service import SafetyService
from app.middleware.auth_guard import jwt_required, optional_jwt

safety_bp = Blueprint("safety", __name__)

@safety_bp.route("/activities/<string:activity_id>/review", methods=["POST"])
@optional_jwt
def submit_review(activity_id):
    """Submit mutual review and star rating after assist completion."""
    data = request.get_json(silent=True) or {}
    rating = data.get("rating")
    comment = data.get("comment", "")

    if rating is None:
        return jsonify({"error": "VALIDATION_ERROR", "message": "rating is required"}), 400

    reviewer_id = g.current_user.id if hasattr(g, "current_user") and g.current_user else None
    if not reviewer_id:
        from app.models.offer import Activity
        act = Activity.query.filter_by(id=activity_id).first()
        reviewer_id = act.requester_id if act else None

    try:
        rev = SafetyService.submit_review(
            activity_id=activity_id,
            reviewer_id=reviewer_id,
            rating=int(rating),
            comment=comment,
        )
        return jsonify({
            "success": True,
            "message": "Review submitted. User reputation updated.",
            "review": rev.to_dict(),
        }), 201
    except ValueError as err:
        return jsonify({"error": "REVIEW_ERROR", "message": str(err)}), 400

@safety_bp.route("/users/<string:user_id>/report", methods=["POST"])
@optional_jwt
def report_user(user_id):
    """Report user or content for moderation."""
    data = request.get_json(silent=True) or {}
    reason = data.get("reason", "other")
    details = data.get("details", "")
    request_id = data.get("request_id")

    reporter_id = g.current_user.id if hasattr(g, "current_user") and g.current_user else None
    if not reporter_id:
        from app.models.user import User
        demo_user = User.query.first()
        reporter_id = demo_user.id if demo_user else None

    rep = SafetyService.report_user(
        reporter_id=reporter_id,
        reported_user_id=user_id,
        reported_request_id=request_id,
        reason=reason,
        details=details,
    )
    return jsonify({
        "success": True,
        "message": "Report submitted for moderator review.",
        "report": rep.to_dict(),
    }), 201

@safety_bp.route("/users/<string:user_id>/block", methods=["POST"])
@optional_jwt
def block_user(user_id):
    """Block user interactions."""
    blocker_id = g.current_user.id if hasattr(g, "current_user") and g.current_user else None
    if not blocker_id:
        from app.models.user import User
        demo_user = User.query.first()
        blocker_id = demo_user.id if demo_user else None

    try:
        SafetyService.block_user(blocker_id=blocker_id, blocked_id=user_id)
        return jsonify({
            "success": True,
            "message": "User has been blocked.",
        }), 200
    except ValueError as err:
        return jsonify({"error": "BLOCK_ERROR", "message": str(err)}), 400

@safety_bp.route("/dpdp/export", methods=["GET"])
@optional_jwt
def export_data():
    """DPDP Act 2023 Right to Access Data Export."""
    user_id = g.current_user.id if hasattr(g, "current_user") and g.current_user else None
    if not user_id:
        from app.models.user import User
        demo_user = User.query.first()
        user_id = demo_user.id if demo_user else None

    if not user_id:
        return jsonify({"error": "UNAUTHORIZED", "message": "Sign in required for data export"}), 401

    try:
        data = SafetyService.export_dpdp_user_data(user_id=user_id)
        return jsonify({
            "success": True,
            "data": data,
        }), 200
    except ValueError as err:
        return jsonify({"error": "EXPORT_ERROR", "message": str(err)}), 400

