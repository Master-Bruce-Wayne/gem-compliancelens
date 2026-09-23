import hashlib
import json
import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from app.db.models.audit_log import AuditLog

class AuditService:
    @staticmethod
    async def log_event(db: AsyncSession, event_type: str, actor_id: uuid.UUID, details: dict, bid_id: uuid.UUID = None):
        # 1. Get previous hash
        result = await db.execute(select(AuditLog).order_by(desc(AuditLog.created_at)).limit(1))
        last_log = result.scalars().first()
        prev_hash = last_log.hash if last_log and last_log.hash else "GENESIS_BLOCK"
        
        # 2. Create deterministic string of current event
        new_id = uuid.uuid4()
        payload = {
            "id": str(new_id),
            "event_type": event_type,
            "actor_id": str(actor_id),
            "details": details,
            "previous_hash": prev_hash
        }
        payload_str = json.dumps(payload, sort_keys=True)
        
        # 3. Compute SHA-256 hash
        current_hash = hashlib.sha256(payload_str.encode('utf-8')).hexdigest()
        
        # 4. Save to DB
        audit = AuditLog(
            id=new_id,
            bid_id=bid_id,
            event_type=event_type,
            actor_id=actor_id,
            details=details,
            previous_hash=prev_hash,
            hash=current_hash
        )
        db.add(audit)
        return audit
