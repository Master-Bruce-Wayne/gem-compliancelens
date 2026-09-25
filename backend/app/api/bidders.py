from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.session import get_db
from app.db.models import Bidder, BidderDocument
from pydantic import BaseModel
import uuid

router = APIRouter()

@router.get("/{id}/documents")
async def get_bidder_documents(id: str, include_temporary: bool = False, db: AsyncSession = Depends(get_db)):
    from sqlalchemy import or_
    query = select(BidderDocument).where(BidderDocument.bidder_id == uuid.UUID(id))
    if not include_temporary:
        query = query.where(or_(BidderDocument.is_temporary == False, BidderDocument.is_temporary == None))
        
    result = await db.execute(query)
    docs = result.scalars().all()
    
    return [
        {
            "id": str(doc.id),
            "docType": doc.doc_type,
            "fileUrl": doc.file_url,
            "ocrStatus": doc.ocr_status,
            "extractedFields": doc.extracted_fields,
            "confidenceScore": doc.confidence_score,
            "createdAt": doc.created_at
        }
        for doc in docs
    ]
