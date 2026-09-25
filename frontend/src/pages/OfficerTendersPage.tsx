import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FileText, X } from 'lucide-react';

export default function OfficerTendersPage() {
  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newOrg, setNewOrg] = useState('Ministry of Defence');
  const [newCategory, setNewCategory] = useState('IT Equipment');
  const [newClosingDate, setNewClosingDate] = useState('');
  const [newEstValue, setNewEstValue] = useState('');
  const [newEmdAmount, setNewEmdAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/v1/tenders`)
      .then(res => res.json())
      .then(data => {
        setTenders(data);
        setLoading(false);
      });
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    
    setIsSubmitting(true);
    const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/v1/tenders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: newTitle,
        organization: newOrg,
        category: newCategory,
        closing_date: newClosingDate ? new Date(newClosingDate).toISOString() : null,
        est_value: newEstValue ? parseFloat(newEstValue) : null,
        emd_amount: newEmdAmount ? parseFloat(newEmdAmount) : null
      })
    });
    
    if (res.ok) {
      const data = await res.json();
      navigate(`/officer/tenders/${data.id}`);
    } else {
      setIsSubmitting(false);
      alert("Failed to create tender");
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4 relative">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tenders Dashboard</h1>
          <p className="text-muted-foreground">Manage active tenders and review incoming bid applications.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
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
                <th className="px-6 py-4">Bids</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tenders.map((t: any) => (
                <tr key={t.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium flex items-center gap-3">
                    <FileText className="text-slate-400" size={18} />
                    <div>
                      <div className="flex items-center gap-2">
                         {t.title}
                         {t.access_type === 'private' && <span className="bg-amber-100 text-amber-700 text-[10px] uppercase px-1.5 py-0.5 rounded font-bold">Private</span>}
                      </div>
                      {t.tender_no && <div className="text-xs text-slate-500 font-mono mt-0.5">{t.tender_no}</div>}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{t.organization}</td>
                  <td className="px-6 py-4 text-slate-600">{t.category}</td>
                  <td className="px-6 py-4 text-slate-600 font-medium">
                     {t.bidsCount || 0}
                  </td>
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

      {/* Create Tender Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <h3 className="font-semibold text-lg text-slate-900">Create New Tender</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleCreate} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tender Title</label>
                <input 
                  autoFocus
                  type="text" 
                  required
                  placeholder="e.g. Procurement of 500 Laptops"
                  value={newTitle} 
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Organization / Buyer</label>
                <input 
                  type="text" 
                  required
                  value={newOrg} 
                  onChange={e => setNewOrg(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <select 
                  value={newCategory} 
                  onChange={e => setNewCategory(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                >
                  <option value="IT Equipment">IT Equipment</option>
                  <option value="Vehicles">Vehicles</option>
                  <option value="Stationery">Stationery</option>
                  <option value="Services">Services</option>
                  <option value="General">General</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Closing Date</label>
                  <input 
                    type="datetime-local" 
                    value={newClosingDate} 
                    onChange={e => setNewClosingDate(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Estimated Value (₹)</label>
                  <input 
                    type="number" 
                    placeholder="e.g. 485000000"
                    value={newEstValue} 
                    onChange={e => setNewEstValue(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">EMD Guarantee Amount (₹)</label>
                <input 
                  type="number" 
                  placeholder="e.g. 250000"
                  value={newEmdAmount} 
                  onChange={e => setNewEmdAmount(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting || !newTitle.trim()}
                  className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {isSubmitting ? 'Creating...' : 'Create Draft'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
