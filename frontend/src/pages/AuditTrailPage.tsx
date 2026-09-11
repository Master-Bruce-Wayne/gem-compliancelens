import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Download, Filter, User, Activity, FileText, CheckSquare, Search } from 'lucide-react';
import { cn } from '../lib/utils';
import { toast } from 'sonner';

export default function AuditTrailPage() {
  const { bidId } = useParams();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    if (!bidId) return;
    
    // Default fetch to populate audit events
    fetch(`http://localhost:8000/api/v1/bids/${bidId}/audit-log`)
      .then(res => res.json())
      .then(data => {
        setEvents(data.events || []);
        setLoading(false);
      })
      .catch(err => {
        toast.error("Could not load audit trail");
        setLoading(false);
      });
  }, [bidId]);

  if (loading) return <div className="flex h-full items-center justify-center">Loading audit log...</div>;

  const filteredEvents = events.filter((e: any) => {
    if (filter === 'All') return true;
    if (filter === 'Document' && e.type.includes('document')) return true;
    if (filter === 'Evaluation' && e.type === 'evaluation_run') return true;
    if (filter === 'Decision' && e.type === 'decision_submitted') return true;
    return false;
  });

  const getEventIcon = (type: string) => {
    if (type.includes('document')) return <FileText className="w-5 h-5" />;
    if (type === 'evaluation_run') return <Activity className="w-5 h-5" />;
    if (type === 'decision_submitted') return <CheckSquare className="w-5 h-5" />;
    return <Search className="w-5 h-5" />;
  };

  const getEventColor = (type: string) => {
    if (type.includes('document')) return 'bg-blue-100 text-blue-600';
    if (type === 'evaluation_run') return 'bg-purple-100 text-purple-600';
    if (type === 'decision_submitted') return 'bg-green-100 text-green-600';
    return 'bg-gray-100 text-gray-600';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-textPrimary">Audit Trail Log</h1>
          <p className="text-textSecondary text-sm mt-1">Immutable record of all actions for Bid {bidId}</p>
        </div>
        <button 
          onClick={() => toast.success("Exporting to PDF...")}
          className="flex items-center gap-2 px-4 py-2 border border-border bg-surface rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          <Download className="w-4 h-4" />
          Export PDF
        </button>
      </header>

      <div className="bg-surface border border-border rounded-xl shadow-sm p-2 flex items-center gap-2 mb-6">
        <Filter className="w-4 h-4 text-gray-400 ml-2" />
        {['All', 'Document', 'Evaluation', 'Decision'].map(f => (
          <button 
            key={f} 
            onClick={() => setFilter(f)}
            className={cn("px-4 py-1.5 rounded-lg text-sm font-medium transition-colors", 
              filter === f ? "bg-brand text-white shadow-sm" : "text-textSecondary hover:text-textPrimary hover:bg-gray-100"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="bg-surface border border-border rounded-xl shadow-sm p-6">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-10 text-gray-500">No events found matching this filter.</div>
        ) : (
          <div className="relative border-l-2 border-gray-100 ml-4 space-y-8 pb-4">
            {filteredEvents.map((event, idx) => (
              <div key={idx} className="relative pl-8">
                <div className={cn("absolute -left-3.5 top-0 w-7 h-7 rounded-full flex items-center justify-center ring-4 ring-white", getEventColor(event.type))}>
                  {getEventIcon(event.type)}
                </div>
                
                <div className="bg-white border border-border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-textPrimary capitalize">
                      {event.type.replace('_', ' ')}
                    </h3>
                    <span className="text-xs text-textSecondary font-medium">
                      {new Date(event.timestamp).toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-4 font-mono bg-gray-50 p-2 rounded">
                    {JSON.stringify(event.details, null, 2)}
                  </div>
                  
                  <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                    <User className="w-3.5 h-3.5" />
                    {event.actor ? `Actor ID: ${event.actor.slice(0, 8)}...` : 'System Process'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
