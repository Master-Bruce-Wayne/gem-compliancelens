from sqlalchemy import Column, String, ForeignKey, Enum
from sqlalchemy.dialects.postgresql import UUID, JSONB
from app.db.session import Base
import uuid
from sqlalchemy.sql import func
from sqlalchemy import DateTime

class AuditLog(Base):
    __tablename__ = "audit_log"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    bid_id = Column(UUID(as_uuid=True))
    event_type = Column(Enum('document_upload', 'document_correction', 'evaluation_run', 'decision_submitted', name='event_type_enum'))
    actor_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    details = Column(JSONB)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
