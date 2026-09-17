from sqlalchemy import Column, String, ForeignKey, Enum, DateTime
from sqlalchemy.dialects.postgresql import UUID, JSONB
from app.db.session import Base
import uuid
from sqlalchemy.sql import func

class VerificationResult(Base):
    __tablename__ = "verification_results"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    check_type = Column(String, nullable=False)
    identifier = Column(String, nullable=False)
    response_payload = Column(JSONB, nullable=False)
    provider = Column(String, nullable=False)
    fetched_at = Column(DateTime(timezone=True), server_default=func.now())
