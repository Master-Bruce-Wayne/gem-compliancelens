from pydantic import BaseModel, UUID4
from typing import Optional, List, Dict, Any

class BidderProfileUpdate(BaseModel):
    bidderId: UUID4
    confirmedFields: Dict[str, Any]
