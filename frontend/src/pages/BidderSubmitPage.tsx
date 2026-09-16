import { useState } from 'react';
import { UploadCloud, CheckCircle, ShieldAlert, FileText, ChevronRight } from 'lucide-react';
import { toast, Toaster } from 'sonner';

export default function BidderSubmitPage() {
  const [docType, setDocType] = useState('pan');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedDocs, setUploadedDocs] = useState<any[]>([]);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('docType', docType);
    formData.append('bidderId', user.id);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/v1/documents/upload`, {
        method: 'POST',
        body: formData
      });
      
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      
      toast.success("Document securely uploaded & extracted!");
      setUploadedDocs([...uploadedDocs, { ...data, docType }]);
      setFile(null);
      
    } catch (err) {
      toast.error("Upload failed. Ensure Cloudinary is configured.");
    } finally {
      setIsUploading(false);
    }
  };

  const calculatePreScore = () => {
    if (uploadedDocs.length === 0) return 0;
    // Simple mock pre-score logic based on number of uploaded docs for demo
    return Math.min(100, uploadedDocs.length * 25);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in">
      <Toaster position="bottom-right" />
      
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Document Submission & Pre-Check</h1>
        <p className="text-gray-500 mt-1">Securely upload your statutory documents. The system will pre-verify them before the officer sees them.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Upload Form */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">Upload Document</h2>
          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Document Type</label>
              <select 
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                className="w-full border-gray-300 rounded-md shadow-sm p-2.5 border focus:ring-brand focus:border-brand"
              >
                <option value="pan">PAN Card</option>
                <option value="gst_certificate">GST Registration</option>
                <option value="udyam_certificate">Udyam/MSME Certificate</option>
                <option value="epfo_esic">EPFO/ESIC Compliance</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">File (PDF or Image)</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600 justify-center">
                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-brand hover:text-brandHover">
                      <span>Upload a file</span>
                      <input type="file" className="sr-only" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">{file ? file.name : "PNG, JPG, PDF up to 10MB"}</p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isUploading || !file}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand hover:bg-brandHover disabled:opacity-50"
            >
              {isUploading ? 'Uploading & Encrypting...' : 'Secure Upload'}
            </button>
          </form>
        </div>

        {/* Pre-Check Scorecard */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-500" /> Preliminary Self-Check
          </h2>
          
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="relative">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-gray-100" />
                <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="12" fill="transparent" 
                  strokeDasharray={351.8} 
                  strokeDashoffset={351.8 - (351.8 * calculatePreScore()) / 100}
                  className="text-brand transition-all duration-1000 ease-out" 
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-3xl font-bold text-gray-900">{calculatePreScore()}</span>
                <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">/ 100</span>
              </div>
            </div>
            
            <p className="mt-4 text-center text-sm text-gray-600 px-4">
              {calculatePreScore() === 100 
                ? "Your application looks perfect! You are highly likely to pass the compliance checks."
                : "Upload all required documents (PAN, GST, Udyam, EPFO) to improve your pre-submission score."}
            </p>
          </div>
        </div>
      </div>

      {/* Uploaded Documents List */}
      {uploadedDocs.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">Your Secured Documents</h2>
          <div className="space-y-3">
            {uploadedDocs.map((doc, i) => (
              <div key={i} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-gray-50">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-brand" />
                  <div>
                    <div className="text-sm font-medium capitalize">{doc.docType.replace('_', ' ')}</div>
                    <div className="text-xs text-gray-500 flex gap-2">
                      <span>Status: Extracted</span>
                      <span>•</span>
                      <span className="text-green-600 flex items-center gap-1"><CheckCircle className="w-3 h-3"/> Ready for Review</span>
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
