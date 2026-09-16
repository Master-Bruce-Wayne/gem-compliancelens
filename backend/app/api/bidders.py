from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.session import get_db
from app.db.models.bidder_documents import BidderDocument
from app.db.models.authenticity import DocumentAuthenticityCheck
import uuid

router = APIRouter()

@router.get("/{id}/documents")
async def get_bidder_documents(id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(BidderDocument).filter(BidderDocument.bidder_id == uuid.UUID(id)))
    documents = result.scalars().all()
    
    # If none exist, create some mock ones for the UI demo since we don't have an active upload flow
    if not documents:
        docs = [
            BidderDocument(bidder_id=uuid.UUID(id), doc_type='pan', extracted_fields={'pan': 'ABCDE1234F'}, file_url='dummy_pan.pdf'),
            BidderDocument(bidder_id=uuid.UUID(id), doc_type='gst_certificate', extracted_fields={'gstin': '07ABCDE1234F1Z5'}, file_url='dummy_gst.pdf'),
            BidderDocument(bidder_id=uuid.UUID(id), doc_type='udyam_certificate', extracted_fields={'udyam_registration_number': 'UDYAM-MH-00-1234567'}, file_url='dummy_udyam.jpg')
        ]
        db.add_all(docs)
        await db.commit()
        
        result = await db.execute(select(BidderDocument).filter(BidderDocument.bidder_id == uuid.UUID(id)))
        documents = result.scalars().all()

    return [{
        "id": str(doc.id),
        "docType": doc.doc_type,
        "extractedFields": doc.extracted_fields,
        "fileUrl": doc.file_url,
        "createdAt": doc.created_at
    } for doc in documents]

from app.db.models.bidders import Bidder
@router.get("")
async def get_bidders(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Bidder))
    bidders = result.scalars().all()
    return [{"id": str(b.id), "legal_name": b.legal_name, "pan": b.pan} for b in bidders]
