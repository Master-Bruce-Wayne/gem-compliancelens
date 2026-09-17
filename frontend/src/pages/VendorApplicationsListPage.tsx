import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, ChevronRight } from 'lucide-react';

export default function VendorApplicationsListPage() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    const bidderId = userStr ? JSON.parse(userStr).id : "";
    
    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/v1/bids/mine?bidderId=${bidderId}`)
      .then(res => res.json())
      .then(data => {
        setApps(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Applications</h1>
          <p className="text-muted-foreground">Track the status of your tender applications.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading applications...</div>
        ) : apps.length === 0 ? (
          <div className="p-8 text-center text-slate-500">You haven't started any applications yet.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {apps.map((app: any) => (
              <div 
                key={app.id} 
                onClick={() => navigate(`/bidder/applications/${app.id}`)}
                className="p-6 hover:bg-slate-50 cursor-pointer flex justify-between items-center transition"
              >
                <div>
                  <h3 className="font-semibold text-lg">{app.tenderName}</h3>
                  <div className="flex gap-4 mt-2 text-sm text-slate-500">
                    <span>ID: {app.id.substring(0,8)}</span>
                    {app.submittedAt && <span>Submitted: {new Date(app.submittedAt).toLocaleDateString()}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                    app.status === 'draft' ? 'bg-slate-100 text-slate-600' :
                    app.status === 'qualified' ? 'bg-green-100 text-green-700' :
                    app.status === 'clarification_requested' ? 'bg-purple-100 text-purple-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {app.status.replace('_', ' ')}
                  </span>
                  <ChevronRight className="text-slate-400" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
