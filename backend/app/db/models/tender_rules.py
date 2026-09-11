from sqlalchemy import Column, String, ForeignKey, Numeric, Boolean
from sqlalchemy.dialects.postgresql import UUID
from app.db.session import Base
import uuid
from sqlalchemy.sql import func
from sqlalchemy import DateTime
from sqlalchemy.orm import relationship

class TenderRule(Base):
    __tablename__ = "tender_rules"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tender_id = Column(UUID(as_uuid=True), ForeignKey("tenders.id"))
    clause_type = Column(String)
    threshold_value = Column(Numeric, nullable=True)
    mandatory = Column(Boolean, default=True) # Added based on seed data
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    tender = relationship("Tender", back_populates="rules")
