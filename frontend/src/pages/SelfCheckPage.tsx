import { useState } from 'react';
import { Upload, Play, CheckCircle, ShieldAlert, FileText, Activity } from 'lucide-react';
import { cn } from '../lib/utils';
import { toast, Toaster } from 'sonner';
import { useTranslation } from 'react-i18next';

const TENDER_ID = "92254e09-4f9f-50e6-9861-d04936acc93b";
const DEMO_BIDDERS = [
  { id: "54e091f7-2bfd-5998-9f8e-6e66a1568179", name: "Sundaram Precision Engineering (Clean)", key: "clean_pass" },
  { id: "6dc6bf7b-e7bc-546c-b9bf-0ac2e36b6b03", name: "Vishnu Traders (Fail)", key: "clear_fail" },
];

export default function SelfCheckPage() {
  const [selectedBidder, setSelectedBidder] = useState(DEMO_BIDDERS[0].id);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { t } = useTranslation();

  const handleSelfCheck = async () => {
    setIsEvaluating(true);
    setResult(null);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/v1/bidder/dashboard/evaluate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bidderId: selectedBidder,
          tenderId: TENDER_ID,
          documents: []
        })
      });
      
      if (!response.ok) throw new Error("Self-check failed");
      
      const data = await response.json();
      setResult(data);
      toast.success("Self-check complete!");
    } catch (err) {
      toast.error("Failed to run self-check.");
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <Toaster position="bottom-right" />
      <header>
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand/10 text-brand rounded-full text-sm font-medium mb-4">
          <Activity className="w-4 h-4" /> Bidder Portal (Read-Only)
        </div>
        <h1 className="text-3xl font-bold text-textPrimary">{t('selfCheck.title')}</h1>
        <p className="text-textSecondary mt-2 text-lg">{t('selfCheck.description')}</p>
      </header>

      <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
        <h2 className="font-semibold mb-4 text-lg">1. Select Tender & Profile</h2>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Tender</label>
            <div className="mt-1 p-3 bg-gray-50 border rounded-lg text-sm font-medium">
              Supply of Industrial Valves and Fittings — CPCL Refinery Unit 3
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700">Select Demo Profile to simulate</label>
            <div className="grid grid-cols-2 gap-4 mt-2">
              {DEMO_BIDDERS.map(b => (
                <label 
                  key={b.id}
                  className={cn(
                    "border rounded-xl p-4 cursor-pointer transition-colors relative flex items-center gap-3",
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
                  <div className={cn("w-4 h-4 rounded-full border flex items-center justify-center", selectedBidder === b.id ? "border-brand border-4" : "border-gray-300")} />
                  <div className="font-medium text-textPrimary">{b.name}</div>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
        <h2 className="font-semibold mb-4 text-lg">2. Upload Required Documents</h2>
        <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center bg-gray-50/50">
          <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
          <p className="font-medium text-gray-700">Drag & drop your certificates here</p>
          <p className="text-sm text-gray-500 mt-1 mb-4">PAN, GST, Udyam, EPFO/ESIC</p>
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium shadow-sm hover:bg-gray-50">
            Browse Files
          </button>
        </div>
      </div>

      <div className="flex justify-end">
        <button 
          onClick={handleSelfCheck}
          disabled={isEvaluating}
          className="flex items-center gap-2 px-8 py-3 bg-brand text-white rounded-lg font-medium text-lg hover:bg-brandHover transition-colors disabled:opacity-50"
        >
          {isEvaluating ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Play className="w-5 h-5" />}
          {isEvaluating ? t('selfCheck.running') : t('selfCheck.runCheck')}
        </button>
      </div>

      {result && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className={cn("border-2 rounded-xl p-6 shadow-sm", 
            result.summaryStatus === 'likely_compliant' ? 'border-green-500 bg-green-50/30' : 'border-red-500 bg-red-50/30'
          )}>
            <div className="flex items-center gap-3 mb-4">
              {result.summaryStatus === 'likely_compliant' ? (
                <>
                  <CheckCircle className="w-8 h-8 text-green-600" />
                  <div>
                    <h2 className="text-xl font-bold text-green-800">Likely Compliant</h2>
                    <p className="text-green-700">Your profile appears to meet all mandatory requirements.</p>
                  </div>
                </>
              ) : (
                <>
                  <ShieldAlert className="w-8 h-8 text-red-600" />
                  <div>
                    <h2 className="text-xl font-bold text-red-800">Compliance Gaps Detected</h2>
                    <p className="text-red-700">Please resolve the following issues before submitting your bid.</p>
                  </div>
                </>
              )}
            </div>

            {result.gaps && result.gaps.length > 0 && (
              <div className="mt-6 space-y-3">
                <h3 className="font-semibold text-gray-900 mb-2">Actionable Guidance</h3>
                {result.gaps.map((gap: any, i: number) => (
                  <div key={i} className="bg-white p-4 rounded-lg border border-red-200 shadow-sm flex items-start gap-3">
                    <FileText className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-gray-900">{gap.ruleName}</div>
                      <div className="text-sm text-gray-600 mt-1">{gap.guidanceText}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
