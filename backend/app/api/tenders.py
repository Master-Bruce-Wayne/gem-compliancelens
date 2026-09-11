from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.session import get_db
from app.db.models import TenderRule
from app.schemas.tenders import TenderRuleCreate, TenderRuleResponse
from datetime import datetime
import uuid

router = APIRouter()

@router.post("/{tender_id}/rules", response_model=TenderRuleResponse)
async def configure_rules(tender_id: uuid.UUID, payload: TenderRuleCreate, db: AsyncSession = Depends(get_db)):
    # Clear existing rules for tender (simple overwrite)
    result = await db.execute(select(TenderRule).where(TenderRule.tender_id == tender_id))
    for rule in result.scalars():
        await db.delete(rule)
        
    for clause in payload.clauses:
        rule = TenderRule(
            tender_id=tender_id,
            clause_type=clause.clause_type,
            threshold_value=clause.threshold_value,
            mandatory=clause.mandatory
        )
        db.add(rule)
    
    await db.commit()
    
    return TenderRuleResponse(
        ruleSetId=tender_id, # Simplified
        savedAt=datetime.utcnow()
    )

@router.get("/{tender_id}/rules")
async def get_rules(tender_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(TenderRule).where(TenderRule.tender_id == tender_id))
    rules = result.scalars().all()
    
    return {
        "ruleSetId": tender_id,
        "clauses": [{"clause_type": r.clause_type, "threshold_value": r.threshold_value, "mandatory": r.mandatory} for r in rules]
    }
