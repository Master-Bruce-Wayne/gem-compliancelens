import urllib.request, json, uuid

BASE_URL = "http://localhost:8000/api/v1"
TENDER_ID = "92254e09-4f9f-50e6-9861-d04936acc93b"
CLEAN_BIDDER = "54e091f7-2bfd-5998-9f8e-6e66a1568179"
NEEDS_REVIEW_BIDDER = "96adefab-087f-5cde-9b57-0acb48b6a762"
FAIL_BIDDER = "6dc6bf7b-e7bc-546c-b9bf-0ac2e36b6b03"

def post(endpoint, payload):
    req = urllib.request.Request(f"{BASE_URL}{endpoint}", data=json.dumps(payload).encode('utf-8'), headers={'Content-Type': 'application/json'})
    try:
        return json.loads(urllib.request.urlopen(req).read())
    except Exception as e:
        print(f"Error on POST {endpoint}: {e}")
        return None

def get(endpoint):
    try:
        return json.loads(urllib.request.urlopen(f"{BASE_URL}{endpoint}").read())
    except Exception as e:
        print(f"Error on GET {endpoint}: {e}")
        return None

print("=== 1. Testing Rules Config Save ===")
rules_payload = {
    "tenderId": TENDER_ID,
    "clauses": [
        {"clause_type": "local_content_pct", "threshold_value": 35, "mandatory": True},
        {"clause_type": "turnover_threshold_inr", "threshold_value": 5000000, "mandatory": True}
    ]
}
rules_res = post(f"/tenders/{TENDER_ID}/rules", rules_payload)
print("Save Rules Response:", rules_res)

print("\n=== 2. Testing Bidder Self-Check (FAIL_BIDDER) ===")
self_check_payload = {"bidderId": FAIL_BIDDER, "tenderId": TENDER_ID, "documents": []}
self_check_res = post("/self-check/evaluate", self_check_payload)
print("Self Check Status:", self_check_res.get('summaryStatus'))
for gap in self_check_res.get('gaps', []):
    print(" - Gap:", gap.get('ruleName'), "->", gap.get('guidanceText'))

print("\n=== 3. Testing Officer Evaluation (NEEDS_REVIEW_BIDDER) ===")
bid_id = str(uuid.uuid4())
eval_payload = {"bidderId": NEEDS_REVIEW_BIDDER, "tenderId": TENDER_ID}
eval_res = post(f"/bids/{bid_id}/evaluate", eval_payload)
print("Evaluation Complete. Generated Checks:", len(eval_res.get('checks', [])))

print("\n=== 4. Testing Scorecard Fetch ===")
scorecard_res = get(f"/bids/{bid_id}/scorecard")
print("Score:", scorecard_res.get('score'), "| Risk:", scorecard_res.get('riskLevel'), "| Verdict:", scorecard_res.get('verdict'))

print("\n=== 5. Testing Decision Locking ===")
decision_payload = {"decision": "clarify", "note": "Need to verify Udyam date manually", "officerId": "00000000-0000-0000-0000-000000000000"}
decision_res = post(f"/bids/{bid_id}/decision", decision_payload)
print("Decision Locked. Audit Entry ID:", decision_res.get('auditEntryId'))

print("\n=== 6. Testing Audit Trail ===")
audit_res = get(f"/bids/{bid_id}/audit-log")
print(f"Found {len(audit_res.get('events', []))} events in audit trail:")
for event in audit_res.get('events', []):
    print(f" - [{event.get('type')}] {event.get('details')}")

