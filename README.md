# 💎 GemOne 
**AI-Powered Integrated Bid Compliance Verification Platform for GeM Procurement**  
*Built for Smart India Hackathon '26 (Problem Statement: 26100)*

![GemOne Architecture Demo](https://img.shields.io/badge/Status-Live_Prototype-success) ![Tech Stack](https://img.shields.io/badge/Stack-React_%7C_FastAPI_%7C_PostgreSQL-blue)

## 📖 The Problem
Public procurement in India involves massive transaction volumes. When vendors (bidders) apply for tenders, Procurement Officers must verify their statutory compliance documents (Udyam, GST, PAN, Income Tax, EPFO, Make in India, etc.). 

Currently, this process is highly **document-intensive**, requiring officers to manually cross-check information across 8-10 disconnected government portals. This results in significant manual effort (45-90 minutes per bidder), longer evaluation cycles, and a high risk of wrongly rejecting genuine MSMEs due to minor paperwork gaps rather than real ineligibility.

## 💡 Our Solution: GemOne
**GemOne** is an end-to-end, AI-powered Bid Application Lifecycle platform. It automates the extraction and verification of statutory documents while keeping the final decision-making process strictly **deterministic** and fully auditable.

Instead of relying on Generative AI to make black-box decisions, our platform uses AI for what it does best (vision, OCR, explanation) and relies on a rigid, mathematical **Abstract Syntax Tree (AST) Rule Engine** for compliance evaluation. 

**The AI verifies. The Rule Engine evaluates. The Officer decides.**

---

## ✨ Key Features & The "X-Factor"

1. **The Global Compliance Vault & Smart Gatekeeper**
   Vendors upload core documents (PAN, GST) once to a persistent, secure vault for endless reuse. When a vendor applies to a tender, our **Smart Gatekeeper** algorithm cross-references the Officer's required rules against the Vendor's Vault. If a document is missing, submission is dynamically blocked, forcing an inline upload. This guarantees **0% incomplete applications** ever reach the officer.

2. **Deterministic Rule Engine (No Hallucinations)**
   Procurement Officers set dynamic threshold rules (e.g., "Minimum Local Content > 50%"). The engine mathematically evaluates these against the vendor's extracted data. No AI hallucinations during financial evaluation.

3. **Private Passwords & Market Exclusivity**
   Enterprise procurement requires closed-door bidding. Officers can toggle a tender to "Private" and lock it with a cryptographic password, instantly bypassing clunky manual approval queues for restricted vendors.

4. **Custom "Wildcard" Document Requests (AI Bypass)**
   Officers are never restricted by the AI. They can require arbitrary custom documents (e.g., "Financial Audit 2024"). The system forces the vendor to upload it, intelligently bypasses the OCR engine, and routes it directly to a "Needs Manual Review" queue.

5. **Graceful Degradation (The 3-Strike Rule)**
   Most automated systems are binary—if the AI fails to read the document, the user is locked out. GemOne features a resilient 3-strike fallback bridge. If the AI fails to extract data 3 times due to a blurry scan, it gracefully degrades to a "Manual Review Queue" for the Officer. **Zero operational downtime.**

6. **Immutable Cryptographic Audit Trail (Pseudo-Blockchain)**
   Every single action (tender creation, application submission, evaluation) is logged in a PostgreSQL `audit_log` table. Every new row computes a **SHA-256 hash chaining the previous row's hash**. This creates an un-tamperable pseudo-blockchain, proving to CVC/CAG auditors that the platform is immune to internal data tampering.

---

## 🏗️ System Architecture

### Frontend (Vendor & Officer Portals)
- **Framework:** React 18 (TypeScript) + Vite
- **Styling:** Tailwind CSS + Lucide Icons
- **State/Routing:** React Router DOM (Strict Role-Based Access Control)
- **Deployment:** Vercel (Edge Network)

### Backend (REST API)
- **Framework:** FastAPI (Python 3.11+ / ASGI Concurrency)
- **Database ORM:** SQLAlchemy 2.0 (Asyncpg driver)
- **AI / OCR Pipeline:** `tesseract-ocr`, `pdfplumber`, `pdf2image`, Pillow
- **LLM Integration:** Google Gemini API (`gemini-1.5-flash` with automatic fallback to `gemini-pro`). Used *strictly* for translating math results into human-readable explanations.
- **Deployment:** Render (Dockerized Linux Container)

### Infrastructure & Security
- **Database:** PostgreSQL hosted on Supabase (Port 6543 PgBouncer connection pooled).
- **Storage:** Cloudinary (Private asset tier requiring signed URLs).
- **Security:** JWT (HS256) Authentication, `bcrypt` password hashing, Cryptographic Hash Chaining.

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
GEMINI_API_KEY=AIzaSyB...
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Run Database Migrations
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
*Making Public Procurement Faster, Fairer & Fully Auditable.*
