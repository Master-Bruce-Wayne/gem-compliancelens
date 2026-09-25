import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Search, Play, Lock, AlertCircle, Key } from "lucide-react";
import { toast, Toaster } from 'sonner';

export default function VendorTendersPage() {
  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchId, setSearchId] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [passwordPrompt, setPasswordPrompt] = useState<{tenderId: string, title: string} | null>(null);
  const [tenderPassword, setTenderPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/v1/tenders/open`)
      .then(res => res.json())
      .then(data => {
        setTenders(data);
        setLoading(false);
      });
  }, []);

  const handleApply = async (tenderId: string, isPrivate: boolean = false, title: string = "") => {
    if (isPrivate) {
      setPasswordPrompt({ tenderId, title });
      return;
    }
    await submitApplication(tenderId, null);
  };

  const submitApplication = async (tenderId: string, password: string | null) => {
    if (password && password.length < 4) {
      toast.error("Password must be at least 4 characters long.");
      return;
    }
    
    const userStr = localStorage.getItem('user');
    const bidderId = userStr ? JSON.parse(userStr).id : "";
    
    if (password) {
       // Validate password first
       const unlockRes = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/v1/tenders/${tenderId}/unlock`, {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ password })
       });
       if (!unlockRes.ok) {
         toast.error("Incorrect password for this private tender.");
         return;
       }
    }

    const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/v1/bids`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tenderId, bidderId, skip_approval: !!password })
    });
    
    if (res.ok) {
      const data = await res.json();
      setPasswordPrompt(null);
      setTenderPassword('');
      navigate(`/bidder/applications/${data.id}`);
    } else {
      toast.error("Failed to start application");
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId.trim()) return;
    setIsSearching(true);
    
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/v1/tenders/search/${searchId.trim()}`);
      if (!res.ok) {
        toast.error("Private tender not found or not open");
        setIsSearching(false);
        return;
      }
      
      const tender = await res.json();
      if (!tenders.find((t: any) => t.id === tender.id)) {
        setTenders([tender, ...tenders] as any);
        toast.success("Private tender found!");
      } else {
        toast.info("Tender is already in the list");
      }
    } catch (err) {
      toast.error("Failed to search");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4 relative">
      <Toaster position="bottom-right" />
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Open Tenders</h1>
          <p className="text-muted-foreground">Browse published tenders and start your application.</p>
        </div>
        <button 
          onClick={() => navigate('/bidder/applications')}
          className="text-blue-600 font-medium hover:underline"
        >
          View My Applications
        </button>
      </div>

      <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <div>
          <h3 className="font-semibold text-slate-800 flex items-center gap-2">
            <Lock size={18} className="text-slate-500" />
            Access a Private Tender
          </h3>
          <p className="text-sm text-slate-500 mt-1">Enter a secure Tender Reference Number to request access.</p>
        </div>
        <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto">
          <input 
            type="text" 
            placeholder="e.g. GEM/2026/B/..." 
            value={searchId}
            onChange={e => setSearchId(e.target.value)}
            className="border border-slate-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none w-full md:w-64"
          />
          <button type="submit" disabled={isSearching || !searchId} className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-900 transition disabled:opacity-50">
            {isSearching ? 'Searching...' : 'Search'}
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="p-8 text-center text-slate-500 col-span-2">Loading open tenders...</div>
        ) : tenders.length === 0 ? (
          <div className="p-8 text-center text-slate-500 col-span-2">No open tenders available right now.</div>
        ) : (
          tenders.map((t: any) => (
            <div key={t.id} className={`rounded-xl shadow-sm border p-6 flex flex-col justify-between ${t.access_type === 'private' ? 'bg-amber-50 border-amber-200' : 'bg-white border-slate-200'}`}>
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg leading-tight flex items-center gap-2">
                      {t.access_type === 'private' && <Lock size={16} className="text-amber-600" />}
                      {t.title}
                    </h3>
                    {t.tender_no && <div className="text-xs text-slate-500 font-mono mt-1">{t.tender_no}</div>}
                  </div>
                  <span className="px-2 py-1 rounded bg-slate-100 text-slate-600 text-xs font-medium">{t.category}</span>
                </div>
                <p className="text-sm text-slate-500 mb-4">Organization: {t.organization}</p>
                
                <div className="grid grid-cols-2 gap-2 border-t border-slate-100 pt-4 mb-6">
                   <div>
                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Closing Date</p>
                     <p className="text-sm font-semibold text-slate-700">{t.closing_date ? new Date(t.closing_date).toLocaleDateString('en-GB') : 'N/A'}</p>
                   </div>
                   <div>
                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Est. Value</p>
                     <p className="text-sm font-semibold text-blue-700">{t.est_value ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(t.est_value) : 'N/A'}</p>
                   </div>
                </div>
              </div>
              <button 
                onClick={() => handleApply(t.id, t.access_type === 'private', t.title)}
                className={`w-full py-2 rounded font-medium flex items-center justify-center gap-2 transition ${
                  t.access_type === 'private' 
                    ? 'bg-amber-600 hover:bg-amber-700 text-white' 
                    : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                }`}
              >
                {t.access_type === 'private' ? (
                  <>Request Access <Lock size={16} /></>
                ) : (
                  <>Start Application <Play size={16} /></>
                )}
              </button>
            </div>
          ))
        )}
      </div>
      {passwordPrompt && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 text-amber-600 mb-4">
              <Lock size={24} />
              <h2 className="text-xl font-bold text-slate-800">Private Tender</h2>
            </div>
            <p className="text-slate-600 mb-4 text-sm">
              <strong>{passwordPrompt.title}</strong> is a limited tender. Please enter the access password provided by the inviting authority to proceed.
            </p>
            <input 
              type="password" 
              placeholder="Enter Password"
              value={tenderPassword}
              onChange={(e) => setTenderPassword(e.target.value)}
              className="w-full border-slate-300 rounded-lg p-3 border focus:ring-blue-500 focus:border-blue-500 mb-6"
            />
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => { setPasswordPrompt(null); setTenderPassword(''); }}
                className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded"
              >
                Cancel
              </button>
              <button 
                onClick={() => submitApplication(passwordPrompt.tenderId, tenderPassword)}
                className="px-4 py-2 bg-blue-600 text-white font-medium hover:bg-blue-700 rounded shadow"
              >
                Unlock & Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
