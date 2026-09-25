from sqlalchemy import Column, String, ForeignKey, Enum, DateTime, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID, JSONB
from app.db.session import Base
import uuid
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

class BidApplication(Base):
    __tablename__ = "bid_applications"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tender_id = Column(UUID(as_uuid=True), ForeignKey("tenders.id"), nullable=False)
    bidder_id = Column(UUID(as_uuid=True), ForeignKey("bidders.id"), nullable=False)
    status = Column(Enum('draft', 'submitted', 'under_evaluation', 'clarification_requested', 'qualified', 'disqualified', 'withdrawn', 'access_pending', 'access_denied', name='bid_status_enum'), default='draft', nullable=False)
    submitted_at = Column(DateTime(timezone=True), nullable=True)
    current_evaluation_id = Column(UUID(as_uuid=True), ForeignKey("evaluations.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    __table_args__ = (UniqueConstraint('tender_id', 'bidder_id', name='uq_tender_bidder'),)

    tender = relationship("Tender", foreign_keys=[tender_id])
    bidder = relationship("Bidder", foreign_keys=[bidder_id])
    documents = relationship("BidApplicationDocument", back_populates="bid_application")
    clarification_requests = relationship("ClarificationRequest", back_populates="bid_application")


class BidApplicationDocument(Base):
    __tablename__ = "bid_application_documents"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    bid_application_id = Column(UUID(as_uuid=True), ForeignKey("bid_applications.id"), nullable=False)
    document_id = Column(UUID(as_uuid=True), ForeignKey("bidder_documents.id"), nullable=False)
    attached_at = Column(DateTime(timezone=True), server_default=func.now())

    bid_application = relationship("BidApplication", back_populates="documents")
    document = relationship("BidderDocument")


class ClarificationRequest(Base):
    __tablename__ = "clarification_requests"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    bid_application_id = Column(UUID(as_uuid=True), ForeignKey("bid_applications.id"), nullable=False)
    officer_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    message = Column(String, nullable=False)
    related_check_ids = Column(JSONB, nullable=True)
    status = Column(Enum('open', 'responded', 'closed', name='clarification_status_enum'), default='open', nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    responded_at = Column(DateTime(timezone=True), nullable=True)

    bid_application = relationship("BidApplication", back_populates="clarification_requests")
    responses = relationship("ClarificationResponse", back_populates="request")


class ClarificationResponse(Base):
    __tablename__ = "clarification_responses"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    clarification_request_id = Column(UUID(as_uuid=True), ForeignKey("clarification_requests.id"), nullable=False)
    bidder_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    message = Column(String, nullable=False)
    new_document_ids = Column(JSONB, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    request = relationship("ClarificationRequest", back_populates="responses")

