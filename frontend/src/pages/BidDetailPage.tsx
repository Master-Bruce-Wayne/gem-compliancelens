import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, FileText, CheckCircle, ShieldAlert } from 'lucide-react';
import { cn } from '../lib/utils';
import { toast, Toaster } from 'sonner';
import AuthenticityPanel from '../components/AuthenticityPanel';

const TENDER_ID = "92254e09-4f9f-50e6-9861-d04936acc93b"; // Standard tender ID for demo

export default function BidDetailPage() {
  const navigate = useNavigate();
  const [bidders, setBidders] = useState<any[]>([]);
  const [selectedBidder, setSelectedBidder] = useState<string | null>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  
  // Authenticity Panel state
  const [authDocId, setAuthDocId] = useState<string | null>(null);
  const [authReport, setAuthReport] = useState<any>(null);

  useEffect(() => {
    // Fetch real registered bidders
    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/v1/bidders`)
      .then(res => res.json())
      .then(data => {
        setBidders(data);
        if (data.length > 0 && !selectedBidder) {
          setSelectedBidder(data[0].id);
        }
      });
  }, []);

  useEffect(() => {
    if (!selectedBidder) return;
    
    // Fetch uploaded documents for the selected bidder
    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/v1/bidders/${selectedBidder}/documents`)
      .then(res => res.json())
      .then(data => setDocuments(data));
  }, [selectedBidder]);

  const handleRunCompliance = async () => {
    if (!selectedBidder) return;
    setIsRunning(true);
    const bidId = crypto.randomUUID();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/v1/bids/${bidId}/evaluate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bidderId: selectedBidder, tenderId: TENDER_ID })
      });
      if (!response.ok) throw new Error("Evaluation failed");
      toast.success("Compliance evaluation complete!");
      setTimeout(() => navigate(`/officer/bids/${bidId}/scorecard`), 1000);
    } catch (err) {
      toast.error("Failed to run compliance check.");
      setIsRunning(false);
    }
  };

  const checkAuthenticity = async (docId: string) => {
    toast.info("Running forgery analysis...");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/v1/documents/${docId}/authenticity`, {
        method: 'POST'
      });
      if (!res.ok) throw new Error();
      const report = await res.json();
      setAuthReport(report);
      setAuthDocId(docId);
      toast.success("Analysis complete");
    } catch (err) {
      toast.error("Failed to run authenticity check");
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 relative">
      <Toaster position="bottom-right" />
      
      {authDocId && (
        <div className="fixed inset-0 bg-black/20 z-40" onClick={() => setAuthDocId(null)} />
      )}
      
      {authDocId && (
        <AuthenticityPanel 
          documentId={authDocId} 
          report={authReport} 
          onClose={() => setAuthDocId(null)} 
        />
      )}

      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-textPrimary">Bid Details</h1>
          <p className="text-textSecondary text-sm mt-1">Review live bidder documents before running evaluation</p>
        </div>
        <button 
          onClick={handleRunCompliance}
          disabled={isRunning || !selectedBidder}
          className="flex items-center gap-2 px-6 py-2.5 bg-brand text-white rounded-lg font-medium hover:bg-brandHover transition-colors disabled:opacity-50"
        >
          {isRunning ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Play className="w-5 h-5" />}
          Run Compliance Check
        </button>
      </header>

      <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
        <h2 className="font-semibold mb-4">Select Live Registered Bidder</h2>
        {bidders.length === 0 ? (
          <div className="text-sm text-gray-500 italic">No bidders registered yet. Register a bidder account to see them here.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {bidders.map(b => (
              <label 
                key={b.id}
                className={cn(
                  "border rounded-xl p-4 cursor-pointer transition-colors relative",
                  selectedBidder === b.id ? 'border-brand bg-brand/5 ring-1 ring-brand' : 'border-border hover:bg-gray-50'
                )}
              >
                <input 
                  type="radio" 
                  name="bidder" 
                  value={b.id} 
                  checked={selectedBidder === b.id}
                  onChange={() => setSelectedBidder(b.id)}
                  className="absolute opacity-0"
                />
                <div className="font-medium text-sm text-textPrimary">{b.legal_name || "Unknown Company"}</div>
                <div className="text-xs text-textSecondary mt-1 uppercase">Registered Vendor</div>
              </label>
            ))}
          </div>
        )}
      </div>

      {selectedBidder && (
        <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-gray-400" /> Uploaded Documents
          </h2>
          <div className="space-y-3">
            {documents.length > 0 ? documents.map(doc => (
              <div key={doc.id} className="flex flex-col gap-2 p-3 border border-border rounded-lg bg-gray-50">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium capitalize flex items-center gap-2">
                    {doc.docType.replace('_', ' ')}
                  </span>
                  <div className="flex gap-2">
                    <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-md border border-blue-100 hover:bg-blue-100">
                      View File
                    </a>
                    <span className="flex items-center gap-1 text-xs font-medium text-compliantText bg-compliantBg px-2 py-1 rounded-md">
                      <CheckCircle className="w-3 h-3" /> Extracted
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <div className="text-xs text-gray-500 font-mono">
                    {JSON.stringify(doc.extractedFields).slice(0, 50)}...
                  </div>
                  <button 
                    onClick={() => checkAuthenticity(doc.id)}
                    className="text-xs font-medium bg-white border border-gray-200 px-3 py-1.5 rounded shadow-sm hover:bg-gray-50 flex items-center gap-1.5 text-gray-700 transition-colors"
                  >
                    <ShieldAlert className="w-3.5 h-3.5 text-brand" /> Check Authenticity
                  </button>
                </div>
              </div>
            )) : (
              <div className="text-sm text-gray-500">No documents uploaded by this bidder yet. Login as this bidder and upload documents to review them.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
