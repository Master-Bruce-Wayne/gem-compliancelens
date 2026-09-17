import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import ScorecardPage from './pages/ScorecardPage';
import BidDetailPage from './pages/BidDetailPage';
import AuditTrailPage from './pages/AuditTrailPage';
import SelfCheckPage from './pages/SelfCheckPage';
import BidderSubmitPage from "./pages/BidderSubmitPage";
import RulesConfigPage from './pages/RulesConfigPage';
import GuidePage from './pages/GuidePage';
import LoginPage from './pages/LoginPage';
import Layout from './components/Layout';

// Protect routes based on role
function ProtectedRoute({ children, allowedRole }: { children: JSX.Element, allowedRole: string }) {
  const userStr = localStorage.getItem('user');
  if (!userStr) return <Navigate to="/login" replace />;
  
  const user = JSON.parse(userStr);
  if (user.role !== allowedRole) {
    return <Navigate to={`/${user.role}/guide`} replace />;
  }
  
  return children;
}

function AppContent() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login';

  return (
    <>
      {isAuthPage ? (
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      ) : (
        <Layout>
          <Routes>
            {/* Common / Redirects */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            
            {/* Officer Gateway */}
            <Route path="/officer/guide" element={<ProtectedRoute allowedRole="officer"><GuidePage /></ProtectedRoute>} />
            <Route path="/officer/bids" element={<ProtectedRoute allowedRole="officer"><BidDetailPage /></ProtectedRoute>} />
            <Route path="/officer/bids/:bidId/scorecard" element={<ProtectedRoute allowedRole="officer"><ScorecardPage /></ProtectedRoute>} />
            <Route path="/officer/bids/:bidId/audit" element={<ProtectedRoute allowedRole="officer"><AuditTrailPage /></ProtectedRoute>} />
            <Route path="/officer/rules" element={<ProtectedRoute allowedRole="officer"><RulesConfigPage /></ProtectedRoute>} />

            {/* Bidder Gateway */}
            <Route path="/bidder/guide" element={<ProtectedRoute allowedRole="bidder"><GuidePage /></ProtectedRoute>} />
            
            <Route path="/bidder/submit" element={<ProtectedRoute allowedRole="bidder"><BidderSubmitPage /></ProtectedRoute>} />
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Layout>
      )}
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
