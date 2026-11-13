from flask import Blueprint
from app.routes.health_routes import health_bp
from app.routes.category_routes import category_bp
from app.routes.request_routes import request_bp
from app.routes.auth_routes import auth_bp
from app.routes.offer_routes import offer_bp
from app.routes.chat_routes import chat_bp
from app.routes.safety_routes import safety_bp
from app.routes.admin_routes import admin_bp

# Versioned API Blueprint (/api/v1)
api_v1 = Blueprint("api_v1", __name__, url_prefix="/api/v1")

# Register all feature route groups
api_v1.register_blueprint(health_bp)
api_v1.register_blueprint(category_bp)
api_v1.register_blueprint(request_bp)
api_v1.register_blueprint(auth_bp)
api_v1.register_blueprint(offer_bp)
api_v1.register_blueprint(chat_bp)
api_v1.register_blueprint(safety_bp)
api_v1.register_blueprint(admin_bp)
