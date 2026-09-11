from sqlalchemy import Column, String, ForeignKey, Enum, Integer
from sqlalchemy.dialects.postgresql import UUID
from app.db.session import Base
import uuid
from sqlalchemy.sql import func
from sqlalchemy import DateTime
from sqlalchemy.orm import relationship

class Evaluation(Base):
    __tablename__ = "evaluations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    bid_id = Column(UUID(as_uuid=True)) # logical bid = (tender_id, bidder_id) pair
    tender_id = Column(UUID(as_uuid=True), ForeignKey("tenders.id"))
    bidder_id = Column(UUID(as_uuid=True), ForeignKey("bidders.id"))
    overall_score = Column(Integer)
    risk_level = Column(Enum('low', 'medium', 'high', name='risk_level_enum'))
    verdict = Column(Enum('compliant', 'non_compliant', 'needs_review', name='verdict_enum'))
    computed_at = Column(DateTime(timezone=True), server_default=func.now())
    
    checks = relationship("EvaluationCheck", back_populates="evaluation")
    decision = relationship("Decision", back_populates="evaluation", uselist=False)
