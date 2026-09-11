import asyncio
import json
import uuid
import argparse
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import AsyncSessionLocal
from app.db.models import User, Tender, TenderRule, Bidder, BidderDocument, MockRegistryResponse

async def seed_data(file_path: str):
    with open(file_path, "r") as f:
        data = json.load(f)

    async with AsyncSessionLocal() as session:
        # Clear existing data for a clean seed
        # In a real app, careful with cascading deletes. For hackathon it's fine to just insert or ignore.

        # Seed Users
        for u in data.get("users", []):
            user = User(
                email=u["email"],
                password_hash="hashed_password",  # Just a dummy hash
                role=u["role"],
                full_name=u["full_name"]
            )
            session.add(user)
        
        # Seed Tenders
        for t in data.get("tenders", []):
            tender_id = uuid.UUID(t["id"].replace("tender-cpcl-2026-", "00000000-0000-0000-0000-00000000"))
            tender = Tender(
                id=tender_id,
                title=t["title"],
                organization=t["organization"],
                category=t["category"],
                status=t["status"]
            )
            session.add(tender)
            for r in t.get("rules", []):
                rule = TenderRule(
                    tender_id=tender_id,
                    clause_type=r["clause_type"],
                    threshold_value=r.get("threshold_value"),
                    mandatory=r.get("mandatory", True)
                )
                session.add(rule)

        # Seed Bidders
        for b in data.get("bidders", []):
            bidder_id = uuid.UUID(b["id"].replace("bidder-", "").ljust(32, '0')[:32])
            bidder = Bidder(
                id=bidder_id,
                legal_name=b["legal_name"],
                pan=b["pan"],
                is_demo_profile=True,
                demo_profile_key=b.get("demo_profile_key"),
                local_content_pct_declared=b.get("local_content_pct_declared"),
                annual_turnover_inr=b.get("annual_turnover_inr")
            )
            session.add(bidder)

            # Seed Documents
            for d in b.get("documents", []):
                doc = BidderDocument(
                    bidder_id=bidder_id,
                    doc_type=d["doc_type"],
                    extracted_fields=d.get("extracted_fields"),
                    ocr_status="done"
                )
                session.add(doc)

            # Seed Mock Registry Responses
            mock_res = b.get("mock_registry_responses", {})
            for reg_type, payload in mock_res.items():
                mock_entry = MockRegistryResponse(
                    bidder_id=bidder_id,
                    registry_type=reg_type,
                    response_payload=payload
                )
                session.add(mock_entry)

        await session.commit()
        print("Seed data loaded successfully!")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Seed database")
    parser.add_argument("--file", type=str, default="/seed_data.json", help="Path to seed_data.json")
    args = parser.parse_args()
    asyncio.run(seed_data(args.file))
