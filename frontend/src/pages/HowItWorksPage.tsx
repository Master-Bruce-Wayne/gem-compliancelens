import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function HowItWorksPage() {
  const navigate = useNavigate();
  const user = localStorage.getItem('user');
  const role = user ? JSON.parse(user).role : null;
  const [activeTab, setActiveTab] = useState<'bidder' | 'officer'>('bidder');

  return (
    <div className="dark min-h-screen bg-obsidian-950 text-slate-200 antialiased selection:bg-slate-700 selection:text-white font-sans relative">
      
      <style dangerouslySetInnerHTML={{__html: `
        .grid-subtle {
          background-size: 32px 32px;
          background-image: 
            linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
        }
        .hairline-b { border-bottom: 1px solid rgba(255, 255, 255, 0.06); }
        .hairline-t { border-top: 1px solid rgba(255, 255, 255, 0.06); }
      `}} />

      <div className="pointer-events-none fixed inset-0 z-0 grid-subtle"></div>
      <div className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[420px] bg-gradient-to-b from-[#161f30]/35 via-transparent to-transparent z-0"></div>

      {/* Header */}
      <header className="sticky top-0 z-50 hairline-b bg-obsidian-950/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="w-8 h-8 rounded border border-white/15 bg-obsidian-850 flex items-center justify-center font-mono font-semibold text-sm text-slate-100 shadow-sm">
              G
            </div>
            <div>
              <div className="flex items-center space-x-2.5">
                <span className="text-sm font-semibold tracking-tight text-white font-sans">GeM ComplianceLens</span>
                <span className="font-mono text-[10px] tracking-wider uppercase px-1.5 py-0.5 rounded bg-surface-container text-slate-400 border border-white/10">v2.4-GovCore</span>
              </div>
              <p className="text-[11px] text-slate-400 font-normal">Official Specification & Governance Suite</p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-7 text-xs font-medium text-slate-400">
            <a href="#journey" className="hover:text-slate-100 transition-colors duration-150">Bidder Journey</a>
            <a href="#capabilities" className="hover:text-slate-100 transition-colors duration-150">Forensics & AST Engine</a>
            <a href="#telemetry" className="hover:text-slate-100 transition-colors duration-150">Audit Trail</a>
            <a href="/sih-compliance" className="hover:text-slate-100 transition-colors duration-150">SIH 2026 Flowchart</a>
          </nav>

          <div className="flex items-center space-x-4">
            <div className="hidden lg:flex items-center space-x-2 px-2.5 py-1 rounded bg-surface-container border border-white/10 text-[11px] text-slate-300 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span className="text-slate-400">Systems Nominal</span>
              <span className="text-slate-600">//</span>
              <span className="text-emerald-400 font-medium">CAG Defensible</span>
            </div>
            {user ? (
              <button onClick={() => navigate(`/${role}/tenders`)} className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded text-xs font-medium text-white bg-slate-800 hover:bg-slate-700 transition-colors border border-white/15 shadow-sm">
                <span>Access Console</span>
                <span className="text-slate-400 font-mono text-[11px]">&rarr;</span>
              </button>
            ) : (
              <>
                <button onClick={() => navigate('/login')} className="text-xs font-medium text-slate-400 hover:text-slate-100 px-2 py-1.5 transition-colors">Log In</button>
                <button onClick={() => navigate('/login')} className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded text-xs font-medium text-white bg-slate-800 hover:bg-slate-700 transition-colors border border-white/15 shadow-sm">
                  <span>Register</span>
                  <span className="text-slate-400 font-mono text-[11px]">&rarr;</span>
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="pt-20 pb-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded border border-white/10 bg-obsidian-900 mb-6 text-xs text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-govgold"></span>
            <span className="font-mono text-[11px] text-slate-300 tracking-wide">SMART INDIA HACKATHON 2026 // SIH-CORE-SPEC</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400 text-[11px]">Government e-Marketplace (GeM)</span>
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-white max-w-4xl mx-auto leading-[1.12]">
            Automated Compliance & Deterministic Forensics for Govt Procurement
          </h1>
          <p className="mt-5 text-sm sm:text-base text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed">
            An AI-enabled integrated platform for automated bidder compliance evaluation. Extract unstructured fields with zero-hallucination AST rules, detect synthetic doc tampering, and cryptographically seal verdicts for CAG/CVC scrutiny.
          </p>
          
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button onClick={() => navigate('/sih-compliance')} className="px-5 py-2.5 rounded bg-slate-100 hover:bg-white text-slate-900 font-medium text-xs sm:text-sm transition-colors shadow-sm flex items-center space-x-2">
              <span>View SIH Flowchart</span>
              <span className="font-mono text-xs">&rarr;</span>
            </button>
          </div>

          <div id="telemetry" className="mt-14 max-w-5xl mx-auto rounded border border-white/10 bg-obsidian-900 text-left overflow-hidden shadow-sm">
            <div className="px-4 py-2 bg-obsidian-850 hairline-b flex items-center justify-between text-[11px] font-mono text-slate-400">
              <div className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span className="text-slate-300 font-semibold uppercase tracking-wider">Telemetry Diagnostic Console</span>
              </div>
              <span className="text-slate-500">POLL: 250ms // STATUS: ACTIVE</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-white/5 font-mono">
              <div className="p-4 sm:p-5">
                <div className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">AST Rule Latency</div>
                <div className="mt-1 flex items-baseline space-x-2">
                  <span className="text-2xl font-semibold tabular-nums text-white">12.4<span className="text-sm font-normal text-slate-400">ms</span></span>
                </div>
                <div className="mt-2 text-[10px] text-slate-400 flex items-center space-x-1.5">
                  <span className="w-1 h-1 rounded-full bg-emerald-400"></span>
                  <span>P99 Deterministic</span>
                </div>
              </div>
              <div className="p-4 sm:p-5">
                <div className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Tamper & ELA Detection</div>
                <div className="mt-1 flex items-baseline space-x-2">
                  <span className="text-2xl font-semibold tabular-nums text-white">99.4<span className="text-sm font-normal text-slate-400">%</span></span>
                </div>
                <div className="mt-2 text-[10px] text-slate-400 flex items-center space-x-1.5">
                  <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                  <span>Forensic Yield</span>
                </div>
              </div>
              <div className="p-4 sm:p-5">
                <div className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Ledger Hash Integrity</div>
                <div className="mt-1 flex items-baseline space-x-2">
                  <span className="text-2xl font-semibold tabular-nums text-white">100<span className="text-sm font-normal text-slate-400">%</span></span>
                </div>
                <div className="mt-2 text-[10px] text-emerald-400 flex items-center space-x-1.5">
                  <span className="w-1 h-1 rounded-full bg-emerald-400"></span>
                  <span>SHA-256 Valid</span>
                </div>
              </div>
              <div className="p-4 sm:p-5">
                <div className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">GeM Tenders Evaluated</div>
                <div className="mt-1 flex items-baseline space-x-2">
                  <span className="text-2xl font-semibold tabular-nums text-white">4,812</span>
                </div>
                <div className="mt-2 text-[10px] text-slate-400 flex items-center space-x-1.5">
                  <span className="w-1 h-1 rounded-full bg-govgold"></span>
                  <span>Live Sandbox</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Journey Grid */}
        <section id="journey" className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="rounded border border-white/10 bg-obsidian-900 p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2 mb-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-govgold"></span>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Workflow Specification</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">How It Works: {activeTab === 'officer' ? 'Officer' : 'Bidder'} Flow</h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">Multi-stage qualification with transparent deterministic checkpoints.</p>
              </div>
              <div className="inline-flex p-0.5 rounded border border-white/10 bg-obsidian-950 self-start md:self-auto">
                <button onClick={() => setActiveTab('bidder')} className={`px-3 py-1 rounded text-xs font-medium border ${activeTab === 'bidder' ? 'text-white bg-slate-800 border-white/10' : 'text-slate-400 border-transparent hover:text-slate-200'}`}>Bidder / Vendor View</button>
                <button onClick={() => setActiveTab('officer')} className={`px-3 py-1 rounded text-xs font-medium border ${activeTab === 'officer' ? 'text-white bg-slate-800 border-white/10' : 'text-slate-400 border-transparent hover:text-slate-200'}`}>Procurement Officer</button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(step => (
              <div key={step} className={`rounded border ${step === 10 ? 'border-govgold/30 hover:border-govgold/50' : 'border-white/10 hover:border-white/20'} bg-obsidian-900 p-4 flex flex-col justify-between transition-colors`}>
                <div>
                  <div className="flex items-center justify-between text-xs font-mono mb-3">
                    <span className="text-govgold font-semibold">0{step}</span>
                    <span className={`inline-flex items-center space-x-1 text-[10px] px-1.5 py-0.5 rounded border ${step === 10 ? 'text-govgold bg-govgold/10 border-govgold/30' : 'text-emerald-400 bg-emerald-950/40 border-emerald-800/40'}`}>
                      <span className={`w-1 h-1 rounded-full ${step === 10 ? 'bg-govgold' : 'bg-emerald-400'}`}></span>
                      <span>{step === 10 ? 'Verdict' : 'Active'}</span>
                    </span>
                  </div>
                  <h3 className="text-xs font-semibold text-white tracking-tight">System Node {step}</h3>
                  <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">Processing component mapped to compliance flow architecture.</p>
                </div>
                <div className={`mt-4 pt-2.5 hairline-t flex items-center justify-between text-[10px] font-mono ${step === 10 ? 'text-govgold' : 'text-slate-500'}`}>
                  <span>NODE-{step}X</span>
                  <span>{step}/10</span>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>
      
      <footer className="mt-16 hairline-t bg-obsidian-950 py-10 px-4 sm:px-6 lg:px-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3.5">
            <div className="w-6 h-6 rounded border border-white/15 bg-obsidian-850 flex items-center justify-center font-mono font-medium text-xs text-slate-200">G</div>
            <div>
              <div className="text-xs font-semibold text-white">GeM ComplianceLens Platform</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Built for Smart India Hackathon 2026</div>
            </div>
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            © 2026 GeM ComplianceLens.
          </div>
        </div>
      </footer>
    </div>
  );
}
