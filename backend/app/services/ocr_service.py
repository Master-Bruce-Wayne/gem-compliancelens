import re
import pdfplumber
import pytesseract
from pdf2image import convert_from_path
from typing import Dict, Any, Tuple
import os

class OCRService:
    # Regex patterns
    PATTERNS = {
        'gstin': r'\d{2}[A-Z]{5}\d{4}[A-Z]\d[Z][A-Z\d]',
        'pan': r'[A-Z]{5}\d{4}[A-Z]',
        'udyam': r'UDYAM-[A-Z]{2}-\d{2}-\d{7}',
        'date': r'(\d{2}/\d{2}/\d{4}|\d{2}-\d{2}-\d{4}|\d{2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4})'
    }

    @staticmethod
    def extract_text_from_pdf(file_path: str) -> Tuple[str, str]:
        """Returns extracted text and method used ('pdfplumber' or 'tesseract')"""
        text = ""
        try:
            with pdfplumber.open(file_path) as pdf:
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"
        except Exception as e:
            pass # Fallback to tesseract

        if len(text.strip()) > 50:
            return text, 'pdfplumber'
            
        # Fallback to Tesseract
        try:
            images = convert_from_path(file_path)
            tess_text = ""
            for img in images:
                tess_text += pytesseract.image_to_string(img) + "\n"
            return tess_text, 'tesseract'
        except Exception as e:
            return "", 'failed'
            
    @staticmethod
    def extract_text_from_image(file_path: str) -> Tuple[str, str]:
        try:
            from PIL import Image
            img = Image.open(file_path)
            text = pytesseract.image_to_string(img)
            return text, 'tesseract'
        except Exception as e:
            return "", 'failed'

    @classmethod
    def extract_fields(cls, file_path: str, doc_type: str) -> Dict[str, Any]:
        if file_path.lower().endswith('.pdf'):
            text, method = cls.extract_text_from_pdf(file_path)
        else:
            text, method = cls.extract_text_from_image(file_path)
            
        if not text.strip() or method == 'failed':
            return {"status": "extraction_failed", "fields": {}, "method": "none"}
            
        fields = {}
        confidence_base = "high" if method == 'pdfplumber' else "medium"
        
        # Extraction logic based on doc_type
        if doc_type == 'gst_certificate':
            match = re.search(cls.PATTERNS['gstin'], text)
            if match:
                fields['gstin'] = {"value": match.group(0), "confidence": confidence_base}
                
        elif doc_type == 'pan':
            match = re.search(cls.PATTERNS['pan'], text)
            if match:
                fields['pan'] = {"value": match.group(0), "confidence": confidence_base}
                
        elif doc_type == 'udyam_certificate':
            match = re.search(cls.PATTERNS['udyam'], text)
            if match:
                fields['udyam_registration_number'] = {"value": match.group(0), "confidence": confidence_base}
                
        # Dates (extract all found dates, could be refined)
        dates = re.findall(cls.PATTERNS['date'], text)
        if dates:
            fields['dates'] = {"value": dates, "confidence": confidence_base}
            
        if not fields:
            return {"status": "extraction_failed", "fields": {}, "method": method}
            
        return {"status": "success", "fields": fields, "method": method}
