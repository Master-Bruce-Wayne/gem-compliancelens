import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Search, Play, Lock, AlertCircle } from 'lucide-react';
import { toast, Toaster } from 'sonner';

export default function VendorTendersPage() {
  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchId, setSearchId] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/v1/tenders/open`)
      .then(res => res.json())
      .then(data => {
        setTenders(data);
        setLoading(false);
      });
  }, []);

  const handleApply = async (tenderId: string, isPrivate: boolean = false) => {
    const userStr = localStorage.getItem('user');
    const bidderId = userStr ? JSON.parse(userStr).id : "";
    
    const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/v1/bids`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tenderId, bidderId })
    });
    
    if (res.ok) {
      const data = await res.json();
      if (data.status === 'access_pending') {
        toast.success("Access requested successfully! Please wait for the officer to approve.");
      } else if (data.status === 'access_denied') {
        toast.error("Your access request was denied for this tender.");
      } else {
        navigate(`/bidder/applications/${data.id}`);
      }
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
                <p className="text-sm text-slate-500 mb-6">Organization: {t.organization}</p>
              </div>
              <button 
                onClick={() => handleApply(t.id, t.access_type === 'private')}
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
    </div>
  );
}
