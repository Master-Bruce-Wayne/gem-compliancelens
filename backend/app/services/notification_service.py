from sqlalchemy.ext.asyncio import AsyncSession
from app.db.models.notifications import Notification
import logging

logger = logging.getLogger(__name__)

class NotificationService:
    @staticmethod
    async def notify_bidder(db: AsyncSession, bidder_id, title: str, body: str, link: str = None, type: str = 'info'):
        notif = Notification(user_id=bidder_id, title=title, body=body, link=link, type=type)
        db.add(notif)
        await db.commit()
        logger.info(f"Notification queued for Bidder {bidder_id}: {title}")

    @staticmethod
    async def notify_officer(db: AsyncSession, officer_id, title: str, body: str, link: str = None, type: str = 'info'):
        notif = Notification(user_id=officer_id, title=title, body=body, link=link, type=type)
        db.add(notif)
        await db.commit()
        logger.info(f"Notification queued for Officer {officer_id}: {title}")

