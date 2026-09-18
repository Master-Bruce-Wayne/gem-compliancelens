import { useState, useEffect } from 'react';
import { UploadCloud, CheckCircle, ShieldAlert, FileText, ChevronRight, AlertCircle, Loader2 } from 'lucide-react';
import { toast, Toaster } from 'sonner';

export default function BidderSubmitPage() {
  const [docType, setDocType] = useState('pan');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedDocs, setUploadedDocs] = useState<any[]>([]);
  const [pendingConfirmId, setPendingConfirmId] = useState<string | null>(null);
  const [confirmFields, setConfirmFields] = useState<any>({});
  const [isConfirming, setIsConfirming] = useState(false);
  const [failCount, setFailCount] = useState(0);
  const [isForcing, setIsForcing] = useState(false);

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : {};

  const fetchVault = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/v1/bidders/${user.id}/documents`);
      const data = await res.json();
      setUploadedDocs(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchVault();
  }, []);

  const handleUpload = async (e: React.FormEvent, forceManual = false) => {
    e.preventDefault();
    if (!file) return;

    if (forceManual) setIsForcing(true);
    else setIsUploading(true);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('docType', docType);
    formData.append('bidderId', user.id);
    formData.append('force_manual', forceManual ? 'true' : 'false');

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/v1/documents/upload`, {
        method: 'POST',
        body: formData
      });
      
      if (!res.ok) { 
          const errData = await res.json().catch(() => ({})); 
          if (errData.detail && errData.detail.error === 'OCR_REJECTED') {
              setFailCount(prev => prev + 1);
              throw new Error(errData.detail.message);
          }
          throw new Error(errData.detail || "Upload failed"); 
      }
      
      const data = await res.json();
      
      if (forceManual) {
          toast.success("Document submitted for Manual Review!");
      } else {
          toast.success("Document verified and added to Vault!");
      }
      
      setFile(null);
      setFailCount(0);
      await fetchVault();
      
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setIsUploading(false);
      setIsForcing(false);
    }
  };

  const submitConfirmation = async () => {
    if (!pendingConfirmId) return;
    setIsConfirming(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/v1/documents/${pendingConfirmId}/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bidderId: user.id, confirmed_fields: confirmFields })
      });
      if (!res.ok) throw new Error("Failed to confirm fields");
      toast.success("Fields confirmed successfully.");
      setPendingConfirmId(null);
      await fetchVault();
    } catch(err) {
      toast.error("Confirmation failed");
    } finally {
      setIsConfirming(false);
    }
  };

  const calculatePreScore = () => {
    if (uploadedDocs.length === 0) return 0;
    const verified = uploadedDocs.filter(d => d.ocrStatus === 'done').length;
    return Math.min(100, verified * 25);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20 p-4">
      <Toaster position="bottom-right" />
      
      <header>
        <h1 className="text-2xl font-bold text-gray-900">My Document Vault</h1>
        <p className="text-gray-500 mt-1">Manage your centralized statutory documents. These will be attached to your bids.</p>
      </header>

      

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Form */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold mb-4">Upload New Document</h2>
          <form onSubmit={(e) => handleUpload(e, false)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Document Type</label>
              <select 
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                className="w-full border-slate-300 rounded-md shadow-sm p-2.5 border focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="pan">PAN Card</option>
                <option value="gst_certificate">GST Registration</option>
                <option value="udyam_certificate">Udyam/MSME Certificate</option>
                <option value="epfo_esic">EPFO/ESIC Compliance</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">File (PDF or Image)</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-md bg-slate-50">
                <div className="space-y-1 text-center">
                  <UploadCloud className="mx-auto h-12 w-12 text-slate-400" />
                  <div className="flex text-sm text-slate-600 justify-center">
                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-700">
                      <span>Upload a file</span>
                      <input type="file" className="sr-only" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                    </label>
                  </div>
                  <p className="text-xs text-slate-500">{file ? file.name : "PNG, JPG, PDF up to 10MB"}</p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              onClick={(e) => handleUpload(e, false)}
              disabled={isUploading || isForcing || !file}
              className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 gap-2"
            >
              {isUploading && <Loader2 className="animate-spin w-4 h-4"/>}
              {isUploading ? 'Extracting via AI...' : 'Secure Upload'}
            </button>
            
            {failCount >= 3 && (
                <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
                    <p className="text-amber-800 text-sm mb-3 font-medium flex items-center gap-2"><ShieldAlert size={16}/> You have failed automated verification 3 times.</p>
                    <button
                      type="button"
                      onClick={(e) => handleUpload(e, true)}
                      disabled={isForcing || !file}
                      className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 disabled:opacity-50 gap-2"
                    >
                      {isForcing && <Loader2 className="animate-spin w-4 h-4"/>}
                      Force Upload (Requires Manual Officer Review)
                    </button>
                </div>
            )}
          </form>
        </div>

        {/* Pre-Check Scorecard */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col items-center justify-center">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 w-full">
            <ShieldAlert className="w-5 h-5 text-green-500" /> Vault Readiness Score
          </h2>
          
          <div className="relative">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100" />
              <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="12" fill="transparent" 
                strokeDasharray={351.8} 
                strokeDashoffset={351.8 - (351.8 * calculatePreScore()) / 100}
                className="text-green-500 transition-all duration-1000 ease-out" 
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-3xl font-bold text-slate-900">{calculatePreScore()}</span>
              <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">/ 100</span>
            </div>
          </div>
          
          <p className="mt-6 text-center text-sm text-slate-600 px-4">
            {calculatePreScore() === 100 
              ? "Your vault is complete. You are ready to apply for tenders."
              : "Upload all required verified documents to achieve a 100 readiness score."}
          </p>
        </div>
      </div>

      {/* Uploaded Documents List */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-lg font-semibold mb-4">Secured Vault Documents</h2>
        {uploadedDocs.length === 0 ? (
           <div className="text-center p-6 text-slate-500 text-sm bg-slate-50 rounded">Your vault is empty.</div>
        ) : (
          <div className="space-y-3">
            {uploadedDocs.map((doc, i) => (
              <div key={i} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg bg-slate-50">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 p-2 rounded-lg text-blue-700">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold uppercase">{doc.docType.replace('_', ' ')}</div>
                    <div className="text-xs text-slate-500 flex gap-2 items-center mt-1">
                      <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                      <span>•</span>
                      {doc.ocrStatus === 'done' ? (
                        <span className="text-green-600 flex items-center gap-1 font-medium"><CheckCircle className="w-3 h-3"/> Verified</span>
                      ) : (
                        <span className="text-amber-600 flex items-center gap-1 font-medium"><ShieldAlert className="w-3 h-3"/> Needs Manual Review</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end">
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
