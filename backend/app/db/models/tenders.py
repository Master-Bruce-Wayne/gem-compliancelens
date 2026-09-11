from sqlalchemy import Column, String, Enum
from sqlalchemy.dialects.postgresql import UUID
from app.db.session import Base
import uuid
from sqlalchemy.sql import func
from sqlalchemy import DateTime
from sqlalchemy.orm import relationship

class Tender(Base):
    __tablename__ = "tenders"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String)
    organization = Column(String)
    category = Column(String)
    status = Column(Enum('draft', 'open', 'evaluation', 'closed', name='tender_status_enum'))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    rules = relationship("TenderRule", back_populates="tender")
