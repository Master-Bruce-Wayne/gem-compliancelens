from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.session import get_db
from app.db.models import Bidder, TenderRule, MockRegistryResponse, BidderDocument, SelfCheckSession
from app.services.rule_engine import RuleEngine
from pydantic import BaseModel
from uuid import UUID
from typing import List, Optional
import uuid

router = APIRouter()

class SelfCheckRequest(BaseModel):
    bidderId: UUID
    tenderId: UUID
    documents: List[dict] # simplified

@router.post("/evaluate")
async def self_check_evaluate(req: SelfCheckRequest, db: AsyncSession = Depends(get_db)):
    # Fetch bidder and related data
    result = await db.execute(select(Bidder).where(Bidder.id == req.bidderId))
    bidder = result.scalar_one_or_none()
    if not bidder:
        raise HTTPException(status_code=404, detail="Bidder not found")
        
    rules_result = await db.execute(select(TenderRule).where(TenderRule.tender_id == req.tenderId))
    rules = rules_result.scalars().all()
    
    registry_result = await db.execute(select(MockRegistryResponse).where(MockRegistryResponse.bidder_id == req.bidderId))
    registry_responses = registry_result.scalars().all()
    
    docs_result = await db.execute(select(BidderDocument).where(BidderDocument.bidder_id == req.bidderId))
    docs = docs_result.scalars().all()
    
    engine_result = RuleEngine.evaluate(bidder, rules, registry_responses, docs)
    
    gaps = []
    for check in engine_result['checks']:
        if check['status'] != 'pass':
            gaps.append({
                "ruleName": check['rule_name'],
                "guidanceText": f"Please review this requirement: {check['reason']}"
            })
            
    summary_status = 'has_gaps' if gaps else 'likely_compliant'
    
    session_record = SelfCheckSession(
        bidder_id=req.bidderId,
        tender_id=req.tenderId,
        summary_status=summary_status,
        gaps=gaps
    )
    db.add(session_record)
    await db.commit()
    
    return {
        "summaryStatus": summary_status,
        "gaps": gaps
    }
