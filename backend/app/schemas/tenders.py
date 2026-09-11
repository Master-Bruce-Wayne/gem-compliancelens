from pydantic import BaseModel, UUID4
from typing import Optional, List
from datetime import datetime

class TenderRuleBase(BaseModel):
    clause_type: str
    threshold_value: Optional[float] = None
    mandatory: bool = True

class TenderRuleCreate(BaseModel):
    tenderId: UUID4
    clauses: List[TenderRuleBase]

class TenderRuleResponse(BaseModel):
    ruleSetId: UUID4
    savedAt: datetime
    
class TenderRuleListResponse(BaseModel):
    ruleSetId: UUID4
    clauses: List[TenderRuleBase]
