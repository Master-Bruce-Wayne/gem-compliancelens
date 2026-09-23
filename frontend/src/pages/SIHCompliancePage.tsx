import { useState } from 'react';
import { CheckCircle2, AlertCircle, Clock, Search, ShieldAlert, Cpu, Network, Lock } from 'lucide-react';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';

export default function SIHCompliancePage() {
  const navigate = useNavigate();
  const [selectedReq, setSelectedReq] = useState<number | null>(null);

  const requirements = [
    { id: 1, title: 'Integrate with Govt portals', status: 'Semi-Complete', icon: Network, short: 'Architecture built via Provider Pattern', details: 'We built the exact architectural interface (DigiLockerProvider). The system is wired to seamlessly pull external data, currently using a secure Demo Stub.', limit: 'Requires Institutional approval to get live OAuth keys from MCA, GSTN, and DigiLocker.' },
    { id: 2, title: 'Verify Udyam/MSME status', status: 'Complete', icon: CheckCircle2, short: 'Automated AI Extraction', details: 'Our AI pipeline automatically extracts and structurally verifies Udyam registration numbers from uploaded certificates.', limit: 'Live ping to Udyam API to verify real-time revocation status is post-SIH.' },
    { id: 3, title: 'Verify GST & Returns', status: 'Semi-Complete', icon: Clock, short: 'OCR Extraction Active', details: 'Extracts GSTIN via OCR flawlessly.', limit: 'Needs GSTN Sandbox API access to check "return filing status".' },
    { id: 4, title: 'Verify PAN & Income Tax', status: 'Complete', icon: CheckCircle2, short: 'Checksum & Format Validation', details: 'Extracts PAN, runs structural checksum verification to ensure format validity.', limit: 'Direct integration with Income Tax API is planned.' },
    { id: 5, title: 'Make in India / Local Content', status: 'Complete', icon: CheckCircle2, short: 'Dynamic AST Rule Engine', details: 'Handled beautifully by our Deterministic Rule Engine. Officers can dynamically set % thresholds for local content per tender.', limit: 'Fully operational.' },
    { id: 6, title: 'Verify EPFO/ESIC', status: 'Semi-Complete', icon: Clock, short: 'Vault Support Active', details: 'Supported natively in our Document Vault dropdowns and basic extraction pipeline.', limit: 'Need to train custom layout parsers specifically for complex EPFO forms.' },
    { id: 7, title: 'Startup India, NSIC, OEM', status: 'Complete', icon: CheckCircle2, short: 'DIPP Pattern Recognition', details: 'Upgraded OCRService to detect DIPP (Startup India) & NSIC format patterns. Expanded frontend UI.', limit: 'Fully operational.' },
    { id: 8, title: 'DigiLocker Verification', status: 'Complete', icon: CheckCircle2, short: 'End-to-End Demo Mode', details: 'Fully mocked end-to-end. Includes simulated consent screen, API pull, and secure digital signature validation in our Forgery layer.', limit: 'Just need to swap DIGILOCKER_MODE to live and add Client IDs.' },
    { id: 9, title: 'Blacklisting & Debarment', status: 'Complete', icon: ShieldAlert, short: 'Live DB Query Engine', details: 'Added debarred_vendors DB table. The Rule Engine now queries this table using the bidder PAN to instantly flag high-risk bids.', limit: 'Live sync with CPPP Debarment API is pending.' },
    { id: 10, title: 'Tender-Specific Compliance', status: 'Complete', icon: CheckCircle2, short: 'Phase 5 Rules Config', details: 'Our RulesConfigPage allows Officers to define entirely custom parameters for any individual tender.', limit: 'Fully operational.' },
    { id: 11, title: 'AI Identifies Missing Info', status: 'Complete', icon: Cpu, short: 'Strict Gatekeeper', details: 'Our Strict Vault Gatekeeper rejects uploads missing required fields. Our LLM-Consistency Check detects logical contradictions.', limit: 'Fully operational.' },
    { id: 12, title: 'Compliance Score & Risk Level', status: 'Complete', icon: CheckCircle2, short: 'Dashboard Readiness Score', details: 'The Bidder Dashboard features a dynamic "Vault Readiness Score" (/100) based on extraction success.', limit: 'Expand risk scoring to include historical bid failures.' },
    { id: 13, title: 'AI Recommendations to Officer', status: 'Complete', icon: CheckCircle2, short: 'Decision-Support Tool', details: 'The UI explicitly surfaces "Needs Manual Review" or "Verified" badges alongside extracted evidence, acting as a decision-support tool.', limit: 'Fully operational.' },
    { id: 14, title: 'Maintain Auditable Record', status: 'Complete', icon: Lock, short: 'Cryptographic Hash Chain', details: 'We built an internal Cryptographic Hash Chain into PostgreSQL. Every audit_log row computes a SHA-256 hash using the previous row hash. This acts as an Immutable Pseudo-Blockchain!', limit: 'Fully operational.' },
  ];

  const xFactors = [
    { title: 'Multi-Layer Forensic Forgery Detection', desc: 'Checks Hash Reuse (collusion), PDF Metadata (Photoshop edits), and Error Level Analysis (ELA image pixels).' },
    { title: 'Graceful Degradation (3-Strike Rule)', desc: 'If the AI fails to read a blurry document 3 times, it degrades gracefully to a "Manual Review Queue" for zero operational downtime.' },
    { title: 'Deterministic Evaluation', desc: 'AI is used for extraction only. The final Pass/Fail is executed by an Abstract Syntax Tree (AST) Rule Engine to prevent hallucinations.' },
    { title: 'Enterprise "Provider Pattern"', desc: 'System architecture can seamlessly switch between Demo and Live environments via environment variables without rewriting business logic.' }
  ];

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Complete': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Semi-Complete': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      default: return 'bg-slate-100 text-slate-300 border-white/10';
    }
  };

  return (
    <div className="dark min-h-screen bg-obsidian-950 text-slate-300 font-sans grid-subtle">
      {/* Top Navbar */}
      <header className="bg-obsidian-900 border-b border-white/10 h-16 flex items-center justify-between px-6 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-emerald-500 text-obsidian-950 flex items-center justify-center text-white font-bold">G</div>
          <span className="font-bold text-xl text-slate-100">SIH 2026 <span className="text-sm font-medium text-slate-400 ml-2">| Compliance Matrix Flowchart</span></span>
        </div>
        <button 
          onClick={() => navigate('/')}
          className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-md font-medium text-sm transition-colors"
        >
          &larr; Back to Home
        </button>
      </header>
      
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h1 className="text-4xl font-extrabold text-white">Prototype vs Requirements</h1>
          <p className="text-lg text-slate-400">
            An interactive flowchart mapping the 14 Smart India Hackathon problem statement requirements directly to our working GeM ComplianceLens prototype.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Main Requirements Flowchart */}
          <div className="lg:col-span-3 space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Search className="w-6 h-6 text-champagne-400" /> The 14 Expected Solutions
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {requirements.map(req => (
                <div 
                  key={req.id}
                  onClick={() => setSelectedReq(selectedReq === req.id ? null : req.id)}
                  className={cn(
                    "p-5 rounded-xl border transition-all cursor-pointer relative overflow-hidden",
                    selectedReq === req.id ? "bg-obsidian-900 border-champagne-400/50 shadow-md ring-2 ring-blue-50" : "bg-obsidian-900 border-white/10 hover:border-champagne-400/30 hover:shadow-sm"
                  )}
                >
                  {selectedReq === req.id && <div className="absolute top-0 left-0 w-1 h-full bg-obsidian-8000"></div>}
                  
                  <div className="flex justify-between items-start mb-3">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-500 text-xs font-bold shrink-0 mr-3">
                      {req.id}
                    </span>
                    <h3 className={cn("font-bold text-sm flex-1", selectedReq === req.id ? "text-champagne-300" : "text-white")}>
                      {req.title}
                    </h3>
                    <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ml-2", getStatusColor(req.status))}>
                      {req.status}
                    </span>
                  </div>
                  
                  {!selectedReq || selectedReq !== req.id ? (
                    <p className="text-sm text-slate-500 pl-9">{req.short}</p>
                  ) : null}

                  {selectedReq === req.id && (
                    <div className="pl-9 mt-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">How it Works</span>
                        <p className="text-sm text-slate-300 leading-relaxed bg-obsidian-800/50 p-3 rounded-lg border border-white/10">{req.details}</p>
                      </div>
                      <div>
                        <span className="text-xs font-bold text-amber-500 uppercase tracking-wider block mb-1">Post-SIH Limitation</span>
                        <p className="text-xs text-slate-400 italic bg-amber-50/50 p-3 rounded-lg border border-amber-100">{req.limit}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* X-Factor Side Panel */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl sticky top-24">
              <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-400" /> The X-Factor
              </h2>
              <p className="text-xs text-slate-400 mb-6">Extra features built beyond the prompt requirements demonstrating enterprise scale.</p>
              
              <div className="space-y-4">
                {xFactors.map((xf, i) => (
                  <div key={i} className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                    <h4 className="font-bold text-sm text-blue-300 mb-1">{xf.title}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">{xf.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
