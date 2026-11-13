from datetime import datetime, timezone
from sqlalchemy import or_
from app import db
from app.models.request import Request, RequestLocation
from app.models.category import Category
from app.models.user import User, UserProfile
from app.services.location_service import fuzz_coordinates, haversine_distance_km

HYDERABAD_LOCALITY_COORDS = {
    "Gachibowli": (17.4401, 78.3489),
    "Hitech City": (17.4474, 78.3762),
    "Madhapur": (17.4483, 78.3915),
    "Kondapur": (17.4699, 78.3578),
    "Financial District": (17.4172, 78.3364),
    "Banjara Hills": (17.4156, 78.4352),
    "Jubilee Hills": (17.4319, 78.4073),
    "DLF Cybercity": (17.4485, 78.3615),
}

class RequestService:
    @staticmethod
    def create_request(
        user_id: str,
        category_id: int,
        title: str,
        description: str,
        urgency: str = "medium",
        budget: float = None,
        is_negotiable: bool = True,
        fulfillment_type: str = "on_premise",
        visibility_radius_km: int = 5,
        area_name: str = "Gachibowli",
        city: str = "Hyderabad",
        raw_latitude: float = None,
        raw_longitude: float = None,
    ) -> Request:
        """Creates and persists a new community request with DPDP location obfuscation."""
        # Default coordinates for locality if raw coords not supplied
        if raw_latitude is None or raw_longitude is None:
            raw_lat, raw_lon = HYDERABAD_LOCALITY_COORDS.get(area_name, (17.4401, 78.3489))
        else:
            raw_lat, raw_lon = float(raw_latitude), float(raw_longitude)

        fuzzy_lat, fuzzy_lon = fuzz_coordinates(raw_lat, raw_lon)

        new_request = Request(
            user_id=user_id,
            category_id=category_id,
            title=title,
            description=description,
            urgency=urgency,
            budget=budget,
            is_negotiable=is_negotiable,
            fulfillment_type=fulfillment_type,
            visibility_radius_km=visibility_radius_km,
            status="published",
        )
        db.session.add(new_request)
        db.session.flush()

        location = RequestLocation(
            request_id=new_request.id,
            raw_latitude=raw_lat,
            raw_longitude=raw_lon,
            fuzzy_latitude=fuzzy_lat,
            fuzzy_longitude=fuzzy_lon,
            area_name=area_name,
            city=city,
        )
        db.session.add(location)
        db.session.commit()

        return new_request

    @staticmethod
    def get_feed(
        current_lat: float = 17.4401,
        current_lon: float = 78.3489,
        max_distance_km: float = 20.0,
        category_slug: str = None,
        urgency: str = None,
        search_query: str = None,
        limit: int = 30,
    ) -> list[dict]:
        """Queries published requests, calculates dynamic Haversine distance, and filters."""
        query = Request.query.filter(Request.status.in_(["published", "receiving_offers", "negotiating"]))

        if category_slug:
            category = Category.query.filter_by(slug=category_slug).first()
            if category:
                query = query.filter(Request.category_id == category.id)

        if urgency:
            query = query.filter(Request.urgency == urgency)

        if search_query:
            q_term = f"%{search_query.strip()}%"
            query = query.filter(
                or_(
                    Request.title.ilike(q_term),
                    Request.description.ilike(q_term),
                )
            )

        requests = query.order_by(Request.created_at.desc()).limit(limit * 2).all()

        results = []
        for req in requests:
            loc = req.location
            dist_km = 1.0
            if loc:
                dist_km = haversine_distance_km(
                    current_lat, current_lon,
                    float(loc.fuzzy_latitude), float(loc.fuzzy_longitude)
                )

            # Filter within requested radius
            if dist_km <= max_distance_km:
                data = req.to_dict(include_exact_location=False)
                data["distance_km"] = dist_km
                results.append(data)

            if len(results) >= limit:
                break

        return results

    @staticmethod
    def get_request_by_id(request_id: str) -> Request:
        """Retrieves single request by UUID."""
        return Request.query.filter_by(id=request_id).first()

    @staticmethod
    def seed_initial_demo_data_if_empty():
        """Auto-seeds canonical categories and initial community requests if DB is empty."""
        from app.models.category import Category
        if Category.query.count() == 0:
            categories_data = [
                ("printing", "Printing & Xerox", "printing", 1),
                ("tutoring", "Tutoring & Tech Help", "graduation-cap", 2),
                ("laptop-repair", "Laptop & Phone Diagnostics", "laptop", 3),
                ("transportation", "Carpool & Rides", "car", 4),
                ("shopping-assistance", "Medicine & Groceries", "shopping-bag", 5),
                ("home-repairs", "Electrician & Plumber", "wrench", 6),
                ("pet-care", "Pet Sitting & Walking", "dog", 7),
                ("tools-lending", "Tools & Equipment", "hammer", 8),
            ]
            for slug, name, icon, order in categories_data:
                cat = Category(slug=slug, name=name, icon_name=icon, display_order=order)
                db.session.add(cat)
            db.session.commit()

        if Request.query.count() == 0:
            # Seed a default demo user
            user = User.query.filter_by(email="rahul.verma@wavy.local").first()
            if not user:
                user = User(email="rahul.verma@wavy.local", is_email_verified=True)
                user.set_password("WavySecure2026!")
                db.session.add(user)
                db.session.flush()

                profile = UserProfile(
                    user_id=user.id,
                    display_name="Rahul Verma",
                    username="rahul_hyd",
                    bio="Software engineer & community helper in Gachibowli.",
                    general_locality="Gachibowli",
                    city="Hyderabad",
                    is_id_verified=True,
                )
                db.session.add(profile)
                db.session.commit()

            # Seed demo requests
            cat_print = Category.query.filter_by(slug="printing").first()
            if cat_print:
                RequestService.create_request(
                    user_id=user.id,
                    category_id=cat_print.id,
                    title="Need 25 Pages Color Printing Urgently",
                    description="Final semester thesis printout needed near DLF Cybercity by 5 PM today.",
                    urgency="urgent",
                    budget=200.0,
                    area_name="Gachibowli",
                )

            cat_tutor = Category.query.filter_by(slug="tutoring").first()
            if cat_tutor:
                RequestService.create_request(
                    user_id=user.id,
                    category_id=cat_tutor.id,
                    title="1-on-1 Python Debugging & Asyncio Help",
                    description="Need an experienced developer to help troubleshoot an async task queue worker deadlock.",
                    urgency="medium",
                    budget=800.0,
                    area_name="Hitech City",
                )

            print("Initial demo database state initialized.")
