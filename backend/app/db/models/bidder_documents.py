from sqlalchemy import Column, String, ForeignKey, Enum, Numeric
from sqlalchemy.dialects.postgresql import UUID, JSONB
from app.db.session import Base
import uuid
from sqlalchemy.sql import func
from sqlalchemy import DateTime
from sqlalchemy.orm import relationship

class BidderDocument(Base):
    __tablename__ = "bidder_documents"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    bidder_id = Column(UUID(as_uuid=True), ForeignKey("bidders.id"))
    doc_type = Column(Enum('pan', 'gst_certificate', 'udyam_certificate', 'epfo_esic', 'other', name='doc_type_enum'))
    file_url = Column(String, nullable=True)
    ocr_status = Column(Enum('pending', 'processing', 'done', 'failed', name='ocr_status_enum'))
    extracted_fields = Column(JSONB, nullable=True)
    confirmed_fields = Column(JSONB, nullable=True)
    confidence_score = Column(Numeric, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    bidder = relationship("Bidder", back_populates="documents")
