from sqlalchemy import Column, String, ForeignKey, Enum
from sqlalchemy.dialects.postgresql import UUID
from app.db.session import Base
import uuid
from sqlalchemy.sql import func
from sqlalchemy import DateTime
from sqlalchemy.orm import relationship

class Decision(Base):
    __tablename__ = "decisions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    evaluation_id = Column(UUID(as_uuid=True), ForeignKey("evaluations.id"))
    officer_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    ai_recommendation = Column(Enum('qualify', 'disqualify', 'clarify', name='decision_enum'))
    final_decision = Column(Enum('qualify', 'disqualify', 'clarify', name='decision_enum'))
    note = Column(String, nullable=True)
    checker_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    checker_decision = Column(String, nullable=True)
    checker_note = Column(String, nullable=True)
    checked_at = Column(DateTime(timezone=True), nullable=True)
    locked_at = Column(DateTime(timezone=True), server_default=func.now())
    
    evaluation = relationship("Evaluation", back_populates="decision")
