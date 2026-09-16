from sqlalchemy import Column, String, ForeignKey, Enum, Numeric, JSON
from sqlalchemy.dialects.postgresql import UUID, JSONB
from app.db.session import Base
import uuid
from sqlalchemy.sql import func
from sqlalchemy import DateTime
from sqlalchemy.orm import relationship

class DocumentAuthenticityCheck(Base):
    __tablename__ = "document_authenticity_checks"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    document_id = Column(UUID(as_uuid=True), ForeignKey("bidder_documents.id"), nullable=False)
    check_type = Column(Enum('checksum', 'metadata', 'ela', 'llm_consistency', 'hash_reuse', name='authenticity_check_type_enum'), nullable=False)
    status = Column(Enum('pass', 'fail', 'needs_review', name='authenticity_status_enum'), nullable=False)
    detail = Column(JSONB, nullable=True)
    evidence_path = Column(String, nullable=True)
    checked_at = Column(DateTime(timezone=True), server_default=func.now())

    document = relationship("BidderDocument")

class DocumentHash(Base):
    __tablename__ = "document_hashes"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    file_hash = Column(String, nullable=False, index=True)
    bidder_id = Column(UUID(as_uuid=True), ForeignKey("bidders.id"), nullable=False)
    uploader_id = Column(UUID(as_uuid=True), nullable=True)
    doc_type = Column(String, nullable=False)
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())
