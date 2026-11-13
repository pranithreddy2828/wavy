from datetime import datetime, timezone
from app import db
from app.models.offer import Offer, Negotiation, Activity
from app.models.request import Request
from app.models.user import User

class OfferService:
    @staticmethod
    def submit_offer(
        request_id: str,
        helper_id: str,
        proposed_price: float,
        estimated_completion: str,
        note: str = None,
    ) -> Offer:
        """Helper submits a competitive offer for a community request."""
        req = Request.query.filter_by(id=request_id).first()
        if not req:
            raise ValueError("REQUEST_NOT_FOUND")

        if req.user_id == helper_id:
            raise ValueError("CANNOT_OFFER_ON_OWN_REQUEST")

        if req.status in ["completed", "cancelled", "expired"]:
            raise ValueError("REQUEST_NOT_OPEN")

        existing = Offer.query.filter_by(request_id=request_id, helper_id=helper_id).first()
        if existing:
            # Update existing proposal
            existing.proposed_price = proposed_price
            existing.estimated_completion = estimated_completion
            existing.note = note
            existing.status = "submitted"
            db.session.commit()
            return existing

        offer = Offer(
            request_id=request_id,
            helper_id=helper_id,
            proposed_price=proposed_price,
            estimated_completion=estimated_completion,
            note=note,
            status="submitted",
        )
        db.session.add(offer)

        # Update request status to receiving offers
        if req.status == "published":
            req.status = "receiving_offers"

        db.session.commit()
        return offer

    @staticmethod
    def get_offers_for_request(request_id: str) -> list[dict]:
        """Lists all submitted offers for a request."""
        offers = Offer.query.filter_by(request_id=request_id).order_by(Offer.created_at.desc()).all()
        return [o.to_dict() for o in offers]

    @staticmethod
    def accept_offer(offer_id: str, requester_id: str) -> Activity:
        """Requester accepts an offer: locks request and creates an active engagement."""
        offer = Offer.query.filter_by(id=offer_id).first()
        if not offer:
            raise ValueError("OFFER_NOT_FOUND")

        req = offer.request
        if req.user_id != requester_id:
            raise ValueError("UNAUTHORIZED_NOT_REQUESTER")

        if req.status in ["in_progress", "completed", "cancelled"]:
            raise ValueError("REQUEST_ALREADY_LOCKED")

        # Accept this offer
        offer.status = "accepted"
        req.status = "in_progress"

        # Reject/lock all other offers
        Offer.query.filter(
            Offer.request_id == req.id,
            Offer.id != offer.id
        ).update({"status": "rejected"})

        # Create active lifecycle Activity
        activity = Activity(
            request_id=req.id,
            offer_id=offer.id,
            requester_id=requester_id,
            helper_id=offer.helper_id,
            agreed_price=offer.proposed_price,
            status="in_progress",
        )
        db.session.add(activity)
        db.session.commit()

        return activity

    @staticmethod
    def counter_offer(offer_id: str, proposer_id: str, proposed_price: float, message: str = None) -> Negotiation:
        """Submit a counter-offer price proposal."""
        offer = Offer.query.filter_by(id=offer_id).first()
        if not offer:
            raise ValueError("OFFER_NOT_FOUND")

        negotiation = Negotiation(
            offer_id=offer.id,
            proposer_id=proposer_id,
            proposed_price=proposed_price,
            message=message,
        )
        offer.status = "negotiating"
        offer.proposed_price = proposed_price
        db.session.add(negotiation)
        db.session.commit()

        return negotiation

    @staticmethod
    def complete_activity(activity_id: str, user_id: str) -> Activity:
        """Mark community assist completed."""
        activity = Activity.query.filter_by(id=activity_id).first()
        if not activity:
            raise ValueError("ACTIVITY_NOT_FOUND")

        if user_id not in [activity.requester_id, activity.helper_id]:
            raise ValueError("UNAUTHORIZED")

        activity.status = "completed"
        activity.completed_at = datetime.now(timezone.utc)
        if activity.request:
            activity.request.status = "completed"

        # Increment helper completed count
        if activity.helper and activity.helper.profile:
            activity.helper.profile.completed_activities_count += 1

        db.session.commit()
        return activity

