import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FileText, Users, Search, AlertCircle, Settings, CheckCircle2 } from 'lucide-react';

export default function OfficerTenderDetailPage() {
  const { tenderId } = useParams();
  const navigate = useNavigate();
  const [tender, setTender] = useState<any>(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/v1/tenders/${tenderId}`).then(r => r.json()),
      fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/v1/tenders/${tenderId}/applications`).then(r => r.json())
    ]).then(([tenderData, appsData]) => {
      setTender(tenderData);
      setApplications(appsData);
      setLoading(false);
    });
  }, [tenderId]);

  const handleEvaluate = async (appId: string) => {
    const userStr = localStorage.getItem('user');
    const officerId = userStr ? JSON.parse(userStr).id : "";
    
    const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/v1/bids/${appId}/evaluate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ officerId })
    });
    
    if (res.ok) {
      navigate(`/officer/bids/${appId}/scorecard`);
    } else {
      alert("Failed to start evaluation");
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading tender details...</div>;

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold tracking-tight mb-2">{tender.title}</h1>
            <div className="flex gap-4 text-sm text-slate-600">
              <span className="flex items-center gap-1"><FileText size={16}/> {tender.category}</span>
              <span className="flex items-center gap-1"><Users size={16}/> {tender.organization}</span>
              <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold uppercase">{tender.status}</span>
            </div>
          </div>
          <button 
            onClick={() => navigate(`/officer/rules?tenderId=${tender.id}`)}
            className="flex items-center gap-2 text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded transition"
          >
            <Settings size={18} /> Manage Rules
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50">
          <h2 className="text-lg font-semibold">Bid Applications Queue</h2>
        </div>
        
        {applications.length === 0 ? (
          <div className="p-8 text-center text-slate-500">No applications received yet.</div>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="bg-white text-slate-600 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Application ID</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Submitted Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {applications.map((app: any) => (
                <tr key={app.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium font-mono text-xs">{app.id}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      app.status === 'submitted' ? 'bg-amber-100 text-amber-700' :
                      app.status === 'under_evaluation' ? 'bg-blue-100 text-blue-700' :
                      app.status === 'qualified' ? 'bg-green-100 text-green-700' :
                      app.status === 'clarification_requested' ? 'bg-purple-100 text-purple-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {app.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {app.submittedAt ? new Date(app.submittedAt).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {app.status === 'draft' ? (
                      <span className="text-slate-400">Not Submitted</span>
                    ) : (
                      <button 
                        onClick={() => handleEvaluate(app.id)}
                        className="text-blue-600 font-medium hover:underline flex items-center justify-end gap-1 w-full"
                      >
                        {['qualified', 'disqualified'].includes(app.status) ? 'View Scorecard' : 'Evaluate'} 
                      </button>
                    )}
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
