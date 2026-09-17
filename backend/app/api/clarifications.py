from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.session import get_db
from app.db.models.bids import BidApplication, ClarificationRequest, ClarificationResponse
from app.db.models.audit_log import AuditLog
from pydantic import BaseModel
from uuid import UUID
from typing import List, Optional
import uuid

router = APIRouter()

class ClarificationRespRequest(BaseModel):
    bidderId: UUID
    message: str
    newDocumentIds: Optional[List[UUID]] = None

@router.post("/{id}/respond")
async def respond_clarification(id: uuid.UUID, req: ClarificationRespRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(ClarificationRequest).where(ClarificationRequest.id == id))
    cr = result.scalar_one_or_none()
    if not cr:
        raise HTTPException(status_code=404, detail="Clarification request not found")
        
    if cr.status != 'open':
        raise HTTPException(status_code=409, detail="Clarification request already responded to")
        
    app_result = await db.execute(select(BidApplication).where(BidApplication.id == cr.bid_application_id))
    bid = app_result.scalar_one()
    
    # Update statuses
    cr.status = 'responded'
    bid.status = 'under_evaluation'
    
    resp = ClarificationResponse(
        clarification_request_id=id,
        bidder_id=req.bidderId,
        message=req.message,
        new_document_ids=[str(doc_id) for doc_id in req.newDocumentIds] if req.newDocumentIds else None
    )
    db.add(resp)
    
    audit = AuditLog(
        bid_id=bid.id,
        event_type='document_correction',
        actor_id=req.bidderId,
        details={"action": "clarification_responded", "message": req.message}
    )
    db.add(audit)
    
    await db.commit()
    return {"status": "success"}
