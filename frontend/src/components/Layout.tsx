import { ReactNode } from 'react';
import { FileText, ClipboardCheck, History, Settings, ShieldCheck, HelpCircle } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const bidIdMatch = location.pathname.match(/\/bids\/([^\/]+)/);
  const currentBidId = bidIdMatch ? bidIdMatch[1] : null;

  const navItems = [
    { name: 'How to Use', icon: HelpCircle, path: '/guide', activeMatch: '/guide' },
    { name: 'Bid Detail', icon: FileText, path: '/bids', activeMatch: '/bids' },
    { 
      name: 'Scorecard', 
      icon: ClipboardCheck, 
      path: currentBidId ? `/bids/${currentBidId}/scorecard` : '#', 
      disabled: !currentBidId 
    },
    { 
      name: 'Audit Trail', 
      icon: History, 
      path: currentBidId ? `/bids/${currentBidId}/audit` : '#', 
      disabled: !currentBidId 
    },
    { name: 'Rules Config', icon: Settings, path: '/rules' },
    { name: 'Bidder Self-Check', icon: ShieldCheck, path: '/self-check' },
  ];

  return (
    <div className="flex h-screen bg-background">
      <aside className="w-64 bg-surface border-r border-border p-4 flex flex-col">
        <div className="flex items-center gap-2 px-2 mb-8">
          <div className="w-8 h-8 rounded bg-brand flex items-center justify-center text-white font-bold">G</div>
          <span className="font-semibold text-lg text-brand">ComplianceLens</span>
        </div>
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.activeMatch && location.pathname === item.activeMatch);
            
            return item.disabled ? (
              <div key={item.name} className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-gray-400 cursor-not-allowed">
                <item.icon className="w-5 h-5 opacity-50" />
                {item.name}
              </div>
            ) : (
              <NavLink
                key={item.name}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive ? "bg-brand text-white" : "text-textSecondary hover:bg-gray-100 hover:text-textPrimary"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </NavLink>
            );
          })}
        </nav>
      </aside>
      <main className="flex-1 overflow-auto p-8">
        {children}
      </main>
    </div>
  );
}
