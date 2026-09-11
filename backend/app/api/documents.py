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
