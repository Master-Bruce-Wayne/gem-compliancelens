import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ScorecardPage from './pages/ScorecardPage';
import BidDetailPage from './pages/BidDetailPage';
import Layout from './components/Layout';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/bids" replace />} />
          <Route path="/bids" element={<BidDetailPage />} />
          <Route path="/bids/:bidId/scorecard" element={<ScorecardPage />} />
          {/* Add more routes as needed */}
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
