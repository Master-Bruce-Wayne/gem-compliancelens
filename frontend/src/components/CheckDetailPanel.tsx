import { X, ExternalLink, Bot } from 'lucide-react';
import { cn } from '../lib/utils';

export default function CheckDetailPanel({ check, onClose }: { check: any, onClose: () => void }) {
  if (!check) return null;
  
  return (
    <div className="fixed inset-y-0 right-0 w-[500px] bg-surface shadow-2xl border-l border-border transform transition-transform z-50 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="font-semibold text-lg">Check Details</h2>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        <div>
          <h3 className="text-sm font-medium text-textSecondary mb-2">Rule</h3>
          <div className="text-lg font-medium">{check.name}</div>
          <div className={cn("inline-flex mt-3 px-3 py-1 rounded-md text-sm font-medium", 
            check.status === 'pass' ? 'bg-compliantBg text-compliantText' : 
            check.status === 'needs_review' ? 'bg-needsReviewBg text-needsReviewText' : 
            'bg-nonCompliantBg text-nonCompliantText'
          )}>
            {check.status.toUpperCase()}
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-xl border border-border">
          <div className="flex items-center gap-2 mb-3">
            <Bot className="w-5 h-5 text-brand" />
            <span className="font-medium text-sm text-brand">AI Explanation</span>
          </div>
          <p className="text-sm leading-relaxed">
            {check.explanationText || "This check ensures that the bidder's data meets the specified criteria in the tender document."}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-textSecondary mb-4">Evidence Source</h3>
          <div className="p-4 border border-border rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <span className="font-medium">{check.source || "Simulated Portal Response"}</span>
              <button className="text-brand hover:text-brandHover flex items-center gap-1 text-sm font-medium">
                View Source <ExternalLink className="w-4 h-4" />
              </button>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-lg text-sm font-mono text-gray-600 break-all">
              {check.extractedValue || "Value verified against portal."}
            </div>
            
            <div className="mt-3 text-xs text-textSecondary">
              Checked at {new Date().toLocaleString()}
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-4 border-t border-border bg-gray-50 flex justify-end">
        <button className="px-4 py-2 bg-brand text-white rounded-lg text-sm font-medium hover:bg-brandHover transition-colors">
          Next Flagged Item
        </button>
      </div>
    </div>
  );
}
