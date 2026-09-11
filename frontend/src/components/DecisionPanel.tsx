import { useState } from 'react';
import { Bot, AlertTriangle } from 'lucide-react';
import { cn } from '../lib/utils';

export default function DecisionPanel({ evaluation }: { evaluation: any }) {
  const [decision, setDecision] = useState<string>('');
  const [note, setNote] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const aiRecommendation = evaluation?.verdict === 'compliant' ? 'qualify' : 
                           evaluation?.verdict === 'needs_review' ? 'clarify' : 'disqualify';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (decision !== aiRecommendation && !note) {
      alert("A justification note is required when overriding the AI recommendation.");
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:8000/api/v1/bids/${evaluation.evaluationId}/decision`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bidId: evaluation.evaluationId, // Actually the evaluationId maps to bidId logic in this demo
          decision: decision,
          note: note || undefined,
          officerId: "4329e27f-83a6-4242-9b93-eddb9597284e" // Hardcoded demo officer
        })
      });
      
      if (!response.ok) throw new Error("Failed to submit decision");
      setSubmitted(true);
    } catch (err) {
      alert("Failed to save decision");
    }
  };

  if (submitted) {
    return (
      <div className="p-6 border border-border rounded-xl bg-green-50 mt-8">
        <h3 className="font-medium text-green-800 flex items-center gap-2">
          Decision locked
        </h3>
        <p className="text-sm text-green-700 mt-1">This evaluation has been finalized and recorded in the audit log.</p>
      </div>
    );
  }

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
            {aiRecommendation === 'clarify' && " The Udyam renewal date requires manual verification."}
            {aiRecommendation === 'disqualify' && " The bidder fails mandatory statutory checks (GST returns)."}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        <h3 className="font-medium mb-4">Officer Decision</h3>
        
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

        {decision && decision !== aiRecommendation && (
          <div className="mb-6 animate-in fade-in slide-in-from-top-2">
            <label className="flex items-center gap-2 text-sm font-medium mb-2 text-needsReviewText">
              <AlertTriangle className="w-4 h-4" />
              Justification required (override)
            </label>
            <textarea 
              required
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Explain why you are overriding the AI recommendation..."
              className="w-full border border-red-300 rounded-lg p-3 text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand"
              rows={3}
            />
          </div>
        )}

        <div className="flex justify-end">
          <button 
            type="submit" 
            disabled={!decision || (decision !== aiRecommendation && !note)}
            className="px-6 py-2 bg-brand text-white rounded-lg font-medium disabled:opacity-50 hover:bg-brandHover transition-colors"
          >
            Submit Decision
          </button>
        </div>
      </form>
    </div>
  );
}
