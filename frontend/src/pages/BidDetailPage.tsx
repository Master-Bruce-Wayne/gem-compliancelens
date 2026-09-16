import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, FileText, CheckCircle, Database, ShieldAlert, ShieldCheck } from 'lucide-react';
import { cn } from '../lib/utils';
import { toast, Toaster } from 'sonner';
import AuthenticityPanel from '../components/AuthenticityPanel';

const TENDER_ID = "92254e09-4f9f-50e6-9861-d04936acc93b";
const DEMO_BIDDERS = [
  { id: "54e091f7-2bfd-5998-9f8e-6e66a1568179", name: "Sundaram Precision Engineering Pvt Ltd", key: "clean_pass" },
  { id: "6dc6bf7b-e7bc-546c-b9bf-0ac2e36b6b03", name: "Vishnu Traders and Fabricators", key: "clear_fail" },
  { id: "96adefab-087f-5cde-9b57-0acb48b6a762", name: "Krishna Industrial Components LLP", key: "needs_review" },
];

export default function BidDetailPage() {
  const navigate = useNavigate();
  const [selectedBidder, setSelectedBidder] = useState(DEMO_BIDDERS[0].id);
  const [registryData, setRegistryData] = useState<any>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  
  // Authenticity Panel state
  const [authDocId, setAuthDocId] = useState<string | null>(null);
  const [authReport, setAuthReport] = useState<any>(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/v1/mock-registry/${selectedBidder}`)
      .then(res => res.json())
      .then(data => setRegistryData(data));
      
    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/v1/bidders/${selectedBidder}/documents`)
      .then(res => res.json())
      .then(data => setDocuments(data));
  }, [selectedBidder]);

  const handleRunCompliance = async () => {
    setIsRunning(true);
    const bidId = crypto.randomUUID();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/v1/officer/bids/${bidId}/evaluate`, {
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
          <p className="text-textSecondary text-sm mt-1">Review documents and registry data before evaluation</p>
        </div>
        <button 
          onClick={handleRunCompliance}
          disabled={isRunning || !registryData}
          className="flex items-center gap-2 px-6 py-2.5 bg-brand text-white rounded-lg font-medium hover:bg-brandHover transition-colors disabled:opacity-50"
        >
          {isRunning ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Play className="w-5 h-5" />}
          Run Compliance Check
        </button>
      </header>

      <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
        <h2 className="font-semibold mb-4">Select Demo Bidder</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {DEMO_BIDDERS.map(b => (
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
              <div className="font-medium text-sm text-textPrimary">{b.name}</div>
              <div className="text-xs text-textSecondary mt-1 uppercase">{b.key.replace('_', ' ')} Profile</div>
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <span className="flex items-center gap-1 text-xs font-medium text-compliantText bg-compliantBg px-2 py-1 rounded-md">
                    <CheckCircle className="w-3 h-3" /> Extracted
                  </span>
                </div>
                <div className="flex justify-end mt-1">
                  <button 
                    onClick={() => checkAuthenticity(doc.id)}
                    className="text-xs font-medium bg-white border border-gray-200 px-3 py-1.5 rounded shadow-sm hover:bg-gray-50 flex items-center gap-1.5 text-gray-700 transition-colors"
                  >
                    <ShieldAlert className="w-3.5 h-3.5 text-brand" /> Check Authenticity
                  </button>
                </div>
              </div>
            )) : (
              <div className="text-sm text-gray-500">Loading documents...</div>
            )}
          </div>
        </div>

        <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <Database className="w-5 h-5 text-gray-400" /> Simulated Registry Data
          </h2>
          {registryData ? (
            <div className="space-y-4">
              {Object.entries(registryData).slice(0, 4).map(([key, data]: [string, any]) => (
                <div key={key} className="p-3 border border-border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold uppercase text-brand">{key}</span>
                    <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-medium" title="Simulated response — live API integration point">Simulated</span>
                  </div>
                  <pre className="text-xs text-gray-600 bg-gray-50 p-2 rounded overflow-hidden text-ellipsis">
                    {JSON.stringify(data, null, 2).slice(0, 150)}...
                  </pre>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-500">Loading registry data...</div>
          )}
        </div>
      </div>
    </div>
  );
}
