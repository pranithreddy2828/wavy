from flask import Blueprint, jsonify, request
from app import db
from app.models.user import User
from app.models.request import Request
from app.models.offer import Activity
from app.models.safety import Report

admin_bp = Blueprint("admin", __name__, url_prefix="/admin")

@admin_bp.route("/stats", methods=["GET"])
def get_stats():
    """Retrieve platform KPI analytics."""
    total_users = User.query.count()
    active_requests = Request.query.filter_by(status="published").count()
    completed_assists = Activity.query.filter_by(status="completed").count()
    pending_reports = Report.query.filter_by(status="pending").count()

    # Sum total rupees transacted
    completed = Activity.query.filter_by(status="completed").all()
    total_rupees = sum(float(a.agreed_price) for a in completed)

    return jsonify({
        "success": True,
        "analytics": {
            "total_users": total_users,
            "active_requests": active_requests,
            "completed_assists": completed_assists,
            "total_rupees_transacted": total_rupees,
            "pending_reports_count": pending_reports,
            "currency": "INR",
        }
    }), 200

@admin_bp.route("/reports", methods=["GET"])
def list_reports():
    """List pending moderation reports."""
    reports = Report.query.filter_by(status="pending").order_by(Report.created_at.desc()).all()
    return jsonify({
        "success": True,
        "count": len(reports),
        "reports": [r.to_dict() for r in reports],
    }), 200

@admin_bp.route("/reports/<string:report_id>/resolve", methods=["POST"])
def resolve_report(report_id):
    """Action a moderation report."""
    data = request.get_json(silent=True) or {}
    action = data.get("action", "dismiss")  # dismiss or suspend_user

    report = Report.query.filter_by(id=report_id).first()
    if not report:
        return jsonify({"error": "NOT_FOUND", "message": "Report not found"}), 404

    if action == "suspend_user" and report.reported_user_id:
        user = User.query.filter_by(id=report.reported_user_id).first()
        if user:
            user.is_active = False

    report.status = "action_taken" if action == "suspend_user" else "dismissed"
    db.session.commit()

    return jsonify({
        "success": True,
        "message": f"Report has been marked as {report.status}.",
    }), 200

