from sqlalchemy import Column, String, ForeignKey, Enum
from sqlalchemy.dialects.postgresql import UUID, JSONB
from app.db.session import Base
import uuid
from sqlalchemy.sql import func
from sqlalchemy import DateTime

class SelfCheckSession(Base):
    __tablename__ = "self_check_sessions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    bidder_id = Column(UUID(as_uuid=True), ForeignKey("bidders.id"))
    tender_id = Column(UUID(as_uuid=True), ForeignKey("tenders.id"))
    summary_status = Column(Enum('likely_compliant', 'has_gaps', name='self_check_status_enum'))
    gaps = Column(JSONB)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
