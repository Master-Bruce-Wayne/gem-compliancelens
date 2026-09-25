from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.session import get_db
from app.db.models.tenders import Tender
from app.db.models.tender_rules import TenderRule
from app.db.models.bids import BidApplication
from pydantic import BaseModel
from uuid import UUID
from typing import List, Optional
import uuid
import datetime

router = APIRouter()

class TenderCreateRequest(BaseModel):
    title: str
    organization: str
    category: str
    description: Optional[str] = None
    deadline: Optional[str] = None
    access_type: str = "public"

@router.post("")
async def create_tender(req: TenderCreateRequest, db: AsyncSession = Depends(get_db)):
    tender_no = f"GEM/{datetime.datetime.now().year}/B/{uuid.uuid4().hex[:6].upper()}"
    tender = Tender(
        tender_no=tender_no,
        title=req.title,
        organization=req.organization,
        category=req.category,
        access_type=req.access_type,
        status='draft'
    )
    db.add(tender)
    await db.commit()
    await db.refresh(tender)
    return {"id": tender.id, "tender_no": tender.tender_no, "status": tender.status}

class TenderRuleRequest(BaseModel):
    clauseType: str
    mandatory: bool
    thresholdValue: Optional[float] = None

class SetRulesRequest(BaseModel):
    rules: List[TenderRuleRequest]

@router.post("/{id}/rules")
async def set_tender_rules(id: uuid.UUID, req: SetRulesRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Tender).where(Tender.id == id))
    tender = result.scalar_one_or_none()
    if not tender:
        raise HTTPException(status_code=404, detail="Tender not found")
        
    await db.execute(TenderRule.__table__.delete().where(TenderRule.tender_id == id))
    
    for r in req.rules:
        rule = TenderRule(
            tender_id=id,
            clause_type=r.clauseType,
            mandatory=r.mandatory,
            threshold_value=r.thresholdValue
        )
        db.add(rule)
        
    await db.commit()
    return {"status": "success"}

@router.post("/{id}/publish")
async def publish_tender(id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Tender).where(Tender.id == id))
    tender = result.scalar_one_or_none()
    if not tender:
        raise HTTPException(status_code=404, detail="Tender not found")
        
    rules_res = await db.execute(select(TenderRule).where(TenderRule.tender_id == id))
    if not rules_res.scalars().first():
        raise HTTPException(status_code=400, detail="Cannot publish tender without rules")
        
    tender.status = 'open'
    await db.commit()
    return {"status": "success"}

@router.get("/{id}/applications")
async def get_tender_applications(id: uuid.UUID, status: Optional[str] = None, db: AsyncSession = Depends(get_db)):
    query = select(BidApplication).where(BidApplication.tender_id == id)
    if status:
        query = query.where(BidApplication.status == status)
        
    result = await db.execute(query)
    apps = result.scalars().all()
    
    return [{
        "id": a.id,
        "bidderId": a.bidder_id,
        "status": a.status,
        "submittedAt": a.submitted_at
    } for a in apps]

@router.get("/open")
async def get_open_tenders(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Tender).where(Tender.status == 'open').where(Tender.access_type == 'public'))
    tenders = result.scalars().all()
    return [{
        "id": t.id,
        "tender_no": t.tender_no,
        "title": t.title,
        "organization": t.organization,
        "category": t.category,
        "access_type": t.access_type
    } for t in tenders]

@router.get("/search/{tender_no}")
async def search_tender(tender_no: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Tender).where(Tender.tender_no == tender_no).where(Tender.status == 'open'))
    tender = result.scalar_one_or_none()
    if not tender:
        raise HTTPException(status_code=404, detail="Tender not found or not open for applications")
    return {
        "id": tender.id,
        "tender_no": tender.tender_no,
        "title": tender.title,
        "organization": tender.organization,
        "category": tender.category,
        "access_type": tender.access_type
    }

@router.get("/{id}")
async def get_tender(id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Tender).where(Tender.id == id))
    tender = result.scalar_one_or_none()
    if not tender:
        raise HTTPException(status_code=404, detail="Tender not found")
        
    rules_res = await db.execute(select(TenderRule).where(TenderRule.tender_id == id))
    rules = rules_res.scalars().all()
    
    return {
        "id": tender.id,
        "tender_no": tender.tender_no,
        "title": tender.title,
        "organization": tender.organization,
        "category": tender.category,
        "status": tender.status,
        "access_type": tender.access_type,
        "rules": [{"clauseType": r.clause_type, "mandatory": r.mandatory, "threshold": r.threshold_value} for r in rules]
    }
