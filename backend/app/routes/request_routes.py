from flask import Blueprint, jsonify, request, g
from app.services.request_service import RequestService
from app.middleware.auth_guard import jwt_required, optional_jwt

request_bp = Blueprint("requests", __name__, url_prefix="/requests")

@request_bp.route("", methods=["POST"])
@optional_jwt
def create_request():
    """Create a new community assistance request."""
    data = request.get_json(silent=True) or {}
    title = data.get("title")
    description = data.get("description", "")
    category_id = data.get("category_id", 1)
    urgency = data.get("urgency", "urgent")
    budget = data.get("budget", 200.0)
    area_name = data.get("area_name", "Gachibowli")
    city = data.get("city", "Hyderabad")
    visibility_radius_km = data.get("visibility_radius_km", 5)

    if not title:
        return jsonify({"error": "VALIDATION_ERROR", "message": "title is required"}), 400

    # If guest (not logged in), associate with demo user
    user_id = g.current_user.id if hasattr(g, "current_user") and g.current_user else None
    if not user_id:
        from app.models.user import User
        demo_user = User.query.first()
        user_id = demo_user.id if demo_user else None

    if not user_id:
        RequestService.seed_initial_demo_data_if_empty()
        from app.models.user import User
        user_id = User.query.first().id

    new_req = RequestService.create_request(
        user_id=user_id,
        category_id=int(category_id),
        title=title,
        description=description,
        urgency=urgency,
        budget=float(budget) if budget is not None else None,
        visibility_radius_km=int(visibility_radius_km),
        area_name=area_name,
        city=city,
    )

    return jsonify({
        "success": True,
        "message": "Broadcast sent to nearby neighbours.",
        "request": new_req.to_dict(),
    }), 201

@request_bp.route("/feed", methods=["GET"])
def get_feed():
    """Retrieve filtered requests with dynamic Haversine distance calculations."""
    max_dist = float(request.args.get("max_distance", 20.0))
    cat_slug = request.args.get("category")
    urgency = request.args.get("urgency")
    search = request.args.get("q")
    lat = float(request.args.get("lat", 17.4401))
    lon = float(request.args.get("lon", 78.3489))

    requests_list = RequestService.get_feed(
        current_lat=lat,
        current_lon=lon,
        max_distance_km=max_dist,
        category_slug=cat_slug,
        urgency=urgency,
        search_query=search,
    )

    return jsonify({
        "success": True,
        "city": "Hyderabad",
        "count": len(requests_list),
        "requests": requests_list,
    }), 200

@request_bp.route("/<string:request_id>", methods=["GET"])
def get_request_detail(request_id):
    """Retrieve single request specifications with privacy-masked location."""
    req = RequestService.get_request_by_id(request_id)
    if not req:
        return jsonify({"error": "NOT_FOUND", "message": "Request not found"}), 404

    return jsonify({
        "success": True,
        "request": req.to_dict(),
    }), 200
