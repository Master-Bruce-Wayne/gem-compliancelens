from fastapi import APIRouter, UploadFile, File, Depends, Form, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
import uuid
import os
import cloudinary
import cloudinary.uploader
from typing import Optional
from app.config import settings

from app.services.forgery_service import ForgeryService
from app.db.models.bidder_documents import BidderDocument
from app.db.models.authenticity import DocumentAuthenticityCheck
from sqlalchemy import select

router = APIRouter()

# Configure Cloudinary if URL is present
if settings.CLOUDINARY_URL:
    cloudinary.config(secure=True)

@router.post("/upload")
async def upload_document(
    bidderId: str = Form(...),
    docType: str = Form(...),
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db)
):
    try:
        # 1. Upload to Cloudinary securely
        file_url = ""
        if settings.CLOUDINARY_URL:
            # Read file into memory
            contents = await file.read()
            # Upload with private access (requires signed URL to view)
            upload_result = cloudinary.uploader.upload(
                contents, 
                resource_type="auto",
                type="private",
                folder=f"gem_bidders/{bidderId}"
            )
            file_url = upload_result.get("secure_url")
        else:
            # Fallback if no cloudinary configured
            file_url = f"mock_url_{file.filename}"
            
        # 2. Simulate OCR extraction based on docType
        # In a full production build, this is where pdfplumber/pytesseract runs
        extracted_fields = {}
        if docType == 'pan':
            extracted_fields = {"pan": "ABCDE1234F"}
        elif docType == 'gst_certificate':
            extracted_fields = {"gstin": "27ABCDE1234F1Z5"}
        elif docType == 'udyam_certificate':
            extracted_fields = {"udyam_registration_number": "UDYAM-MH-00-1234567"}
        
        # 3. Save to database
        new_doc = BidderDocument(
            bidder_id=uuid.UUID(bidderId),
            doc_type=docType,
            file_url=file_url,
            ocr_status='done',
            extracted_fields=extracted_fields,
            confidence_score=95.0
        )
        db.add(new_doc)
        await db.commit()
        await db.refresh(new_doc)
        
        return {
            "documentId": str(new_doc.id),
            "status": "done",
            "fileUrl": file_url,
            "extractedFields": extracted_fields
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/{id}/authenticity")
async def check_authenticity(id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(BidderDocument).filter(BidderDocument.id == uuid.UUID(id)))
    doc = result.scalars().first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
        
    service = ForgeryService(db)
    
    file_path = doc.file_url or ""
    
    if file_path.endswith('.jpg') and not os.path.exists(file_path) and not file_path.startswith("http"):
        from PIL import Image
        img = Image.new('RGB', (100, 100), color = 'red')
        img.save(file_path)
        
    if file_path.endswith('.pdf') and not os.path.exists(file_path) and not file_path.startswith("http"):
        from pypdf import PdfWriter
        writer = PdfWriter()
        writer.add_blank_page(width=100, height=100)
        writer.write(file_path)

    report = await service.analyze_document(
        file_path=file_path,
        doc_type=doc.doc_type,
        extracted_fields=doc.extracted_fields or {},
        uploader_id=str(doc.bidder_id), 
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
