from sqlalchemy import Column, String, ForeignKey, Enum
from sqlalchemy.dialects.postgresql import UUID
from app.db.session import Base
import uuid
from sqlalchemy.sql import func
from sqlalchemy import DateTime
from sqlalchemy.orm import relationship

class EvaluationCheck(Base):
    __tablename__ = "evaluation_checks"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    evaluation_id = Column(UUID(as_uuid=True), ForeignKey("evaluations.id"))
    rule_name = Column(String)
    status = Column(Enum('pass', 'fail', 'needs_review', name='check_status_enum'))
    extracted_value = Column(String, nullable=True)
    source = Column(String)
    checked_at = Column(DateTime(timezone=True), server_default=func.now())
    explanation_text = Column(String, nullable=True)
    
    evaluation = relationship("Evaluation", back_populates="checks")
