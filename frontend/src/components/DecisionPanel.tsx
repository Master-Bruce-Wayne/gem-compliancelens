import { useState } from 'react';
import { Bot, AlertTriangle, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';

export default function DecisionPanel({ evaluation }: { evaluation: any }) {
  const [decision, setDecision] = useState<string>('');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [pendingChecks, setPendingChecks] = useState<string[]>([]);
  const navigate = useNavigate();

  const aiRecommendation = evaluation?.verdict === 'compliant' ? 'qualify' : 
                           evaluation?.verdict === 'needs_review' ? 'clarify' : 'disqualify';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setPendingChecks([]);
    
    if (decision !== aiRecommendation && !note) {
      alert("A justification note is required when overriding the AI recommendation.");
      return;
    }
    
    setSubmitting(true);
    
    const userStr = localStorage.getItem('user');
    const officerId = userStr ? JSON.parse(userStr).id : "";

    try {
      if (decision === 'clarify') {
        const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/v1/bids/${evaluation.evaluationId}/clarification`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ officerId, message: note || "Please provide clarification for flagged items." })
        });
        if (!response.ok) {
           const err = await response.json();
           throw new Error(err.detail?.message || err.detail || "Failed to request clarification");
        }
      } else {
        const finalDec = decision === 'qualify' ? 'compliant' : 'non_compliant';
        const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/v1/bids/${evaluation.evaluationId}/decision`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ decision: finalDec, note: note || undefined, officerId })
        });
        if (!response.ok) {
           const err = await response.json();
           if (err.detail?.pending_checks) {
              setPendingChecks(err.detail.pending_checks);
           }
           throw new Error(err.detail?.message || err.detail || "Failed to submit decision");
        }
      }
      navigate('/officer/tenders');
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="border border-border rounded-xl mt-8 overflow-hidden bg-surface shadow-sm">
      <div className="p-4 bg-brand/5 border-b border-border flex items-start gap-4">
        <div className="mt-1">
          <Bot className="w-6 h-6 text-brand" />
        </div>
        <div>
          <h3 className="font-semibold text-brand flex items-center gap-2">
            AI Recommendation Summary
          </h3>
          <p className="text-sm mt-2 leading-relaxed text-gray-700">
            Based on the compliance evaluation, this bidder is recommended for <strong className="uppercase">{aiRecommendation}</strong>. 
            {aiRecommendation === 'clarify' && " Ensure all 'Needs Review' items are manually verified or clarified."}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        <h3 className="font-medium mb-4">Officer Decision</h3>
        
        {errorMsg && (
          <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg text-sm">
            <strong>Action Blocked:</strong> {errorMsg}
            {pendingChecks.length > 0 && (
              <ul className="list-disc ml-5 mt-2">
                {pendingChecks.map((c, i) => <li key={i}>{c}</li>)}
              </ul>
            )}
          </div>
        )}

        <div className="flex gap-4 mb-6">
          {['Qualify', 'Request Clarification', 'Disqualify'].map(opt => {
            const val = opt === 'Request Clarification' ? 'clarify' : opt.toLowerCase();
            return (
              <label 
                key={opt}
                className={cn(
                  "flex-1 border rounded-xl p-4 cursor-pointer transition-colors relative",
                  decision === val ? 'border-brand bg-brand/5 ring-1 ring-brand' : 'border-border hover:bg-gray-50'
                )}
              >
                <input 
                  type="radio" 
                  name="decision" 
                  value={val} 
                  checked={decision === val}
                  onChange={(e) => setDecision(e.target.value)}
                  className="absolute opacity-0"
                />
                <div className="font-medium">{opt}</div>
              </label>
            );
          })}
        </div>

        {decision && (decision !== aiRecommendation || decision === 'clarify' || decision === 'disqualify') && (
          <div className="mb-6 animate-in fade-in slide-in-from-top-2">
            <label className="flex items-center gap-2 text-sm font-medium mb-2 text-needsReviewText">
              <AlertTriangle className="w-4 h-4" />
              {decision === 'clarify' ? 'Clarification message to vendor' : decision === 'disqualify' ? 'Mandatory reasoning for disqualification' : 'Justification required (override)'}
            </label>
            <textarea 
              required
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={decision === 'clarify' ? "Enter questions for the vendor..." : decision === 'disqualify' ? "Explain the specific reasons for rejecting this bid..." : "Explain why you are overriding the AI recommendation..."}
              className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand"
              rows={3}
            />
          </div>
        )}

        <div className="flex justify-end">
          <button 
            type="submit" 
            disabled={!decision || ((decision !== aiRecommendation || decision === 'clarify' || decision === 'disqualify') && !note) || submitting}
            className="px-6 py-2 bg-brand text-white rounded-lg font-medium disabled:opacity-50 hover:bg-brandHover transition-colors flex items-center gap-2"
          >
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            Submit Decision
          </button>
        </div>
      </form>
    </div>
  );
}
