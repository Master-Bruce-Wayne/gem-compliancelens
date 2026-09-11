from pydantic import BaseModel
from uuid import UUID
from typing import Optional, List, Dict, Any

class BidderProfileUpdate(BaseModel):
    bidderId: UUID
    confirmedFields: Dict[str, Any]
