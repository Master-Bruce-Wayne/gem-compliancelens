import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { AlertCircle, CheckCircle, Clock, ShieldAlert, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';
import CheckDetailPanel from '../components/CheckDetailPanel';
import DecisionPanel from '../components/DecisionPanel';

export default function ScorecardPage() {
  const { bidId } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [selectedCheck, setSelectedCheck] = useState<any>(null);
  
  useEffect(() => {
    setTimeout(() => {
      setData({
        score: 71,
        riskLevel: 'medium',
        verdict: 'needs_review',
        checks: [
          { name: "GST active and returns filed", status: "pass", summary: "" },
          { name: "PAN valid", status: "pass", summary: "" },
          { name: "Udyam registration valid", status: "needs_review", summary: "Mismatch in renewal date", extractedValue: "UDYAM-KA-05-0067890", explanationText: "The Udyam registry shows a last_updated date older than the renewal stamp on the submitted document, requiring manual verification." },
          { name: "Local content >= 35%", status: "needs_review", summary: "Declared 34.5%", extractedValue: "34.5", explanationText: "The declared local content is 34.5%, which is slightly below the 35% threshold but within rounding distance, so it was flagged for review rather than auto-failed." },
        ]
      });
      setLoading(false);
    }, 800);
  }, [bidId]);

  if (loading) return <div className="flex h-full items-center justify-center">Loading scorecard...</div>;
  if (!data) return <div>Failed to load scorecard</div>;

  const filteredChecks = data.checks.filter((c: any) => {
    if (filter === 'All') return true;
    if (filter === 'Compliant') return c.status === 'pass';
    if (filter === 'Non-Compliant') return c.status === 'fail';
    if (filter === 'Needs Review') return c.status === 'needs_review';
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-textPrimary">Compliance Scorecard</h1>
          <p className="text-textSecondary text-sm mt-1">Bid {bidId}</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-3xl font-bold text-brand">{data.score}/100</div>
            <div className="text-sm text-textSecondary font-medium">Overall Score</div>
          </div>
          <div className={cn("px-4 py-2 rounded-lg font-semibold text-sm border", 
            data.riskLevel === 'low' ? 'bg-compliantBg text-compliantText border-green-200' : 
            data.riskLevel === 'medium' ? 'bg-needsReviewBg text-needsReviewText border-yellow-200' : 
            'bg-nonCompliantBg text-nonCompliantText border-red-200'
          )}>
            Risk: {data.riskLevel.toUpperCase()}
          </div>
        </div>
      </header>

      <div className={cn("p-4 rounded-xl border flex items-center gap-3 shadow-sm", 
        data.verdict === 'compliant' ? 'bg-compliantBg border-green-200 text-compliantText' : 
        data.verdict === 'needs_review' ? 'bg-needsReviewBg border-yellow-200 text-needsReviewText' : 
        'bg-nonCompliantBg border-red-200 text-nonCompliantText'
      )}>
        {data.verdict === 'compliant' ? <CheckCircle /> : data.verdict === 'needs_review' ? <Clock /> : <ShieldAlert />}
        <span className="font-medium text-sm">
          {data.verdict === 'compliant' ? 'Bidder is fully compliant with all rules.' : 
           data.verdict === 'needs_review' ? 'Manual review required before qualification.' : 
           'Bidder is non-compliant and recommended for disqualification.'}
        </span>
      </div>

      <div className="bg-surface border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between bg-gray-50/50">
          <h2 className="font-semibold text-textPrimary">Per-Requirement Evaluation</h2>
          <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
            {['All', 'Compliant', 'Non-Compliant', 'Needs Review'].map(f => (
              <button 
                key={f} 
                onClick={() => setFilter(f)}
                className={cn("px-3 py-1.5 rounded-md text-sm font-medium transition-colors", 
                  filter === f ? "bg-white shadow-sm text-brand" : "text-textSecondary hover:text-textPrimary"
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        
        <div className="divide-y divide-border">
          {filteredChecks.map((check: any, idx: number) => (
            <div 
              key={idx} 
              onClick={() => setSelectedCheck(check)}
              className="p-4 hover:bg-gray-50 flex items-center justify-between group cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={cn("p-2 rounded-full",
                  check.status === 'pass' ? 'bg-green-100' :
                  check.status === 'fail' ? 'bg-red-100' : 'bg-yellow-100'
                )}>
                  {check.status === 'pass' && <CheckCircle className="w-5 h-5 text-compliantText" />}
                  {check.status === 'fail' && <AlertCircle className="w-5 h-5 text-nonCompliantText" />}
                  {check.status === 'needs_review' && <Clock className="w-5 h-5 text-needsReviewText" />}
                </div>
                
                <div>
                  <div className="font-medium text-textPrimary">{check.name}</div>
                  {check.summary && <div className="text-sm text-textSecondary mt-0.5">{check.summary}</div>}
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-brand transition-colors" />
            </div>
          ))}
          {filteredChecks.length === 0 && (
            <div className="p-8 text-center text-textSecondary">No checks match this filter.</div>
          )}
        </div>
      </div>

      <DecisionPanel evaluation={data} />

      {selectedCheck && (
        <>
          <div className="fixed inset-0 bg-black/20 z-40" onClick={() => setSelectedCheck(null)} />
          <CheckDetailPanel check={selectedCheck} onClose={() => setSelectedCheck(null)} />
        </>
      )}
    </div>
  );
}
