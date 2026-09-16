import { X, ShieldAlert, ShieldCheck, AlertTriangle, FileSearch, Hash, Cpu, Image as ImageIcon } from 'lucide-react';
import { cn } from '../lib/utils';

export default function AuthenticityPanel({ 
  documentId, 
  report, 
  onClose 
}: { 
  documentId: string; 
  report: any; 
  onClose: () => void 
}) {
  if (!report) return null;
  
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pass': return 'bg-green-100 text-green-700 border-green-200';
      case 'fail': return 'bg-red-100 text-red-700 border-red-200';
      case 'needs_review': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'pass': return 'Verified';
      case 'fail': return 'Flagged';
      case 'needs_review': return 'Review Required';
      default: return status;
    }
  };

  const getCheckIcon = (type: string) => {
    switch(type) {
      case 'checksum': return <Hash className="w-5 h-5" />;
      case 'metadata': return <FileSearch className="w-5 h-5" />;
      case 'ela': return <ImageIcon className="w-5 h-5" />;
      case 'llm_consistency': return <Cpu className="w-5 h-5" />;
      case 'hash_reuse': return <ShieldAlert className="w-5 h-5" />;
      default: return <ShieldCheck className="w-5 h-5" />;
    }
  };

  const getCheckTitle = (type: string) => {
    switch(type) {
      case 'checksum': return 'Checksum Validation';
      case 'metadata': return 'PDF Metadata Forensics';
      case 'ela': return 'Error Level Analysis (ELA)';
      case 'llm_consistency': return 'Logical Consistency';
      case 'hash_reuse': return 'Document Hash Reuse';
      default: return type;
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 w-[550px] bg-surface shadow-2xl border-l border-border transform transition-transform z-50 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-border bg-gray-50">
        <div>
          <h2 className="font-semibold text-lg flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-brand" />
            Authenticity & Forgery Analysis
          </h2>
          <p className="text-xs text-textSecondary mt-1">ID: {documentId}</p>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="p-4 rounded-xl border flex items-center justify-between bg-white shadow-sm">
          <div>
            <div className="text-sm text-textSecondary font-medium">Overall Status</div>
            <div className="text-xl font-bold mt-1 capitalize flex items-center gap-2">
              {report.authenticityStatus === 'verified' && <ShieldCheck className="w-6 h-6 text-green-600" />}
              {report.authenticityStatus === 'flagged' && <ShieldAlert className="w-6 h-6 text-red-600" />}
              {report.authenticityStatus === 'needs_review' && <AlertTriangle className="w-6 h-6 text-amber-500" />}
              {report.authenticityStatus.replace('_', ' ')}
            </div>
          </div>
        </div>

        <h3 className="font-semibold text-textPrimary">Detailed Checks</h3>
        <div className="space-y-4">
          {report.checks?.map((check: any, idx: number) => (
            <div key={idx} className="border border-border rounded-xl p-4 bg-white shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-gray-50 rounded-lg text-gray-600 border border-gray-100">
                    {getCheckIcon(check.check_type)}
                  </div>
                  <div>
                    <div className="font-semibold text-sm flex items-center gap-2">
                      {getCheckTitle(check.check_type)}
                      {check.check_type === 'llm_consistency' && (
                        <span className="text-[10px] uppercase font-bold tracking-wider bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded">AI-Assisted</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className={cn("px-2.5 py-1 text-xs font-semibold rounded-full border", getStatusColor(check.status))}>
                  {getStatusText(check.status)}
                </div>
              </div>
              
              <p className="text-sm text-gray-600 leading-relaxed pl-12">
                {check.detail?.message || JSON.stringify(check.detail)}
              </p>

              {check.evidence_path && (
                <div className="mt-4 pl-12">
                  <div className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Forensic Evidence</div>
                  <div className="border border-dashed border-gray-300 rounded-lg p-2 bg-gray-50">
                     <p className="text-xs text-gray-400 italic text-center py-4">Visual Evidence Generated: {check.evidence_path}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
