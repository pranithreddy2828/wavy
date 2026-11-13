from flask import Blueprint, jsonify

category_bp = Blueprint("categories", __name__, url_prefix="/categories")

# Initial canonical category definitions
CANONICAL_CATEGORIES = [
    {"id": 1, "slug": "printing", "name": "Printing", "description": "Urgent documents, Xerox, binding & scanning", "icon_name": "printer", "display_order": 1},
    {"id": 2, "slug": "transportation", "name": "Transportation", "description": "Shared travel coordination & rideshare coordination", "icon_name": "car", "display_order": 2},
    {"id": 3, "slug": "education", "name": "Education", "description": "Academic assistance, notes & study groups", "icon_name": "book-open", "display_order": 3},
    {"id": 4, "slug": "tutoring", "name": "Tutoring", "description": "Subject tutoring, Python coding & languages", "icon_name": "graduation-cap", "display_order": 4},
    {"id": 5, "slug": "laptop-repair", "name": "Laptop Repair", "description": "Hardware diagnostics, SSD upgrades & OS reinstall", "icon_name": "laptop", "display_order": 5},
    {"id": 6, "slug": "mobile-repair", "name": "Mobile Repair", "description": "Screen replacement, battery issues & diagnostics", "icon_name": "smartphone", "display_order": 6},
    {"id": 7, "slug": "home-repairs", "name": "Home Repairs", "description": "Plumbing, electrical & appliance handyman help", "icon_name": "wrench", "display_order": 7},
    {"id": 8, "slug": "shopping-assistance", "name": "Shopping Assistance", "description": "Local market shopping & emergency groceries", "icon_name": "shopping-bag", "display_order": 8},
    {"id": 9, "slug": "parcel-assistance", "name": "Parcel Assistance", "description": "Document pickup & drop coordination", "icon_name": "package", "display_order": 9},
    {"id": 10, "slug": "delivery-coordination", "name": "Delivery Coordination", "description": "Peer-to-peer package logistics", "icon_name": "truck", "display_order": 10},
    {"id": 11, "slug": "personal-assistance", "name": "Personal Assistance", "description": "Queue standing, errands & event tasks", "icon_name": "user-check", "display_order": 11},
    {"id": 12, "slug": "professional-services", "name": "Professional Services", "description": "Design, translation & notary navigation", "icon_name": "briefcase", "display_order": 12},
    {"id": 13, "slug": "community-assistance", "name": "Community Assistance", "description": "Neighbourhood civic help & volunteering", "icon_name": "users", "display_order": 13},
    {"id": 14, "slug": "other", "name": "Other", "description": "General lawful assistance & peer requests", "icon_name": "help-circle", "display_order": 14},
]

@category_bp.route("", methods=["GET"])
def get_categories():
    """Fetch all active WAVY request categories."""
    return jsonify({
        "success": True,
        "categories": CANONICAL_CATEGORIES,
        "total": len(CANONICAL_CATEGORIES)
    }), 200

