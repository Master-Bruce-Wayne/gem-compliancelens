import os
import uuid
import datetime
from abc import ABC, abstractmethod
from typing import Dict, Any
from app.config import settings

class DigiLockerProvider(ABC):
    @abstractmethod
    async def initiate_consent(self, bidder_id: str, doc_type: str) -> Dict[str, Any]:
        """Returns { consentUrl, requestId }"""
        pass

    @abstractmethod
    async def pull_document(self, request_id: str) -> Dict[str, Any]:
        """
        Returns: {
            "issuer": str,
            "docType": str,
            "issuedDate": str,
            "uri": str,
            "digitalSignatureValid": bool,
            "rawDocumentBase64": str,
            "source": str
        }
        """
        pass

class DigiLockerStubProvider(DigiLockerProvider):
    async def initiate_consent(self, bidder_id: str, doc_type: str) -> Dict[str, Any]:
        return {
            "consentUrl": f"/vendor/digilocker-consent?req={uuid.uuid4()}",
            "requestId": str(uuid.uuid4())
        }

    async def pull_document(self, request_id: str) -> Dict[str, Any]:
        # Return a simulated successful response using a seeded demo document concept.
        # In this stub, we won't return actual raw Base64 unless required, 
        # but to keep it simple, we simulate the structure.
        return {
            "issuer": "Income Tax Department",
            "docType": "PAN Verification Record",
            "issuedDate": datetime.datetime.now().isoformat(),
            "uri": f"did:digilocker:in.gov.pan:{uuid.uuid4()}",
            "digitalSignatureValid": True,
            "rawDocumentBase64": "dummy_base64_string",
            "source": "digilocker_demo"
        }

class DigiLockerLiveProvider(DigiLockerProvider):
    async def initiate_consent(self, bidder_id: str, doc_type: str) -> Dict[str, Any]:
        raise NotImplementedError("Requires DIGILOCKER_CLIENT_ID and DIGILOCKER_CLIENT_SECRET once partner approval is granted")

    async def pull_document(self, request_id: str) -> Dict[str, Any]:
        raise NotImplementedError("Requires DIGILOCKER_CLIENT_ID and DIGILOCKER_CLIENT_SECRET once partner approval is granted")

def get_digilocker_provider() -> DigiLockerProvider:
    mode = os.getenv("DIGILOCKER_MODE", "stub")
    if mode == "live":
        return DigiLockerLiveProvider()
    return DigiLockerStubProvider()
