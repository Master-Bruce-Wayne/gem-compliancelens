import { X, ExternalLink, Bot, MousePointerClick } from 'lucide-react';
import { cn } from '../lib/utils';

export default function CheckDetailPanel({ check, onClose }: { check: any, onClose: () => void }) {
  if (!check) return null;
  
  const getManualVerificationLink = (checkName: string) => {
    const name = checkName.toLowerCase();
    if (name.includes('gst')) return { url: 'https://services.gst.gov.in/services/searchtp', text: 'GST Search Portal' };
    if (name.includes('udyam') || name.includes('msme')) return { url: 'https://udyamregistration.gov.in/Udyam_Verify.aspx', text: 'Udyam Verification Portal' };
    if (name.includes('pan')) return { url: 'https://eportal.incometax.gov.in/iec/foservices/#/pre-login/verifyYourPAN', text: 'Verify PAN Portal' };
    if (name.includes('epfo')) return { url: 'https://unifiedportal-epfo.epfindia.gov.in/publicPortal/no-auth/misReport/home/loadSearchEstablishmentHome', text: 'EPFO Establishment Search' };
    if (name.includes('mca') || name.includes('company')) return { url: 'https://www.mca.gov.in/mcafoportal/viewCompanyMasterData.do', text: 'MCA Company Master Data' };
    if (name.includes('debarment') || name.includes('blacklisted')) return { url: 'https://eprocure.gov.in/eprocure/app?page=DebarmentList', text: 'CPPP Debarment List' };
    return null;
  };

  const manualLink = getManualVerificationLink(check.name);

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
          <div className="p-4 border border-border rounded-xl bg-white shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="font-medium">{check.source || "System Verification Engine"}</span>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-lg text-sm font-mono text-gray-600 break-all border border-gray-100">
              {check.extractedValue || "Value verified against portal or ruleset."}
            </div>
            
            <div className="mt-3 text-xs text-textSecondary">
              Checked at {new Date(check.checkedAt || Date.now()).toLocaleString()}
            </div>
          </div>
        </div>

        {/* 1-Click Manual Verification Link */}
        {manualLink && (
          <div>
            <h3 className="text-sm font-medium text-textSecondary mb-4">Manual-Verify-Bridge</h3>
            <a 
              href={manualLink.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex items-center justify-between p-4 bg-blue-50 border border-blue-100 rounded-xl hover:bg-blue-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center text-blue-700">
                  <MousePointerClick className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-medium text-blue-900 flex items-center gap-2">
                    Open {manualLink.text}
                  </div>
                  <div className="text-xs text-blue-700 mt-1">1-click external portal check</div>
                </div>
              </div>
              <ExternalLink className="w-5 h-5 text-blue-400 group-hover:text-blue-600 transition-colors" />
            </a>
          </div>
        )}

      </div>
      
      <div className="p-4 border-t border-border bg-gray-50 flex justify-end">
        <button className="px-4 py-2 bg-brand text-white rounded-lg text-sm font-medium hover:bg-brandHover transition-colors">
          Dismiss
        </button>
      </div>
    </div>
  );
}
