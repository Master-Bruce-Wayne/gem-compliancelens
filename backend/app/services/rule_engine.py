from app.db.models import Bidder, TenderRule, MockRegistryResponse, BidderDocument
from typing import List, Dict, Any

class RuleEngine:
    @staticmethod
    def evaluate(bidder: Bidder, rules: List[TenderRule], registry_responses: List[MockRegistryResponse], documents: List[BidderDocument]) -> Dict[str, Any]:
        results = []
        overall_score = 100
        has_mandatory_fail = False
        has_needs_review = False
        
        # Organize registry responses by type
        registry_map = {r.registry_type: r.response_payload for r in registry_responses}
        
        for rule in rules:
            status = 'pass'
            reason = ''
            extracted_val = None
            source = ''
            rule_name = rule.clause_type

            if rule.clause_type == 'gst_active_and_filed':
                rule_name = "GST active and returns filed"
                gst_data = registry_map.get('gst', {})
                source = 'Simulated GST portal response'
                if not gst_data:
                    status = 'needs_review'
                    reason = "GST registry data missing"
                else:
                    if gst_data.get('status') != 'Active':
                        status = 'fail'
                        reason = "GST status is not Active"
                    else:
                        returns = gst_data.get('return_filing_status', {})
                        if returns.get('GSTR-3B') != 'Filed':
                            status = 'fail'
                            reason = f"GSTR-3B not filed since {returns.get('last_period_filed')}"
                            extracted_val = "Not Filed"

            elif rule.clause_type == 'pan_valid':
                rule_name = "PAN valid"
                pan_data = registry_map.get('pan', {})
                source = 'Simulated PAN portal response'
                if not pan_data:
                    status = 'needs_review'
                    reason = "PAN registry data missing"
                elif pan_data.get('status') != 'Valid':
                    status = 'fail'
                    reason = "PAN is not valid"

            elif rule.clause_type == 'udyam_valid':
                rule_name = "Udyam registration valid"
                udyam_data = registry_map.get('udyam', {})
                source = 'Simulated Udyam portal response'
                if not udyam_data:
                    status = 'needs_review'
                    reason = "Udyam registry data missing"
                else:
                    # Check if note indicates human review needed
                    if "note" in udyam_data and "mismatch" in udyam_data["note"].lower():
                        status = 'needs_review'
                        reason = udyam_data['note']
                    elif udyam_data.get('status') != 'Active':
                        status = 'fail'
                        reason = "Udyam is not active"

            elif rule.clause_type == 'not_debarred':
                rule_name = "Not on debarment list"
                debar_data = registry_map.get('cppp_debarment', {})
                source = 'Simulated CPPP Debarment list'
                if debar_data.get('is_debarred'):
                    status = 'fail'
                    reason = debar_data.get('debarment_reason', 'Currently debarred')
                    if 'debarment_period' in debar_data:
                        reason = f"Currently debarred by another CPSE until {debar_data['debarment_period'].split(' to ')[1]}"

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
                esic_data = registry_map.get('epfo_esic', {})
                source = 'Simulated EPFO/ESIC portal response'
                if not esic_data:
                    status = 'needs_review'
                    reason = "EPFO/ESIC data missing"
                elif esic_data.get('esic_status') != 'Active' or not esic_data.get('contributions_current'):
                    status = 'fail'
                    reason = "ESIC status inactive"
                    
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
