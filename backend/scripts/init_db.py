import asyncio
import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db.session import SessionLocal
from app.db.models.users import User
from app.db.models.tenders import Tender
from app.db.models.tender_rules import TenderRule
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def init_db():
    async with SessionLocal() as db:
        # Create default officer
        hashed_password = pwd_context.hash("Officer@Demo123")
        officer = User(
            email="officer.demo@cpcl.gov.in",
            password_hash=hashed_password,
            role="officer",
            full_name="Chief Procurement Officer"
        )
        db.add(officer)
        
        # Create default tender
        tender = Tender(
            title="Supply of Industrial Valves (1500 Class)",
            organization="CPCL",
            category="Goods",
            status="evaluation"
        )
        db.add(tender)
        await db.flush()
        
        # Add Rules
        rules = [
            TenderRule(tender_id=tender.id, clause_type="gst_active_and_filed", mandatory=True),
            TenderRule(tender_id=tender.id, clause_type="pan_valid", mandatory=True),
            TenderRule(tender_id=tender.id, clause_type="udyam_valid", mandatory=True),
            TenderRule(tender_id=tender.id, clause_type="epfo_esic_compliance", mandatory=True),
            TenderRule(tender_id=tender.id, clause_type="not_debarred", mandatory=True),
            TenderRule(tender_id=tender.id, clause_type="local_content_pct", threshold_value=20, mandatory=True),
            TenderRule(tender_id=tender.id, clause_type="turnover_threshold_inr", threshold_value=50000000, mandatory=True),
        ]
        db.add_all(rules)
        
        await db.commit()
        print("Database initialized with default officer and tender.")

if __name__ == "__main__":
    asyncio.run(init_db())
