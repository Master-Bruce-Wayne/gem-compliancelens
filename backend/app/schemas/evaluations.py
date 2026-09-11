from pydantic import BaseModel
from uuid import UUID
from typing import Optional, List, Dict, Any
from datetime import datetime

class CheckResult(BaseModel):
    rule_name: str
    status: str
    reason: Optional[str] = None
    extracted_value: Optional[str] = None
    source: str

class EvaluationResponse(BaseModel):
    evaluationId: UUID
    checks: List[CheckResult]

class ScorecardResponse(BaseModel):
    score: int
    riskLevel: str
    verdict: str
    checks: List[CheckResult]

class DecisionCreate(BaseModel):
    bidId: UUID
    decision: str
    note: Optional[str] = None
    officerId: UUID
