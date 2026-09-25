import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text
from app.config import settings

async def run_migration():
    engine = create_async_engine(settings.DATABASE_URL.replace("db", "localhost"), connect_args={"statement_cache_size": 0})
    async with engine.begin() as conn:
        print("Adding tender_no and access_type to tenders table...")
        await conn.execute(text("ALTER TABLE tenders ADD COLUMN IF NOT EXISTS tender_no VARCHAR;"))
        await conn.execute(text("ALTER TABLE tenders ADD COLUMN IF NOT EXISTS access_type VARCHAR DEFAULT 'public';"))
        
        print("Creating unique index on tender_no...")
        await conn.execute(text("CREATE UNIQUE INDEX IF NOT EXISTS ix_tenders_tender_no ON tenders(tender_no);"))
        
        print("Adding new statuses to bid_status_enum...")
        try:
            await conn.execute(text("ALTER TYPE bid_status_enum ADD VALUE IF NOT EXISTS 'access_pending';"))
        except Exception as e:
            print(e)
        try:
            await conn.execute(text("ALTER TYPE bid_status_enum ADD VALUE IF NOT EXISTS 'access_denied';"))
        except Exception as e:
            print(e)
            
        print("Migration complete!")

if __name__ == "__main__":
    asyncio.run(run_migration())
