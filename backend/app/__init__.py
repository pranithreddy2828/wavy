import os
from flask import Flask, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_socketio import SocketIO
from app.config import config_by_name

# Initialize extensions
db = SQLAlchemy()
socketio = SocketIO(cors_allowed_origins="*")

def create_app(config_name=None):
    """Application factory for WAVY Flask REST & Socket.IO backend."""
    if config_name is None:
        config_name = os.getenv("FLASK_ENV", "development")

    server = Flask(__name__)
    server.config.from_object(config_by_name.get(config_name, config_by_name["development"]))

    # Initialize extensions with app context
    CORS(server, resources={r"/api/*": {"origins": server.config["CORS_ORIGINS"]}})
    db.init_app(server)
    socketio.init_app(server)

    with server.app_context():
        import app.models  # noqa: F401
        db.create_all()
        try:
            from app.services.request_service import RequestService
            RequestService.seed_initial_demo_data_if_empty()
        except Exception:
            pass

    # Register blueprints
    from app.routes import api_v1
    server.register_blueprint(api_v1)

    # Global 404 handler
    @server.errorhandler(404)
    def resource_not_found(e):
        return jsonify({
            "error": "RESOURCE_NOT_FOUND",
            "message": "The requested endpoint or resource was not found."
        }), 404

    # Global 500 handler
    @server.errorhandler(500)
    def internal_server_error(e):
        return jsonify({
            "error": "INTERNAL_SERVER_ERROR",
            "message": "An unexpected server error occurred."
        }), 500

    return server
