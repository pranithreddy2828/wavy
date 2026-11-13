import os
from flask import Blueprint, jsonify
from sqlalchemy import text
from app import db

health_bp = Blueprint("health", __name__)

@health_bp.route("/health", methods=["GET"])
def health_check():
    """System health check and diagnostic connectivity endpoint."""
    db_status = "disconnected"
    db_error = None

    try:
        # Ping the database with a lightweight query
        db.session.execute(text("SELECT 1"))
        db_status = "connected"
    except Exception as exc:
        db_error = str(exc)

    return jsonify({
        "status": "healthy" if db_status == "connected" else "degraded",
        "service": "WAVY API Core",
        "version": "1.0.0-milestone1",
        "city": os.getenv("DEFAULT_CITY", "Hyderabad"),
        "database": {
            "status": db_status,
            "error": db_error
        }
    }), 200 if db_status == "connected" else 200
