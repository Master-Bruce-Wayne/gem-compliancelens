from pydantic import BaseModel
from uuid import UUID
from typing import Optional, List
from datetime import datetime

class TenderRuleBase(BaseModel):
    clause_type: str
    threshold_value: Optional[float] = None
    mandatory: bool = True

class TenderRuleCreate(BaseModel):
    tenderId: UUID
    clauses: List[TenderRuleBase]

class TenderRuleResponse(BaseModel):
    ruleSetId: UUID
    savedAt: datetime
    
class TenderRuleListResponse(BaseModel):
    ruleSetId: UUID
    clauses: List[TenderRuleBase]
