from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import documents, tenders, bids, self_check, auth, bidders, clarifications, notifications

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

app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(documents.router, prefix="/api/v1/documents", tags=["documents"])
app.include_router(tenders.router, prefix="/api/v1/tenders", tags=["tenders"])
app.include_router(bids.router, prefix="/api/v1/bids", tags=["bids"])
app.include_router(bidders.router, prefix="/api/v1/bidders", tags=["bidders"])
app.include_router(self_check.router, prefix="/api/v1/self-check", tags=["self-check"])
app.include_router(clarifications.router, prefix="/api/v1/clarifications", tags=["clarifications"])
app.include_router(notifications.router, prefix="/api/v1/notifications", tags=["notifications"])
