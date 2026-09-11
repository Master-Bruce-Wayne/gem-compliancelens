from sqlalchemy import Column, String, ForeignKey, Enum
from sqlalchemy.dialects.postgresql import UUID, JSONB
from app.db.session import Base
import uuid
from sqlalchemy.sql import func
from sqlalchemy import DateTime
from sqlalchemy.orm import relationship

class MockRegistryResponse(Base):
    __tablename__ = "mock_registry_responses"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    bidder_id = Column(UUID(as_uuid=True), ForeignKey("bidders.id"))
    registry_type = Column(Enum('udyam', 'gst', 'pan', 'epfo_esic', 'nsic', 'dpiit_startup_india', 'cppp_debarment', name='registry_type_enum'))
    response_payload = Column(JSONB)
    fetched_at = Column(DateTime(timezone=True), server_default=func.now())
    
    bidder = relationship("Bidder", back_populates="mock_responses")
