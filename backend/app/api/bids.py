from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from app.db.session import get_db
from app.db.models import Bidder, TenderRule, MockRegistryResponse, BidderDocument, Evaluation, EvaluationCheck, Decision, AuditLog
from app.services.rule_engine import RuleEngine
from app.services.explanation_service import ExplanationService
from pydantic import BaseModel
from uuid import UUID
from typing import List, Optional
import uuid

router = APIRouter()
explanation_service = ExplanationService()

class EvaluateRequest(BaseModel):
    bidderId: UUID
    tenderId: UUID

@router.post("/{id}/evaluate")
async def evaluate_bid(id: uuid.UUID, req: EvaluateRequest, db: AsyncSession = Depends(get_db)):
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
    
    # Save evaluation
    eval_record = Evaluation(
        bid_id=id,
        tender_id=req.tenderId,
        bidder_id=req.bidderId,
        overall_score=engine_result['overall_score'],
        risk_level=engine_result['risk_level'],
        verdict=engine_result['verdict']
    )
    db.add(eval_record)
    await db.flush()
    
    for check in engine_result['checks']:
        chk_record = EvaluationCheck(
            evaluation_id=eval_record.id,
            rule_name=check['rule_name'],
            status=check['status'],
            extracted_value=check['extracted_value'],
            source=check['source']
        )
        db.add(chk_record)
        
    # Audit log
    audit = AuditLog(
        bid_id=id,
        event_type='evaluation_run',
        details={"score": engine_result['overall_score'], "verdict": engine_result['verdict']}
    )
    db.add(audit)
    
    await db.commit()
    
    return {"evaluationId": eval_record.id, "checks": engine_result['checks']}

@router.get("/{id}/scorecard")
async def get_scorecard(id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Evaluation).where(Evaluation.bid_id == id).order_by(Evaluation.computed_at.desc())
    )
    eval_record = result.scalars().first()
    if not eval_record:
        raise HTTPException(status_code=404, detail="Evaluation not found")
        
    checks_result = await db.execute(select(EvaluationCheck).where(EvaluationCheck.evaluation_id == eval_record.id))
    checks = checks_result.scalars().all()
    
    return {
        "score": eval_record.overall_score,
        "riskLevel": eval_record.risk_level,
        "verdict": eval_record.verdict,
        "checks": [{"name": c.rule_name, "status": c.status, "summary": c.extracted_value} for c in checks]
    }

@router.get("/{id}/checks/{checkId}")
async def get_check_detail(id: uuid.UUID, checkId: uuid.UUID, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(EvaluationCheck).where(EvaluationCheck.id == checkId))
    check = result.scalar_one_or_none()
    if not check:
        raise HTTPException(status_code=404, detail="Check not found")
        
    if not check.explanation_text:
        explanation = explanation_service.generate_explanation(
            rule_name=check.rule_name,
            status=check.status,
            extracted_value=check.extracted_value or "",
            source=check.source
        )
        check.explanation_text = explanation
        await db.commit()
        
    return {
        "ruleName": check.rule_name,
        "status": check.status,
        "extractedValue": check.extracted_value,
        "source": check.source,
        "checkedAt": check.checked_at,
        "explanationText": check.explanation_text
    }

class DecisionRequest(BaseModel):
    decision: str
    note: Optional[str] = None
    officerId: UUID

@router.post("/{id}/decision")
async def submit_decision(id: uuid.UUID, req: DecisionRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Evaluation).where(Evaluation.bid_id == id).order_by(Evaluation.computed_at.desc()))
    eval_record = result.scalars().first()
    
    if not eval_record:
        raise HTTPException(status_code=404, detail="Evaluation not found")
        
    decision = Decision(
        evaluation_id=eval_record.id,
        officer_id=req.officerId,
        ai_recommendation=eval_record.verdict, # simplification
        final_decision=req.decision,
        note=req.note
    )
    db.add(decision)
    
    audit = AuditLog(
        bid_id=id,
        event_type='decision_submitted',
        actor_id=req.officerId,
        details={"decision": req.decision, "note": req.note}
    )
    db.add(audit)
    
    await db.commit()
    return {"decisionId": decision.id, "lockedAt": decision.locked_at, "auditEntryId": audit.id}

@router.get("/{id}/audit-log")
async def get_audit_log(id: uuid.UUID, eventType: Optional[str] = None, db: AsyncSession = Depends(get_db)):
    query = select(AuditLog).where(AuditLog.bid_id == id).order_by(AuditLog.created_at.asc())
    if eventType:
        query = query.where(AuditLog.event_type == eventType)
        
    result = await db.execute(query)
    events = result.scalars().all()
    
    return {
        "events": [
            {"type": e.event_type, "actor": str(e.actor_id) if e.actor_id else None, "timestamp": e.created_at, "details": e.details}
            for e in events
        ]
    }
