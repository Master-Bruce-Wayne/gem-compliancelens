# GeM ComplianceLens
## Master Project Document
**SIH 26100 — AI-Powered Integrated Bid Compliance Verification Platform for GeM Procurement**
*Ministry of Petroleum & Natural Gas · Chennai Petroleum Corporation Limited (CPCL) · Theme: Smart Automation*

This is the single, up-to-date source of truth for the project — every decision made during ideation is captured here, including the real-data verification approach, document authenticity strategy, DigiLocker integration status, and recent architectural enhancements (Cloudinary, Role-based Gateways).

---

## 1. Problem Statement
**PS ID:** 26100  |  **Category:** Software  |  **Theme:** Smart Automation
**Organization:** Ministry of Petroleum & Natural Gas → Chennai Petroleum Corporation Limited (CPCL)

**In plain language:**
When a company bids on a government tender through GeM, a procurement officer has to manually confirm the bidder is legally and statutorily eligible — checking Udyam/MSME registration, GST registration and filing, PAN, EPFO/ESIC compliance, Make in India/local content, Startup India, NSIC, OEM authorization, and blacklisting/debarment status. Today this means logging into 8–10 separate government portals per bidder, cross-referencing documents by hand, with no single source of truth, no audit trail, and real risk of human error and inconsistent decisions.

**Hidden sub-problems most teams miss:**
- The AI cannot have final decision authority — but the tool still needs to feel trustworthy, or officers will ignore it and revert to manual work.
- Explainability is the real hard problem, not extraction — a black-box score is useless to an auditor (CVC/CAG) asking 'why'.
- Tender-specific eligibility criteria are not standardized — someone has to translate free-text tender clauses into structured checks.
- False negatives are more dangerous than false positives — a wrongly-flagged genuine MSME loses an opportunity and may litigate.
- Most real-world rejections trace back to bidders submitting the wrong/stale document, not fraud — a bidder-side self-check could pre-empt much of the officer's workload.

---

## 2. Our Idea
**Elevator pitch:**
GeM ComplianceLens is one screen that does the checking automatically. Officers upload or select a bidder's documents, and the system verifies them against real government sources, then shows a plain-language Compliance Scorecard — a score, a risk level, and a clear Compliant / Non-Compliant / Needs Review status for every requirement, each with evidence and a reason. The officer always makes the final call — the tool just makes that call faster, easier, and defensible later.

**Key innovation — why this is different:**
- **Explains every answer:** Plain-language reasoning with sourced evidence, not a black-box score. 
- **Protects genuine bidders:** A three-state verdict (Compliant / Non-Compliant / Needs Review) means an unclear or ambiguous case is never silently auto-rejected.
- **Officer stays in control:** The AI recommends, a human always decides and is logged doing so.
- **Bidder self-check mode:** Companies can check their own compliance before submitting, getting a preliminary approval score to catch avoidable paperwork gaps.
- **Reusable across CPSEs:** Designed so any government company can plug in their own bidder documents.

---

## 3. Full Feature List
**Core (MVP / hackathon build)**
| Feature | What it does |
|---|---|
| **Role-Based Gateways** | JWT-authenticated split portals: `/officer` dashboard for review and `/bidder` dashboard for submission. |
| **Document upload + auto-read** | Secure Cloudinary upload for PAN, GST, Udyam, EPFO/ESIC; system extracts key fields automatically via OCR. |
| **Real-source verification** | Checks bidder data against real government sources (no mock data). |
| **Tender-specific rule setup** | Officer selects eligibility clauses for a specific tender (e.g. local content %, turnover threshold). |
| **Compliance rule engine** | Fixed, deterministic logic evaluates every rule. |
| **Compliance scorecard** | Score /100, risk level (Low/Med/High), red/amber/green breakdown. Includes **1-Click Manual Verification Links** to official portals. |
| **"Why" explanations** | Click any check to see the evidence, source, timestamp, and a plain-language reason. |
| **AI recommendation + officer decision** | System suggests Qualify/Disqualify/Clarify; officer makes and records the final call. |
| **Audit trail** | Permanent, uneditable log of every document, check, and decision — who, what, when. |
| **Bidder self-check** | Simplified version letting a company generate a self-score before submitting. |
| **Document authenticity checks** | Metadata forensics, template/QR checks, ELA, and AI logical consistency (See Section 5). |

---

## 4. Document Verification Approach — Real Data, No Mock Dataset
The system verifies all 9 statutory checks against real government sources — some fully automated, some human-assisted.

