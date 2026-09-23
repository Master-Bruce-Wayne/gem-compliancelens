from fastapi import APIRouter, UploadFile, File, Depends, Form, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
import uuid
import os
import cloudinary
import cloudinary.uploader
from typing import Optional
from app.config import settings

from app.services.ocr_service import OCRService
import tempfile
import shutil
from app.services.forgery_service import ForgeryService
from app.db.models.bidder_documents import BidderDocument
from app.db.models.authenticity import DocumentAuthenticityCheck
from sqlalchemy import select

router = APIRouter()

# Configure Cloudinary if URL is present
import re
if settings.CLOUDINARY_URL:
    # Explicitly parse the URL in case it's not in os.environ but in pydantic settings
    match = re.match(r"cloudinary://([^:]+):([^@]+)@(.+)", settings.CLOUDINARY_URL.strip('"\''))
    if match:
        cloudinary.config(
            api_key=match.group(1),
            api_secret=match.group(2),
            cloud_name=match.group(3),
            secure=True
        )

@router.post("/upload")
async def upload_document(
    bidderId: str = Form(...),
    docType: str = Form(...),
    file: UploadFile = File(...),
    force_manual: bool = Form(False),
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
            raise HTTPException(status_code=500, detail="Cloudinary is not configured. Document storage is unavailable.")
            
        # 2. Real OCR extraction
        import tempfile
        import os
        
        # Save uploaded file temporarily for OCR processing
        _, temp_path = tempfile.mkstemp(suffix=".pdf" if file.filename.lower().endswith(".pdf") else ".jpg")
        try:
            with open(temp_path, "wb") as temp_file:
                temp_file.write(contents)
            
            ocr_result = OCRService.extract_fields(temp_path, docType)
        finally:
            os.remove(temp_path)
            
        if ocr_result["status"] == "extraction_failed":
            if not force_manual:
                raise HTTPException(status_code=422, detail={"error": "OCR_REJECTED", "message": "Extraction failed. Please ensure the document is clear and readable."})
            else:
                extracted_fields = {}
                confidence_base = "low"
        else:
            extracted_fields = ocr_result["fields"]
            confidence_base = "high" if ocr_result.get("method") == "pdfplumber" else "medium"
        
        needs_confirmation = False
        if confidence_base == "low":
            needs_confirmation = True
            
        expected_fields = []
        if docType == 'pan': expected_fields = ['pan']
        elif docType == 'gst_certificate': expected_fields = ['gstin']
        elif docType == 'udyam_certificate': expected_fields = ['udyam_registration_number']
        
        missing = []
        for field in expected_fields:
            if field not in extracted_fields:
                missing.append(field)
                needs_confirmation = True
        
        if needs_confirmation and not force_manual:
            raise HTTPException(status_code=422, detail={
                "error": "OCR_REJECTED", 
                "message": f"The uploaded document is blurry or missing required fields. Missing: {', '.join(missing) if missing else 'None'}. Low confidence.",
                "missing_fields": missing
            })
            
        final_status = "pending" if (needs_confirmation or force_manual) else "done"
        
        # 3. Save to database
        new_doc = BidderDocument(
            bidder_id=uuid.UUID(bidderId),
            doc_type=docType,
            file_url=file_url,
            ocr_status=final_status,
            extracted_fields=extracted_fields,
            confidence_score=95.0 if confidence_base == "high" else (70.0 if confidence_base == "medium" else 40.0)
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
        
    except HTTPException as he:
        raise he
    except Exception as e:
        msg = str(e)
        if "api_key" in msg.lower() or "configure cloudinary" in msg.lower() or "invalid" in msg.lower():
            msg = f"Cloudinary error: {msg}. Please check your CLOUDINARY_URL format in Render (it should be cloudinary://API_KEY:API_SECRET@CLOUD_NAME)."
        raise HTTPException(status_code=500, detail=msg)

@router.post("/{id}/authenticity")
async def check_authenticity(id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(BidderDocument).filter(BidderDocument.id == uuid.UUID(id)))
    doc = result.scalars().first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    if str(doc.bidder_id) != req.bidderId:
        raise HTTPException(status_code=403, detail="Access denied")
        
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

from pydantic import BaseModel
class DocumentConfirmRequest(BaseModel):
    confirmed_fields: dict
    bidderId: str

@router.post("/{id}/confirm")
async def confirm_document(id: str, req: DocumentConfirmRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(BidderDocument).filter(BidderDocument.id == uuid.UUID(id)))
    doc = result.scalars().first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    if str(doc.bidder_id) != req.bidderId:
        raise HTTPException(status_code=403, detail="Access denied")
        
    doc.confirmed_fields = req.confirmed_fields
    doc.ocr_status = 'done'
    
    # Write to audit_log
    from app.db.models.audit_log import AuditLog
    audit = AuditLog(
        bid_id=None,
        event_type='document_correction',
        actor_id=uuid.UUID(req.bidderId),
        details={
            "document_id": id,
            "original_fields": doc.extracted_fields,
            "confirmed_fields": req.confirmed_fields
        }
    )
    db.add(audit)
    
    await db.commit()
    return {"status": "done", "confirmedFields": doc.confirmed_fields}

@router.delete("/{id}")
async def delete_document(id: str, bidderId: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(BidderDocument).filter(BidderDocument.id == uuid.UUID(id)))
    doc = result.scalars().first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    if str(doc.bidder_id) != bidderId:
        raise HTTPException(status_code=403, detail="Access denied")
        
    await db.delete(doc)
    
    # Write to audit_log
    from app.db.models.audit_log import AuditLog
    audit = AuditLog(
        bid_id=None,
        event_type='document_deleted',
        actor_id=uuid.UUID(bidderId),
        details={
            "document_id": id,
            "doc_type": doc.doc_type
        }
    )
    db.add(audit)
    
    await db.commit()
    return {"status": "deleted"}
