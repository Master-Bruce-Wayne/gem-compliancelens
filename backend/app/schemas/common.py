from pydantic import BaseModel
from typing import Optional, Any

class ErrorResponse(BaseModel):
    code: str
    message: str
    field: Optional[str] = None

class ErrorEnvelope(BaseModel):
    error: ErrorResponse
