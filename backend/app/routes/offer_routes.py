from flask import Blueprint, jsonify, request, g
from app.services.offer_service import OfferService
from app.middleware.auth_guard import jwt_required, optional_jwt

offer_bp = Blueprint("offers", __name__)

@offer_bp.route("/requests/<string:request_id>/offers", methods=["POST"])
@optional_jwt
def submit_offer(request_id):
    """Helper submits an offer on a request."""
    data = request.get_json(silent=True) or {}
    proposed_price = data.get("proposed_price")
    eta = data.get("estimated_completion", "Within 2 hours")
    note = data.get("note", "")

    if proposed_price is None:
        return jsonify({"error": "VALIDATION_ERROR", "message": "proposed_price is required"}), 400

    helper_id = g.current_user.id if hasattr(g, "current_user") and g.current_user else None
    if not helper_id:
        from app.models.user import User
        demo_user = User.query.first()
        helper_id = demo_user.id if demo_user else None

    try:
        offer = OfferService.submit_offer(
            request_id=request_id,
            helper_id=helper_id,
            proposed_price=float(proposed_price),
            estimated_completion=eta,
            note=note,
        )
        return jsonify({
            "success": True,
            "message": "Offer submitted successfully.",
            "offer": offer.to_dict(),
        }), 201
    except ValueError as err:
        return jsonify({"error": "OFFER_ERROR", "message": str(err)}), 400

@offer_bp.route("/requests/<string:request_id>/offers", methods=["GET"])
def get_offers(request_id):
    """List all offers submitted for a request."""
    offers = OfferService.get_offers_for_request(request_id)
    return jsonify({
        "success": True,
        "count": len(offers),
        "offers": offers,
    }), 200

@offer_bp.route("/offers/<string:offer_id>/accept", methods=["POST"])
@optional_jwt
def accept_offer(offer_id):
    """Requester accepts an offer, locking other offers and starting active assist."""
    requester_id = g.current_user.id if hasattr(g, "current_user") and g.current_user else None
    if not requester_id:
        from app.models.offer import Offer
        off = Offer.query.filter_by(id=offer_id).first()
        requester_id = off.request.user_id if off and off.request else None

    try:
        activity = OfferService.accept_offer(offer_id=offer_id, requester_id=requester_id)
        return jsonify({
            "success": True,
            "message": "Offer accepted! Active engagement initiated.",
            "activity": activity.to_dict(),
        }), 200
    except ValueError as err:
        return jsonify({"error": "ACCEPT_ERROR", "message": str(err)}), 400

@offer_bp.route("/offers/<string:offer_id>/counter", methods=["POST"])
@optional_jwt
def counter_offer(offer_id):
    """Submit a counter-offer price proposal."""
    data = request.get_json(silent=True) or {}
    price = data.get("proposed_price")
    msg = data.get("message", "")

    if price is None:
        return jsonify({"error": "VALIDATION_ERROR", "message": "proposed_price is required"}), 400

    proposer_id = g.current_user.id if hasattr(g, "current_user") and g.current_user else None
    if not proposer_id:
        from app.models.user import User
        demo_user = User.query.first()
        proposer_id = demo_user.id if demo_user else None

    try:
        neg = OfferService.counter_offer(
            offer_id=offer_id,
            proposer_id=proposer_id,
            proposed_price=float(price),
            message=msg,
        )
        return jsonify({
            "success": True,
            "message": "Counter-offer sent.",
            "negotiation": neg.to_dict(),
        }), 200
    except ValueError as err:
        return jsonify({"error": "COUNTER_ERROR", "message": str(err)}), 400

@offer_bp.route("/activities/<string:activity_id>/complete", methods=["POST"])
@optional_jwt
def complete_activity(activity_id):
    """Mark assist activity completed."""
    user_id = g.current_user.id if hasattr(g, "current_user") and g.current_user else None
    if not user_id:
        from app.models.offer import Activity
        act = Activity.query.filter_by(id=activity_id).first()
        user_id = act.requester_id if act else None

    try:
        act = OfferService.complete_activity(activity_id=activity_id, user_id=user_id)
        return jsonify({
            "success": True,
            "message": "Assistance marked completed.",
            "activity": act.to_dict(),
        }), 200
    except ValueError as err:
        return jsonify({"error": "COMPLETE_ERROR", "message": str(err)}), 400

