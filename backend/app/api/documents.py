from fastapi import APIRouter, UploadFile, File, Depends, Form
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
import uuid
from typing import Optional

router = APIRouter()

@router.post("/upload")
async def upload_document(
    bidderId: str = Form(...),
    tenderId: str = Form(...),
    docType: str = Form(...),
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db)
):
    # Dummy implementation for hackathon
    # Ideally, we would save to S3/local and trigger OCR
    ocr_job_id = str(uuid.uuid4())
    return {
        "documentId": str(uuid.uuid4()),
        "status": "processing",
        "ocrJobId": ocr_job_id
    }

@router.get("/{ocrJobId}/status")
async def get_ocr_status(ocrJobId: str):
    return {
        "status": "done",
        "extractedFields": {"example": "value"},
        "confidenceScore": 95.0
    }

from app.services.forgery_service import ForgeryService
from app.db.models.bidder_documents import BidderDocument
from app.db.models.authenticity import DocumentAuthenticityCheck
from sqlalchemy import select
from fastapi import HTTPException

@router.post("/{id}/authenticity")
async def check_authenticity(id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(BidderDocument).filter(BidderDocument.id == uuid.UUID(id)))
    doc = result.scalars().first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
        
    service = ForgeryService(db)
    
    # In a real app, file_path would be downloaded from doc.file_url or S3.
    # We pass a dummy path or create a dummy file for the ELA check if it's an image.
    file_path = doc.file_url or ""
    
    # Mocking a real image for ELA if it's supposed to be an image
    if file_path.endswith('.jpg') and not os.path.exists(file_path):
        from PIL import Image
        img = Image.new('RGB', (100, 100), color = 'red')
        img.save(file_path)
        
    # Same for PDF
    if file_path.endswith('.pdf') and not os.path.exists(file_path):
        from pypdf import PdfWriter
        writer = PdfWriter()
        writer.add_blank_page(width=100, height=100)
        writer.write(file_path)

    report = await service.analyze_document(
        file_path=file_path,
        doc_type=doc.doc_type,
        extracted_fields=doc.extracted_fields or {},
        uploader_id=str(doc.bidder_id),  # Mocking uploader_id as bidder_id
        document_id=id,
        bidder_id=str(doc.bidder_id)
    )
    
    return report

@router.get("/{id}/authenticity")
async def get_authenticity(id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(DocumentAuthenticityCheck).filter(DocumentAuthenticityCheck.document_id == uuid.UUID(id)))
    checks = result.scalars().all()
    
    overall_status = "verified"
    for c in checks:
        if c.status == 'fail':
            overall_status = 'flagged'
            break
        elif c.status == 'needs_review' and overall_status != 'flagged':
            overall_status = 'needs_review'
            
    return {
        "authenticityStatus": overall_status,
        "checks": [{
            "check_type": c.check_type,
            "status": c.status,
            "detail": c.detail,
            "evidence_path": c.evidence_path,
            "checked_at": c.checked_at
        } for c in checks]
    }
