import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ScorecardPage from './pages/ScorecardPage';
import BidDetailPage from './pages/BidDetailPage';
import AuditTrailPage from './pages/AuditTrailPage';
import SelfCheckPage from './pages/SelfCheckPage';
import RulesConfigPage from './pages/RulesConfigPage';
import Layout from './components/Layout';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/bids" replace />} />
          <Route path="/bids" element={<BidDetailPage />} />
          <Route path="/bids/:bidId/scorecard" element={<ScorecardPage />} />
          <Route path="/bids/:bidId/audit" element={<AuditTrailPage />} />
          <Route path="/self-check" element={<SelfCheckPage />} />
          <Route path="/rules" element={<RulesConfigPage />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
