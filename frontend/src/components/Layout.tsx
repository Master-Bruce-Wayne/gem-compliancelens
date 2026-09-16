import { ReactNode } from 'react';
import { FileText, ClipboardCheck, History, Settings, ShieldCheck, HelpCircle, LogOut, UploadCloud } from 'lucide-react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const role = user?.role || 'officer';

  const bidIdMatch = location.pathname.match(/\/bids\/([^\/]+)/);
  const currentBidId = bidIdMatch ? bidIdMatch[1] : null;

  const officerNavItems = [
    { name: 'How to Use', icon: HelpCircle, path: '/officer/guide', activeMatch: '/officer/guide' },
    { name: 'Submitted Bids', icon: FileText, path: '/officer/bids', activeMatch: '/officer/bids' },
    { 
      name: 'Scorecard', 
      icon: ClipboardCheck, 
      path: currentBidId ? `/officer/bids/${currentBidId}/scorecard` : '#', 
      disabled: !currentBidId 
    },
    { 
      name: 'Audit Trail', 
      icon: History, 
      path: currentBidId ? `/officer/bids/${currentBidId}/audit` : '#', 
      disabled: !currentBidId 
    },
    { name: 'Rules Config', icon: Settings, path: '/officer/rules' },
  ];

  const bidderNavItems = [
    { name: 'How to Use', icon: HelpCircle, path: '/bidder/guide' },
    { name: 'My Dashboard', icon: ShieldCheck, path: '/bidder/dashboard' },
    { name: 'Submit Bid', icon: UploadCloud, path: '/bidder/submit', disabled: true }, // For Phase 2
  ];

  const navItems = role === 'officer' ? officerNavItems : bidderNavItems;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-background">
      <aside className="w-full md:w-64 bg-surface border-b md:border-b-0 md:border-r border-border p-4 flex flex-col flex-none justify-between">
        <div>
          <div className="flex items-center gap-2 px-2 mb-4 md:mb-8">
            <div className="w-8 h-8 rounded bg-brand flex items-center justify-center text-white font-bold flex-shrink-0">G</div>
            <span className="font-semibold text-lg text-brand whitespace-nowrap">ComplianceLens</span>
          </div>
          
          {user && (
            <div className="px-3 mb-6">
              <div className="text-xs text-textSecondary uppercase tracking-wider font-bold mb-1">{role} Portal</div>
              <div className="text-sm font-medium truncate">{user.name}</div>
            </div>
          )}

          <nav className="flex md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0 snap-x">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path || (item.activeMatch && location.pathname === item.activeMatch);
              
              return item.disabled ? (
                <div key={item.name} className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-400 cursor-not-allowed whitespace-nowrap snap-start flex-shrink-0">
                  <item.icon className="w-5 h-5 opacity-50" />
                  {item.name}
                </div>
              ) : (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap snap-start flex-shrink-0",
                    isActive ? "bg-brand text-white" : "text-textSecondary hover:bg-gray-100 hover:text-textPrimary"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto hidden md:block pt-4 border-t border-border">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 w-full rounded-md text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto p-4 md:p-8">
        {children}
      </main>
    </div>
  );
}
