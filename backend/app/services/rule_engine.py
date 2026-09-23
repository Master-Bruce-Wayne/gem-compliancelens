from app.db.models import Bidder, TenderRule, BidderDocument
from typing import List, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, text

class RuleEngine:
    @staticmethod
    async def evaluate(bidder: Bidder, rules: List[TenderRule], documents: List[BidderDocument], db: AsyncSession = None) -> Dict[str, Any]:
        results = []
        overall_score = 100
        has_mandatory_fail = False
        has_needs_review = False
        
        # Organize documents by type
        doc_map = {d.doc_type: d for d in documents}
        
        for rule in rules:
            status = 'pass'
            reason = ''
            extracted_val = None
            source = ''
            rule_name = rule.clause_type

            if rule.clause_type == 'gst_active_and_filed':
                rule_name = "GST active and returns filed"
                gst_doc = doc_map.get('gst_certificate')
                source = 'Uploaded GST Certificate OCR'
                if not gst_doc:
                    status = 'fail'
                    reason = "GST Certificate not uploaded"
                elif not gst_doc.extracted_fields or 'gstin' not in gst_doc.extracted_fields:
                    status = 'needs_review'
                    reason = "Failed to extract GSTIN from document"
                else:
                    extracted_val = gst_doc.extracted_fields.get('gstin')

            elif rule.clause_type == 'pan_valid':
                rule_name = "PAN valid"
                pan_doc = doc_map.get('pan')
                source = 'Uploaded PAN Card OCR'
                if not pan_doc:
                    status = 'fail'
                    reason = "PAN Card not uploaded"
                elif not pan_doc.extracted_fields or 'pan' not in pan_doc.extracted_fields:
                    status = 'needs_review'
                    reason = "Failed to extract PAN from document"
                else:
                    extracted_val = pan_doc.extracted_fields.get('pan')

            elif rule.clause_type == 'udyam_valid':
                rule_name = "Udyam registration valid"
                udyam_doc = doc_map.get('udyam_certificate')
                source = 'Uploaded Udyam Certificate OCR'
                if not udyam_doc:
                    status = 'fail'
                    reason = "Udyam Certificate not uploaded"
                elif not udyam_doc.extracted_fields or 'udyam_registration_number' not in udyam_doc.extracted_fields:
                    status = 'needs_review'
                    reason = "Failed to extract Udyam number from document"
                else:
                    extracted_val = udyam_doc.extracted_fields.get('udyam_registration_number')

            elif rule.clause_type == 'not_debarred':
                rule_name = "Not on debarment list"
                source = 'Self-declaration'
                status = 'needs_review'
                reason = "Debarment requires manual cross-check on CPPP portal"

            elif rule.clause_type == 'local_content_pct':
                rule_name = f"Local content >= {rule.threshold_value}%"
                source = 'Bidder Profile Declaration'
                declared = bidder.local_content_pct_declared
                if declared is None:
                    status = 'needs_review'
                    reason = "Local content not declared"
                elif float(declared) < float(rule.threshold_value):
                    if (float(rule.threshold_value) - float(declared)) <= 1.0:
                        status = 'needs_review'
                        reason = f"Declared {declared}%, within rounding distance of the {rule.threshold_value}% threshold — flagged rather than auto-failed"
                    else:
                        status = 'fail'
                        reason = f"Declared {declared}%, below the {rule.threshold_value}% threshold"
                        extracted_val = str(declared)

            elif rule.clause_type == 'turnover_threshold_inr':
                rule_name = "Turnover threshold met"
                source = 'Bidder Profile Declaration'
                turnover = bidder.annual_turnover_inr
                if turnover is None:
                    status = 'needs_review'
                    reason = "Turnover not declared"
                elif float(turnover) < float(rule.threshold_value):
                    status = 'fail'
                    reason = f"Turnover ₹{turnover:,.0f} below ₹{rule.threshold_value:,.0f} threshold"
                    extracted_val = str(turnover)

            elif rule.clause_type == 'epfo_esic_compliance':
                rule_name = "EPFO/ESIC compliant"
                esic_doc = doc_map.get('epfo_esic')
                source = 'Uploaded EPFO/ESIC Statement OCR'
                if not esic_doc:
                    status = 'fail'
                    reason = "EPFO/ESIC compliance document not uploaded"
                else:
                    status = 'needs_review'
                    reason = "Requires manual verification on portal"
                    
            if status == 'fail' and rule.mandatory:
                has_mandatory_fail = True
                
            if status == 'needs_review':
                has_needs_review = True

            results.append({
                "rule_name": rule_name,
                "status": status,
                "reason": reason,
                "extracted_value": extracted_val,
                "source": source
            })

        # Calculate overall score and risk
        fails = len([r for r in results if r['status'] == 'fail'])
        overall_score = max(0, 100 - (fails * 20)) # simple scoring logic for demo
        
        if has_mandatory_fail:
            verdict = 'non_compliant'
            risk_level = 'high'
        elif has_needs_review:
            verdict = 'needs_review'
            risk_level = 'medium'
            overall_score -= 10
        else:
            verdict = 'compliant'
            risk_level = 'low'
            
        return {
            "overall_score": overall_score,
            "risk_level": risk_level,
            "verdict": verdict,
            "checks": results
        }