**Automated (via free-trial verification providers)**
- GST registration + return filing status
- PAN validity
- Udyam/MSME registration
- MCA21 company details (where the bidder is a Pvt Ltd/LLP)

**Manual-Verify-Bridge (real portal, officer confirms)**
The system generates a **pre-filled 1-click link** to the real government portal inside the Scorecard UI. The officer opens it, sees the real result, and confirms the outcome. 
- EPFO compliance (epfindia.gov.in)
- ESIC compliance (esic.gov.in)
- Startup India / DPIIT recognition (startupindia.gov.in)
- NSIC registration (nsic.co.in)
- CPPP debarment/blacklisting status (eprocure.gov.in)

**Document-only (not verifiable by any registry)**
- Make in India / local content % — self-declared, sometimes backed by a CA certificate.
- OEM authorization — a private manufacturer letter.

---

## 5. Document Authenticity & Forgery Detection
A layered approach. Uncertain cases always route to human review rather than being auto-rejected.

| Layer | What it does | Build it now? |
|---|---|---|
| **Registry cross-check** | Claim (e.g. GST Active) doesn't match government source → flagged. | Yes |
| **Metadata & forensics** | Checks PDF creator/producer fields, expected QR code position, font consistency. | Yes |
| **Error Level Analysis (ELA)** | Pixel-level manipulation detection for raster images. | Yes |
| **LLM Logical Consistency** | Claude analyzes extracted fields for logical contradictions (e.g., date mismatches). | Yes |
| **Document-to-identity hash** | Every upload is tied to an authenticated uploader and file hash; catches reuse. | Yes |

---

## 6. DigiLocker Integration — Status & Decision
**Decision: not live for the hackathon build**
Connecting to DigiLocker requires registering as a "Requester" organization on the DigiLocker Partner Portal (takes weeks/months).
**What we do instead:**
The document upload flow includes a DigiLocker integration point, clearly labeled "pending partner approval". Demo data visually resembles DigiLocker-issued documents to explain what a real integration would verify.

---

## 7. Authentication & Gateways
The app is designed to be universal (multi-officer, multi-bidder).
- **Security**: JWT-based login, bcrypt password hashing.
- **Portals**: Separated into `/officer` and `/bidder` environments.
- **Why it matters**: The audit trail is meaningless without knowing who did what.

---

## 8. Technical Approach
| Layer | Choice |
|---|---|
| **Frontend** | React + TypeScript, Tailwind CSS, shadcn/ui components, lucide-react |
| **Backend** | Python, FastAPI |
| **Database** | Supabase (PostgreSQL) |
| **File Storage** | Cloudinary (Configured for Private/Secure storage) |
| **Document extraction** | Tesseract OCR (scans) + pdfplumber (digital PDFs) |
| **AI layer** | Claude LLM (Only explains, never decides) |
| **Rule engine** | Deterministic, hand-written logic |

**Key design principle:**
AI extracts and explains — a deterministic engine decides — the officer approves. This keeps every verdict auditable and CVC/CAG-defensible.

---

## 9. Methodology — Step by Step
1. Bidder uses the `/bidder` portal to upload documents (saved to Cloudinary) and runs a **Self-Check** to preview their score.
2. Officer views the bid. OCR/parsing extracts structured fields.
3. Officer selects the tender-specific eligibility clauses.
4. The deterministic rule engine evaluates facts against the rules, triggering Authenticity Checks (ELA, hashes, metadata).
5. Results aggregate into a 0–100 score, Risk Level, and three-state verdict.
6. Claude LLM generates plain-language explanations.
7. Officer reviews the Scorecard (using 1-click manual verification links if APIs fail) and records a final decision.
8. Everything is logged immutably.

---

## 10. Feasibility & Viability
**Technical feasibility:** High. OCR, deterministic rules, and LLM explanations are proven. 
**Resource feasibility:** Near-zero build cost (Open-source, Cloudinary free tier, Supabase free tier).
**Risks:** False positives on AI-generation. **Mitigation:** Uncertain cases route to human review.

---

## 11. Impact & Benefits
**70–85% faster bidder compliance verification**
Reduces manual review time from 45–90 minutes down to 10–15 minutes per bidder.

---

## 12. Research & References
- GeM official portal (gem.gov.in)
- CPPP Debarment Manual (GFR 2017 Rule 151)
- DigiLocker Partner Organisation Onboarding SOP

---

## 13. 5-Slide Pitch & Demo Walkthrough
*See companion files: `GeM_ComplianceLens_PPT_Script.md` and `GeM_ComplianceLens_Demo_Showcase_Workflow.md`*
