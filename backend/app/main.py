from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text
from app.config import settings
from app.api import documents, tenders, bids, self_check, auth, bidders, clarifications, notifications
import logging

app = FastAPI(title="GemOne API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    try:
        engine = create_async_engine(settings.DATABASE_URL, connect_args={"statement_cache_size": 0})
        async with engine.begin() as conn:
            await conn.execute(text("ALTER TABLE tenders ADD COLUMN IF NOT EXISTS tender_no VARCHAR;"))
            await conn.execute(text("ALTER TABLE tenders ADD COLUMN IF NOT EXISTS access_type VARCHAR DEFAULT 'public';"))
            await conn.execute(text("ALTER TABLE tenders ADD COLUMN IF NOT EXISTS closing_date TIMESTAMP WITH TIME ZONE;"))
            await conn.execute(text("ALTER TABLE tenders ADD COLUMN IF NOT EXISTS est_value NUMERIC;"))
            await conn.execute(text("ALTER TABLE tenders ADD COLUMN IF NOT EXISTS emd_amount NUMERIC;"))
            await conn.execute(text("ALTER TABLE bidders ADD COLUMN IF NOT EXISTS gstin VARCHAR;"))
            await conn.execute(text("CREATE UNIQUE INDEX IF NOT EXISTS ix_tenders_tender_no ON tenders(tender_no);"))
            try:
                await conn.execute(text("ALTER TYPE doc_source_enum ADD VALUE IF NOT EXISTS 'upload';"))
            except Exception:
                try:
                    await conn.execute(text("CREATE TYPE doc_source_enum AS ENUM ('upload', 'digilocker');"))
                except Exception:
                    pass
            await conn.execute(text("ALTER TABLE bidder_documents ADD COLUMN IF NOT EXISTS source doc_source_enum DEFAULT 'upload';"))
            await conn.execute(text("ALTER TABLE bidder_documents ADD COLUMN IF NOT EXISTS digilocker_request_id VARCHAR;"))
            await conn.execute(text("ALTER TABLE bidder_documents ADD COLUMN IF NOT EXISTS digital_signature_valid BOOLEAN;"))
            await conn.execute(text("ALTER TABLE bidder_documents ADD COLUMN IF NOT EXISTS confirmed_fields JSONB;"))
            await conn.execute(text("ALTER TABLE bidder_documents ADD COLUMN IF NOT EXISTS is_temporary BOOLEAN DEFAULT FALSE;"))
            try:
                await conn.execute(text("ALTER TYPE bid_status_enum ADD VALUE IF NOT EXISTS 'access_pending';"))
            except Exception:
                pass
            try:
                await conn.execute(text("ALTER TYPE bid_status_enum ADD VALUE IF NOT EXISTS 'access_denied';"))
            except Exception:
                pass
    except Exception as e:
        logging.error(f"Migration failed: {e}")

@app.get("/health")
async def health_check():
    return {"status": "ok"}

app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(documents.router, prefix="/api/v1/documents", tags=["documents"])
app.include_router(tenders.router, prefix="/api/v1/tenders", tags=["tenders"])
app.include_router(bids.router, prefix="/api/v1/bids", tags=["bids"])
app.include_router(bidders.router, prefix="/api/v1/bidders", tags=["bidders"])
app.include_router(self_check.router, prefix="/api/v1/self-check", tags=["self-check"])
app.include_router(clarifications.router, prefix="/api/v1/clarifications", tags=["clarifications"])
app.include_router(notifications.router, prefix="/api/v1/notifications", tags=["notifications"])
