from sqlalchemy import Column, String, ForeignKey, Enum, DateTime
from sqlalchemy.dialects.postgresql import UUID
from app.db.session import Base
import uuid
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

class ManualVerification(Base):
    __tablename__ = "manual_verifications"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    evaluation_check_id = Column(UUID(as_uuid=True), ForeignKey("evaluation_checks.id"), nullable=False)
    officer_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    outcome = Column(Enum('verified', 'not_verified', 'could_not_determine', name='manual_verification_outcome_enum'), nullable=False)
    notes = Column(String, nullable=True)
    checked_at = Column(DateTime(timezone=True), server_default=func.now())

