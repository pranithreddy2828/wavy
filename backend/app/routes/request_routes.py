from flask import Blueprint, jsonify, request
from datetime import datetime, timezone

request_bp = Blueprint("requests", __name__, url_prefix="/requests")

# Initial realistic Hyderabad seed requests for UI/UX exploration
INITIAL_HYDERABAD_REQUESTS = [
    {
        "id": "req-001",
        "title": "Need 25 Pages Color Printing Urgently",
        "description": "Final semester thesis printout needed near DLF Cybercity by 5 PM today. Double-sided 100gsm paper preferred.",
        "category_slug": "printing",
        "category_name": "Printing",
        "category_icon": "printer",
        "urgency": "urgent",
        "budget": 200.00,
        "is_negotiable": True,
        "fulfillment_type": "pickup",
        "area_name": "Gachibowli, Hyderabad",
        "distance_km": 1.2,
        "requester": {
            "display_name": "Rahul Verma",
            "rating_avg": 4.9,
            "reviews_count": 14,
            "is_verified": True
        },
        "offers_count": 3,
        "created_at": "2026-11-13T12:30:00Z"
    },
    {
        "id": "req-002",
        "title": "Travel Coordination: Gachibowli to Uppal",
        "description": "Looking for carpool/shared travel companionship towards Uppal Metro station this evening around 6:30 PM. Contributing towards fuel.",
        "category_slug": "transportation",
        "category_name": "Transportation",
        "category_icon": "car",
        "urgency": "medium",
        "budget": 250.00,
        "is_negotiable": False,
        "fulfillment_type": "on_premise",
        "area_name": "HITEC City, Hyderabad",
        "distance_km": 2.8,
        "requester": {
            "display_name": "Priya Sharma",
            "rating_avg": 5.0,
            "reviews_count": 22,
            "is_verified": True
        },
        "offers_count": 1,
        "created_at": "2026-11-13T13:10:00Z"
    },
    {
        "id": "req-003",
        "title": "1-on-1 Python Debugging & Asyncio Help",
        "description": "Need an experienced developer to help troubleshoot an async task queue worker deadlock. Can meet at Starbucks Jubilee Hills or Google Meet.",
        "category_slug": "tutoring",
        "category_name": "Tutoring",
        "category_icon": "graduation-cap",
        "urgency": "medium",
        "budget": 800.00,
        "is_negotiable": True,
        "fulfillment_type": "remote",
        "area_name": "Jubilee Hills, Hyderabad",
        "distance_km": 4.5,
        "requester": {
            "display_name": "Ananya Reddy",
            "rating_avg": 4.8,
            "reviews_count": 8,
            "is_verified": True
        },
        "offers_count": 4,
        "created_at": "2026-11-13T11:00:00Z"
    },
    {
        "id": "req-004",
        "title": "MacBook Air M2 Screen Flickering Diagnosis",
        "description": "Display flickers when opening lid past 90 degrees. Looking for a certified technician to inspect ribbon cable before taking it to authorized service.",
        "category_slug": "laptop-repair",
        "category_name": "Laptop Repair",
        "category_icon": "laptop",
        "urgency": "low",
        "budget": 500.00,
        "is_negotiable": True,
        "fulfillment_type": "on_premise",
        "area_name": "Madhapur, Hyderabad",
        "distance_km": 3.1,
        "requester": {
            "display_name": "Karthik Nair",
            "rating_avg": 4.95,
            "reviews_count": 31,
            "is_verified": True
        },
        "offers_count": 2,
        "created_at": "2026-11-13T09:45:00Z"
    },
    {
        "id": "req-005",
        "title": "Urgent Medicine Pickup from Apollo Pharmacy",
        "description": "Need prescription medicines picked up from Apollo Jubilee Hills and delivered to Banjara Hills Road No. 12. Elder care assistance.",
        "category_slug": "shopping-assistance",
        "category_name": "Shopping Assistance",
        "category_icon": "shopping-bag",
        "urgency": "urgent",
        "budget": 150.00,
        "is_negotiable": True,
        "fulfillment_type": "delivery",
        "area_name": "Banjara Hills, Hyderabad",
        "distance_km": 5.0,
        "requester": {
            "display_name": "Suresh Babu",
            "rating_avg": 5.0,
            "reviews_count": 5,
            "is_verified": True
        },
        "offers_count": 5,
        "created_at": "2026-11-13T13:40:00Z"
    }
]

@request_bp.route("/feed", methods=["GET"])
def get_feed():
    """Fetch nearby requests with optional category, urgency, and distance filtering."""
    category = request.args.get("category")
    urgency = request.args.get("urgency")
    max_distance = request.args.get("max_distance", type=float)

    filtered = INITIAL_HYDERABAD_REQUESTS

    if category and category != "all":
        filtered = [r for r in filtered if r["category_slug"] == category]

    if urgency and urgency != "all":
        filtered = [r for r in filtered if r["urgency"] == urgency]

    if max_distance:
        filtered = [r for r in filtered if r["distance_km"] <= max_distance]

    return jsonify({
        "success": True,
        "requests": filtered,
        "total": len(filtered),
        "city": "Hyderabad",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }), 200

