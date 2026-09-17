from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.session import get_db
from app.db.models.notifications import Notification
from pydantic import BaseModel
from uuid import UUID
from datetime import datetime, timezone
import uuid

router = APIRouter()

@router.get("")
async def get_notifications(userId: UUID, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Notification).where(Notification.user_id == userId).order_by(Notification.created_at.desc())
    )
    notifs = result.scalars().all()
    return [{
        "id": n.id,
        "type": n.type,
        "title": n.title,
        "body": n.body,
        "link": n.link,
        "readAt": n.read_at,
        "createdAt": n.created_at
    } for n in notifs]

@router.post("/{id}/read")
async def mark_read(id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Notification).where(Notification.id == id))
    notif = result.scalar_one_or_none()
    if not notif:
        raise HTTPException(status_code=404)
        
    notif.read_at = datetime.now(timezone.utc)
    await db.commit()
    return {"status": "success"}
