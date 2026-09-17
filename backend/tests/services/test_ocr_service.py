import pytest
from app.services.ocr_service import OCRService

def test_gstin_extraction():
    # Write a test simulating pdfplumber returning some text
    # Since we can't easily mock pdfplumber here without setting up dummy PDFs,
    # we'll test the regex patterns directly or through a mocked extract_text_from_pdf
    
    class MockOCR(OCRService):
        @staticmethod
        def extract_text_from_pdf(path):
            return "This is a GST certificate. GSTIN is 27ABCDE1234F1Z5.", "pdfplumber"

    res = MockOCR.extract_fields("dummy.pdf", "gst_certificate")
    assert res["status"] == "success"
    assert "gstin" in res["fields"]
    assert res["fields"]["gstin"]["value"] == "27ABCDE1234F1Z5"
    assert res["fields"]["gstin"]["confidence"] == "high"

def test_pan_extraction():
    class MockOCR(OCRService):
        @staticmethod
        def extract_text_from_pdf(path):
            return "PAN card number: ABCDE1234F", "pdfplumber"

    res = MockOCR.extract_fields("dummy.pdf", "pan")
    assert res["status"] == "success"
    assert "pan" in res["fields"]
    assert res["fields"]["pan"]["value"] == "ABCDE1234F"

def test_udyam_extraction_fallback():
    class MockOCR(OCRService):
        @staticmethod
        def extract_text_from_image(path):
            return "Registration: UDYAM-MH-00-1234567", "tesseract"

    res = MockOCR.extract_fields("dummy.jpg", "udyam_certificate")
    assert res["status"] == "success"
    assert "udyam_registration_number" in res["fields"]
    assert res["fields"]["udyam_registration_number"]["value"] == "UDYAM-MH-00-1234567"
    assert res["fields"]["udyam_registration_number"]["confidence"] == "medium"

def test_extraction_failed():
    class MockOCR(OCRService):
        @staticmethod
        def extract_text_from_pdf(path):
            return "Just some random text without any identifiers", "pdfplumber"

    res = MockOCR.extract_fields("dummy.pdf", "pan")
    assert res["status"] == "extraction_failed"

