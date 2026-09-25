import React, { useState, useEffect } from 'react';
import { Bell, Check, Clock } from 'lucide-react';
import { cn } from '../lib/utils';
import { useTranslation } from 'react-i18next';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    const userStr = localStorage.getItem('user');
    const userId = userStr ? JSON.parse(userStr).id : "";
    
    if (!userId) return;
    
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/v1/notifications?userId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/v1/notifications/${id}/read`, {
        method: 'POST'
      });
      setNotifications(notifications.map((n: any) => n.id === id ? { ...n, readAt: new Date().toISOString() } : n));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto p-4">
      <div className="flex items-center gap-3 mb-6">
        <Bell className="w-6 h-6 text-slate-800" />
        <h1 className="text-2xl font-bold tracking-tight">{t('notifications.title')}</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500">{t('notifications.loading')}</div>
        ) : notifications.length === 0 ? (
          <div className="p-12 text-center text-slate-500 flex flex-col items-center">
            <Bell className="w-12 h-12 text-slate-300 mb-4" />
            <p>{t('notifications.empty')}</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {notifications.map((n: any) => (
              <div 
                key={n.id} 
                className={cn(
                  "p-4 transition-colors flex items-start justify-between gap-4",
                  n.readAt ? "bg-white" : "bg-blue-50/50"
                )}
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {!n.readAt && <span className="w-2 h-2 rounded-full bg-blue-600"></span>}
                    <h3 className={cn("font-semibold text-sm", n.readAt ? "text-slate-700" : "text-slate-900")}>
                      {n.title}
                    </h3>
                  </div>
                  <p className="text-sm text-slate-600">{n.body}</p>
                  <div className="flex items-center gap-1 mt-2 text-xs text-slate-400">
                    <Clock className="w-3 h-3" />
                    {new Date(n.createdAt).toLocaleString()}
                  </div>
                </div>
                {!n.readAt && (
                  <button 
                    onClick={() => markAsRead(n.id)}
                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                    title="Mark as read"
                  >
                    <Check className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
