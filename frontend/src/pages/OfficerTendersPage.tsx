import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, FileText } from 'lucide-react';

export default function OfficerTendersPage() {
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

  const createDraft = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/v1/tenders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "New Tender " + new Date().toISOString().slice(0,10),
        organization: "Government",
        category: "General"
      })
    });
    if (res.ok) {
      const data = await res.json();
      navigate(`/officer/tenders/${data.id}`);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tenders Dashboard</h1>
          <p className="text-muted-foreground">Manage active tenders and review incoming bid applications.</p>
        </div>
        <button 
          onClick={createDraft}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow flex items-center gap-2 hover:bg-blue-700 transition"
        >
          <Plus size={18} /> Create Tender
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading tenders...</div>
        ) : tenders.length === 0 ? (
          <div className="p-8 text-center text-slate-500">No published tenders. Create one to get started.</div>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Tender Title</th>
                <th className="px-6 py-4">Organization</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tenders.map((t: any) => (
                <tr key={t.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium flex items-center gap-3">
                    <FileText className="text-slate-400" size={18} />
                    {t.title}
                  </td>
                  <td className="px-6 py-4 text-slate-600">{t.organization}</td>
                  <td className="px-6 py-4 text-slate-600">{t.category}</td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => navigate(`/officer/tenders/${t.id}`)}
                      className="text-blue-600 font-medium hover:underline"
                    >
                      View & Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
