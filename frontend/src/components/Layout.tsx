import { ReactNode } from 'react';
import { FileText, ClipboardCheck, History, Settings } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '../lib/utils';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const navItems = [
    { name: 'Bid Detail', icon: FileText, path: '/bids/demo-123' },
    { name: 'Scorecard', icon: ClipboardCheck, path: '/bids/demo-123/scorecard' },
    { name: 'Audit Trail', icon: History, path: '/bids/demo-123/audit' },
    { name: 'Rules', icon: Settings, path: '/tenders/demo-tender/rules' },
  ];

  return (
    <div className="flex h-screen bg-background">
      <aside className="w-64 bg-surface border-r border-border p-4 flex flex-col">
        <div className="flex items-center gap-2 px-2 mb-8">
          <div className="w-8 h-8 rounded bg-brand flex items-center justify-center text-white font-bold">G</div>
          <span className="font-semibold text-lg text-brand">ComplianceLens</span>
        </div>
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive ? "bg-brand text-white" : "text-textSecondary hover:bg-gray-100 hover:text-textPrimary"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="flex-1 overflow-auto p-8">
        {children}
      </main>
    </div>
  );
}
