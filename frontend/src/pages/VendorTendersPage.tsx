import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Search, Play } from 'lucide-react';

export default function VendorTendersPage() {
  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/v1/tenders/open`)
      .then(res => res.json())
      .then(data => {
        setTenders(data);
        setLoading(false);
      });
  }, []);

  const handleApply = async (tenderId: string) => {
    const userStr = localStorage.getItem('user');
    const bidderId = userStr ? JSON.parse(userStr).id : "";
    
    const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/v1/bids`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tenderId, bidderId })
    });
    
    if (res.ok) {
      const data = await res.json();
      navigate(`/bidder/applications/${data.id}`);
    } else {
      alert("Failed to start application");
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="p-8 text-center text-slate-500 col-span-2">Loading open tenders...</div>
        ) : tenders.length === 0 ? (
          <div className="p-8 text-center text-slate-500 col-span-2">No open tenders available right now.</div>
        ) : (
          tenders.map((t: any) => (
            <div key={t.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-semibold text-lg leading-tight">{t.title}</h3>
                  <span className="px-2 py-1 rounded bg-slate-100 text-slate-600 text-xs font-medium">{t.category}</span>
                </div>
                <p className="text-sm text-slate-500 mb-6">Organization: {t.organization}</p>
              </div>
              <button 
                onClick={() => handleApply(t.id)}
                className="w-full bg-blue-50 text-blue-700 hover:bg-blue-100 py-2 rounded font-medium flex items-center justify-center gap-2 transition"
              >
                Start Application <Play size={16} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
