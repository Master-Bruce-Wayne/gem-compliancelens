import React, { useState } from 'react';
import { UploadCloud, CheckCircle, ShieldAlert, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface DocumentUploaderProps {
  bidderId: string;
  allowedDocTypes: { value: string, label: string }[];
  onUploadComplete: () => void;
}

export default function DocumentUploader({ bidderId, allowedDocTypes, onUploadComplete }: DocumentUploaderProps) {
  const [docType, setDocType] = useState(allowedDocTypes[0]?.value || 'pan');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [failCount, setFailCount] = useState(0);
  const [isForcing, setIsForcing] = useState(false);

  const handleUpload = async (e: React.FormEvent | null, forceManual = false) => {
    if (e) e.preventDefault();
    if (!file) return;

    if (forceManual) setIsForcing(true);
    else setIsUploading(true);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('docType', docType);
    formData.append('bidderId', bidderId);
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
      
      if (forceManual) {
          toast.success("Document submitted for Manual Review!");
      } else {
          toast.success("Document verified securely!");
      }
      
      setFile(null);
      setFailCount(0);
      onUploadComplete();
      
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setIsUploading(false);
      setIsForcing(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200">
      <h3 className="font-semibold text-lg mb-4">Upload Missing Required Document</h3>
      <form onSubmit={(e) => handleUpload(e, false)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Document Type</label>
          <select 
            value={docType} 
            onChange={(e) => setDocType(e.target.value)}
            className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
          >
            {allowedDocTypes.map(dt => (
              <option key={dt.value} value={dt.value}>{dt.label}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Upload File (PDF/Image)</label>
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:bg-slate-50 transition cursor-pointer relative">
            <input 
              type="file" 
              accept=".pdf,image/png,image/jpeg"
              onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            {file ? (
              <div className="text-blue-600 font-medium">{file.name}</div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-slate-500">
                <UploadCloud className="w-8 h-8 text-slate-400" />
                <span className="text-sm">Click or drag file here to upload</span>
              </div>
            )}
          </div>
        </div>

        {failCount > 0 && failCount < 3 && (
          <div className="bg-amber-50 text-amber-800 p-4 rounded-lg text-sm border border-amber-200 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <div>
              <p className="font-semibold">AI Verification Failed (Attempt {failCount}/3)</p>
              <p className="mt-1">Please ensure the document is clearly legible and matches the selected type.</p>
            </div>
          </div>
        )}

        {failCount >= 3 && (
          <div className="bg-red-50 text-red-800 p-4 rounded-lg text-sm border border-red-200 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 shrink-0 text-red-600" />
            <div>
              <p className="font-semibold text-red-900">Maximum Automated Attempts Reached</p>
              <p className="mt-1 text-red-800">
                We could not automatically verify this document. You may force a manual submission, but this will require officer review and delay evaluation.
              </p>
              <button 
                type="button"
                onClick={() => handleUpload(null, true)}
                disabled={isForcing}
                className="mt-3 bg-red-600 text-white px-4 py-2 rounded font-medium hover:bg-red-700 transition disabled:opacity-50 flex items-center gap-2"
              >
                {isForcing && <Loader2 className="w-4 h-4 animate-spin" />}
                Force Manual Submission
              </button>
            </div>
          </div>
        )}

        {failCount < 3 && (
          <button 
            type="submit" 
            disabled={!file || isUploading}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isUploading ? <><Loader2 className="w-5 h-5 animate-spin" /> Verifying with AI...</> : 'Upload & Verify Document'}
          </button>
        )}
      </form>
    </div>
  );
}
