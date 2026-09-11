from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.session import get_db
from app.db.models import MockRegistryResponse
import uuid

router = APIRouter()

@router.get("/{bidderId}")
async def get_mock_registry(bidderId: uuid.UUID, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(MockRegistryResponse).where(MockRegistryResponse.bidder_id == bidderId))
    responses = result.scalars().all()
    
    data = {}
    for r in responses:
        data[r.registry_type] = r.response_payload
    return data
