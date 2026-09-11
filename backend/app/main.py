from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import documents, mock_registry, tenders, bids, self_check

app = FastAPI(title="GeM ComplianceLens API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    return {"status": "ok"}

app.include_router(documents.router, prefix="/api/v1/documents", tags=["documents"])
app.include_router(mock_registry.router, prefix="/api/v1/mock-registry", tags=["mock-registry"])
app.include_router(tenders.router, prefix="/api/v1/tenders", tags=["tenders"])
app.include_router(bids.router, prefix="/api/v1/bids", tags=["bids"])
app.include_router(self_check.router, prefix="/api/v1/self-check", tags=["self-check"])
