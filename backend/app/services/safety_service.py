from datetime import datetime, timezone
from app import db
from app.models.safety import Review, Report, UserBlock, SafetyContact, AuditLog
from app.models.offer import Activity
from app.models.user import User

class SafetyService:
    @staticmethod
    def submit_review(activity_id: str, reviewer_id: str, rating: int, comment: str = None) -> Review:
        """Submits mutual review after assist completion and updates reputation average."""
        if rating < 1 or rating > 5:
            raise ValueError("RATING_OUT_OF_RANGE")

        activity = Activity.query.filter_by(id=activity_id).first()
        if not activity:
            raise ValueError("ACTIVITY_NOT_FOUND")

        if activity.status != "completed":
            raise ValueError("ACTIVITY_NOT_COMPLETED")

        if reviewer_id == activity.requester_id:
            reviewed_id = activity.helper_id
        elif reviewer_id == activity.helper_id:
            reviewed_id = activity.requester_id
        else:
            raise ValueError("UNAUTHORIZED_NOT_PARTICIPANT")

        review = Review(
            activity_id=activity_id,
            reviewer_id=reviewer_id,
            reviewed_id=reviewed_id,
            rating=rating,
            comment=comment,
        )
        db.session.add(review)

        # Update reviewed user's average rating in UserProfile
        reviewed_user = User.query.filter_by(id=reviewed_id).first()
        if reviewed_user and reviewed_user.profile:
            all_reviews = Review.query.filter_by(reviewed_id=reviewed_id).all()
            total_stars = sum(r.rating for r in all_reviews) + rating
            total_count = len(all_reviews) + 1
            reviewed_user.profile.rating_avg = round(total_stars / total_count, 2)
            reviewed_user.profile.reviews_count = total_count

        db.session.commit()
        return review

    @staticmethod
    def report_user(reporter_id: str, reported_user_id: str = None, reported_request_id: str = None, reason: str = "other", details: str = None) -> Report:
        """Flags suspicious behavior or safety breach for human moderation."""
        report = Report(
            reporter_id=reporter_id,
            reported_user_id=reported_user_id,
            reported_request_id=reported_request_id,
            reason=reason,
            details=details,
            status="pending",
        )
        db.session.add(report)
        db.session.commit()
        return report

    @staticmethod
    def block_user(blocker_id: str, blocked_id: str) -> UserBlock:
        """Blocks interaction with a designated user."""
        if blocker_id == blocked_id:
            raise ValueError("CANNOT_BLOCK_SELF")

        existing = UserBlock.query.filter_by(blocker_id=blocker_id, blocked_id=blocked_id).first()
        if existing:
            return existing

        block = UserBlock(blocker_id=blocker_id, blocked_id=blocked_id)
        db.session.add(block)
        db.session.commit()
        return block

    @staticmethod
    def export_dpdp_user_data(user_id: str) -> dict:
        """DPDP Act Right to Access: Generates full JSON dump of user data."""
        user = User.query.filter_by(id=user_id).first()
        if not user:
            raise ValueError("USER_NOT_FOUND")

        from app.models.request import Request
        from app.models.offer import Offer

        requests = Request.query.filter_by(user_id=user_id).all()
        offers = Offer.query.filter_by(helper_id=user_id).all()
        reviews = Review.query.filter_by(reviewed_id=user_id).all()

        return {
            "account": user.to_dict(),
            "requests": [r.to_dict(include_exact_location=True) for r in requests],
            "offers": [o.to_dict() for o in offers],
            "reviews_received": [rv.to_dict() for rv in reviews],
            "exported_at": datetime.now(timezone.utc).isoformat(),
            "compliance": "DPDP_ACT_2023_INDIA",
        }

