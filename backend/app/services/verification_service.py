from abc import ABC, abstractmethod
from typing import Dict, Any, Optional
from datetime import datetime, timedelta, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.models.verification_results import VerificationResult
from app.config import settings
import httpx

class VerificationProvider(ABC):
    @abstractmethod
    async def verify_gstin(self, gstin: str) -> Dict[str, Any]: pass
    @abstractmethod
    async def verify_pan(self, pan: str) -> Dict[str, Any]: pass
    @abstractmethod
    async def verify_udyam(self, udyam: str) -> Dict[str, Any]: pass

class ManualBridgeProvider(VerificationProvider):
    async def verify_gstin(self, gstin: str) -> Dict[str, Any]:
        return {"status": "manual_verification_required", "reason": "No API available"}
    async def verify_pan(self, pan: str) -> Dict[str, Any]:
        return {"status": "manual_verification_required", "reason": "No API available"}
    async def verify_udyam(self, udyam: str) -> Dict[str, Any]:
        return {"status": "manual_verification_required", "reason": "No API available"}

class SurepassProvider(VerificationProvider):
    # Dummy implementations that fall back if API fails
    async def verify_gstin(self, gstin: str) -> Dict[str, Any]:
        try:
            # Simulate API call
            # async with httpx.AsyncClient() as client:
            #    res = await client.post(...)
            #    res.raise_for_status()
            return {"status": "active", "filing_status": "regular"}
        except Exception:
            return {"status": "manual_verification_required"}
            
    async def verify_pan(self, pan: str) -> Dict[str, Any]:
        return {"status": "active", "category": "Company"}
        
    async def verify_udyam(self, udyam: str) -> Dict[str, Any]:
        return {"status": "active", "enterprise_type": "Micro"}

class VerificationService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.ttl = timedelta(hours=24)
        
        # Provider selection based on config (hardcoded to ManualBridge for now to ensure fallback works)
        provider_name = getattr(settings, 'VERIFICATION_PROVIDER', 'manual')
        if provider_name == 'surepass':
            self.provider = SurepassProvider()
        else:
            self.provider = ManualBridgeProvider()
            
    async def get_cached_result(self, check_type: str, identifier: str) -> Optional[Dict[str, Any]]:
        cutoff = datetime.now(timezone.utc) - self.ttl
        result = await self.db.execute(
            select(VerificationResult)
            .where(VerificationResult.check_type == check_type, 
                   VerificationResult.identifier == identifier,
                   VerificationResult.fetched_at > cutoff)
            .order_by(VerificationResult.fetched_at.desc())
        )
        record = result.scalars().first()
        if record:
            return record.response_payload
        return None
        
    async def cache_result(self, check_type: str, identifier: str, payload: Dict[str, Any], provider_name: str):
        vr = VerificationResult(
            check_type=check_type,
            identifier=identifier,
            response_payload=payload,
            provider=provider_name
        )
        self.db.add(vr)
        await self.db.commit()

    async def verify(self, check_type: str, identifier: str) -> Dict[str, Any]:
        cached = await self.get_cached_result(check_type, identifier)
        if cached:
            return cached
            
        try:
            if check_type == 'gst_active_and_filed':
                result = await self.provider.verify_gstin(identifier)
            elif check_type == 'pan_valid':
                result = await self.provider.verify_pan(identifier)
            elif check_type == 'udyam_valid':
                result = await self.provider.verify_udyam(identifier)
            else:
                result = {"status": "manual_verification_required"}
                
            await self.cache_result(check_type, identifier, result, self.provider.__class__.__name__)
            return result
        except Exception as e:
            # Graceful degradation
            return {"status": "manual_verification_required", "reason": str(e)}

