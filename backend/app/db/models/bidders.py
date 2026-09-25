from sqlalchemy import Column, String, Boolean, Numeric
from sqlalchemy.dialects.postgresql import UUID
from app.db.session import Base
import uuid
from sqlalchemy.sql import func
from sqlalchemy import DateTime
from sqlalchemy.orm import relationship

class Bidder(Base):
    __tablename__ = "bidders"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    legal_name = Column(String)
    pan = Column(String)
    gstin = Column(String, nullable=True)
    is_demo_profile = Column(Boolean, default=False)
    demo_profile_key = Column(String, nullable=True)
    local_content_pct_declared = Column(Numeric, nullable=True)
    annual_turnover_inr = Column(Numeric, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    documents = relationship("BidderDocument", back_populates="bidder")
