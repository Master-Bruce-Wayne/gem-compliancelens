# 🏛️ GeM ComplianceLens
**Smart India Hackathon (SIH) '26 - AI-Powered Bid Compliance Verification for Government e-Marketplace (GeM)**

[![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-blue?logo=react)](#)
[![Backend](https://img.shields.io/badge/Backend-FastAPI-009688?logo=fastapi)](#)
[![Database](https://img.shields.io/badge/Database-PostgreSQL%20(Async)-336791?logo=postgresql)](#)
[![Deployment](https://img.shields.io/badge/Deployed_on-Vercel%20%26%20Render-black)](#)

---

## 📖 The Problem
Government procurement through the **Government e-Marketplace (GeM)** involves verifying multiple statutory, regulatory, and eligibility requirements (e.g., Udyam/MSME, GST, PAN, Make in India, EPFO, Debarment lists). 

Currently, this process is highly **document-intensive**, requiring procurement officers to manually cross-check information across multiple government portals. This results in significant manual effort, longer evaluation cycles, and high vulnerability to human error and forged documents.

## 💡 Our Solution: GeM ComplianceLens
**GeM ComplianceLens** is an end-to-end, AI-powered Bid Application Lifecycle platform. It automates the extraction and verification of statutory documents while keeping the final decision-making process strictly **deterministic** and fully auditable.

Instead of relying on LLMs to make black-box decisions, our platform uses AI for what it does best (vision, OCR, explanation) and relies on a rigid, state-machine-backed Rule Engine for compliance evaluation.

---

## 📊 Current Project Status (MVP - 100% Completed)
At this moment, the core MVP is fully developed, deployed, and operational. We have successfully implemented the end-to-end lifecycle for both Vendors and Procurement Officers:

✅ **Fully Operational Features:**
- **Role-Based Dashboards:** Distinct interfaces for Bidders (Vendors) and Procurement Officers.
- **Rule Engine Execution:** Officers can dynamically create Tender rules (e.g., minimum turnover, GST compliance), and the backend strictly enforces them.
- **Automated AI Extraction:** Documents uploaded by vendors are passed through our Python OCR pipeline to extract key metrics (PAN, GSTIN) automatically.
- **Clarification Loop:** The complete workflow for an officer to pause an evaluation, request manual clarification/documents from a vendor, and receive their response.
- **Manual Verification Bridge:** If the AI has low confidence in a blurry document, it safely degrades and forces a human officer to manually verify the document, recording the decision in the audit log.
- **Cloud Infrastructure:** Integrated with Cloudinary for secure document storage and deployed live on Vercel (Frontend) and Render (Backend).

---

## ✨ Key Features

- 🧠 **AI-Powered OCR Extraction:** Utilizes `pdfplumber` and `pytesseract` to extract structured data (GSTIN, PAN, Udyam No.) from uploaded Vendor documents. Includes a "graceful degradation" fallback forcing manual vendor confirmation if AI confidence is low.
- ⚙️ **Deterministic Rule Engine:** Procurement Officers set dynamic threshold rules (e.g., "Minimum Local Content 50%", "GST Active"). The engine mathematically evaluates these against the vendor's extracted data. No AI hallucinations.
- 🚨 **Multi-Layered Forgery Detection:** Analyzes uploaded files for digital tampering by inspecting Exif metadata, PDF creation trails, and pixel-level anomalies (Error Level Analysis).
- 🔄 **Integrated Clarification Loop:** If a bid is flagged as "Needs Review," officers can bounce the application back to the vendor with a clarification request. The vendor is notified, submits corrections/new docs, and the bid resumes evaluation.
- 🔒 **Secure Centralized Vault:** Vendors upload their statutory documents once to an encrypted Cloudinary vault. Documents are securely attached to individual tender applications without re-uploading.
- 📜 **Immutable Audit Trails:** Every single state transition, manual verification override, and evaluation score is securely logged in the PostgreSQL `audit_log` with the exact Timestamp and Actor ID.

---

## 🏗️ System Architecture

### Frontend (Vendor & Officer Portals)
- **Framework:** React 18 (TypeScript) + Vite
- **Styling:** Tailwind CSS + Shadcn UI + Lucide Icons
- **Routing:** React Router DOM (Role-Based Access Control)
- **Deployment:** Vercel

### Backend (REST API)
- **Framework:** FastAPI (Python 3.11+)
- **Database ORM:** SQLAlchemy 2.0 (Asyncpg) + Alembic Migrations
- **AI / OCR:** Tesseract-OCR, Poppler, pdf2image, pdfplumber
- **LLM Integration:** Anthropic Claude (Strictly for generating human-readable explanations of rule engine failures).
- **Deployment:** Render (Dockerized / Native Python)

### Infrastructure
- **Database:** PostgreSQL hosted on Supabase (Port 6543 PgBouncer connection pooled with `statement_cache_size=0` for async compatibility).
- **Storage:** Cloudinary (Private asset tier requiring signed URLs for access).

---

## 🗄️ Core Database Lifecycle
The system is built on a strict state machine to prevent IDOR and race conditions:

1. **Tenders:** (`draft` -> `open` -> `evaluation` -> `closed`)
2. **Bid Applications:** (`draft` -> `submitted` -> `under_evaluation` -> `clarification_requested` -> `qualified` / `disqualified`)
3. **Evaluations & Checks:** A snapshot of a Bid's compliance against the Tender Rules. Contains child `EvaluationCheck` rows for each rule.
4. **Manual Verifications:** Records of Officers manually overriding or confirming a `needs_review` system check.

---

## 🚀 Local Development Setup

### Prerequisites
- Node.js (v18+)
- Python (3.10+)
- PostgreSQL (or a Supabase project)
- **Tesseract OCR & Poppler** (Must be installed on your OS for the OCR engine to function).
  - *Mac:* `brew install tesseract poppler`
  - *Ubuntu:* `sudo apt-get install tesseract-ocr poppler-utils`

### 1. Clone & Environment setup
```bash
git clone https://github.com/Shubham15986/gem-compliancelens.git
cd gem-compliancelens
```

Create a `.env` file inside the `/backend` directory:
```env
DATABASE_URL=postgresql+asyncpg://postgres:[PASSWORD]@[HOST]:6543/postgres
JWT_SECRET=your_super_secret_jwt_key
CLOUDINARY_URL=cloudinary://[API_KEY]:[API_SECRET]@[CLOUD_NAME]
ANTHROPIC_API_KEY=sk-ant-api03-...
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Run Database Migrations (Creates all tables in PostgreSQL)
alembic upgrade head

# Start the FastAPI Server
uvicorn app.main:app --reload --port 8000
```
*API Docs available at `http://localhost:8000/docs`*

### 3. Frontend Setup
```bash
cd frontend
npm install

# Create frontend .env
echo "VITE_API_URL=http://localhost:8000" > .env

# Start React Dev Server
npm run dev
```
*Frontend available at `http://localhost:5173`*

---

## 🗺️ Next Implementations (Future Roadmap)
We have logged comprehensive architecture upgrade plans in our [GitHub Issues](https://github.com/Shubham15986/gem-compliancelens/issues). Our immediate next steps for scaling to a national level include:

### 1. Security & Governance Upgrades
- **Maker/Checker Workflow:** Implement a four-eyes principle requiring a Junior Officer to verify and a Senior Officer to approve high-value bids.
- **PII Encryption at Rest:** Implement column-level `pgcrypto` encryption for sensitive PAN and GSTIN data in the database.
- **Immutable Blockchain Audit:** Sync the PostgreSQL `audit_log` to an append-only ledger like Amazon QLDB to cryptographically guarantee that evaluation histories are tamper-proof.

### 2. Advanced AI Integration
- **Fine-Tuned LayoutLMv3:** Migrate from standard Tesseract OCR to a specialized LayoutLMv3 model fine-tuned specifically on Indian statutory documents (Udyam, GST, PAN) to handle severe document skew and low lighting.
- **Cross-Bidder Collusion Detection:** Implement graph-analytics background workers to flag competing bids that share identical IP addresses, MAC addresses, or overlapping stakeholder names to prevent cartel bidding.

### 3. Interoperability & DevOps
- **DigiLocker OAuth Integration:** Allow bidders to authenticate via DigiLocker to fetch verified, digitally-signed XML payloads directly from government registries, bypassing the need for OCR entirely.
- **AWS EC2 / ECS Migration:** Migrate the backend from Render to a dedicated AWS infrastructure to allow isolated Virtual Private Clouds (VPCs) and containerized GPU access for faster AI inference.
- **Webhook Architecture:** Develop webhooks to push real-time status updates (Bid Qualified, Clarification Requested) directly into internal Government ERP systems (SAP, Oracle).

---
*Built with ❤️ for Smart India Hackathon '26.*