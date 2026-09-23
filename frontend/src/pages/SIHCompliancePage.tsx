import { useNavigate } from 'react-router-dom';

export default function SIHCompliancePage() {
  const navigate = useNavigate();

  return (
    <div className="dark min-h-screen grid-lines text-slate-300 antialiased flex flex-col justify-between selection:bg-champagne-500/20 selection:text-champagne-300 bg-obsidian-950 font-sans relative">
      
      <style dangerouslySetInnerHTML={{__html: `
        .grid-lines {
          background-size: 32px 32px;
          background-image: 
            linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
        }
      `}} />

      {/* Very soft, deep institutional wash */}
      <div className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[420px] bg-gradient-to-b from-[#161f30]/35 via-transparent to-transparent z-0"></div>

      {/* BEGIN: MainHeader */}
      <header className="border-b border-white/[0.08] bg-obsidian-900/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          <div className="flex items-center space-x-4 cursor-pointer" onClick={() => navigate('/')}>
            <div className="h-9 w-9 rounded border border-champagne-500/40 bg-gradient-to-br from-obsidian-800 to-obsidian-950 flex items-center justify-center shadow-glow-gold">
              <svg className="w-5 h-5 text-champagne-400" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                <path d="M9 12l2 2 4-4"></path>
              </svg>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-base font-semibold tracking-tight text-white flex items-center gap-1.5">
                  GeM <span className="text-champagne-400 font-bold">ComplianceLens</span>
                </span>
                <span className="px-2 py-0.5 text-[10px] font-mono tracking-widest uppercase rounded bg-white/[0.05] text-slate-400 border border-white/[0.08]">
                  v2.4-GOVCORE
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono tracking-tight">Enterprise Specification & Statutory Verification Engine</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="hidden md:flex items-center space-x-2 border border-white/[0.08] bg-obsidian-850 px-2.5 py-1 rounded">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[11px] font-mono font-medium text-emerald-400 tracking-wider">AST ENGINE: ACTIVE</span>
              <span className="text-slate-600">|</span>
              <span className="text-[11px] font-mono text-champagne-400">CAG DEFENSIBLE</span>
            </div>
            
            <button onClick={() => navigate('/')} className="inline-flex items-center space-x-2 bg-gradient-to-r from-champagne-600 to-champagne-500 hover:from-champagne-500 hover:to-champagne-400 text-obsidian-950 font-semibold px-3.5 py-1.5 rounded text-xs transition duration-150 shadow-glow-gold">
              <span>Back to Home</span>
              <span className="font-mono text-[11px]">&rarr;</span>
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-grow">
        <section className="mb-8 border border-white/[0.08] bg-obsidian-900/60 rounded-lg p-6 backdrop-blur-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-champagne-500/60 to-transparent"></div>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="max-w-4xl">
              <div className="inline-flex items-center space-x-2 mb-2 font-mono text-[11px] text-champagne-400 tracking-wider uppercase font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-champagne-400"></span>
                <span>SMART INDIA HACKATHON // MANDATORY SPECIFICATION COMPLIANCE</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                The 14 Expected Solutions & Institutional X-Factor Architecture
              </h1>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed max-w-3xl">
                A deterministic, end-to-end evaluation pipeline mapping every government procurement mandate to automated AI extraction, forensic integrity gates, and cryptographic audit proofs.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
              <div className="bg-obsidian-850/90 border border-white/[0.08] p-3 rounded">
                <div className="text-[10px] text-slate-500 uppercase tracking-wider">Specifications</div>
                <div className="text-lg font-bold text-white mt-0.5">14 / 14</div>
                <div className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
                  <span>●</span> 10 Full • 4 In-Vault
                </div>
              </div>
              <div className="bg-obsidian-850/90 border border-white/[0.08] p-3 rounded">
                <div className="text-[10px] text-slate-500 uppercase tracking-wider">Forensic X-Factor</div>
                <div className="text-lg font-bold text-champagne-400 mt-0.5">4 Engines</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Multi-Layer Active</div>
              </div>
              <div className="bg-obsidian-850/90 border border-white/[0.08] p-3 rounded">
                <div className="text-[10px] text-slate-500 uppercase tracking-wider">Hallucination Risk</div>
                <div className="text-lg font-bold text-emerald-400 mt-0.5">0.00%</div>
                <div className="text-[10px] text-slate-400 mt-0.5">AST Gated Logic</div>
              </div>
              <div class="bg-obsidian-850/90 border border-white/[0.08] p-3 rounded">
                <div className="text-[10px] text-slate-500 uppercase tracking-wider">Defensibility Tier</div>
                <div className="text-lg font-bold text-champagne-300 mt-0.5">CAG / CVC</div>
                <div className="text-[10px] text-emerald-400 mt-0.5">Statutory Grade</div>
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          <section className="xl:col-span-8 space-y-6">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center space-x-3">
                <div className="w-2.5 h-2.5 rounded-full bg-champagne-400 shadow-glow-gold"></div>
                <h2 className="text-base font-semibold text-white tracking-wide uppercase font-mono">
                  Verification & Ingestion Pipeline (Phase 01 &rarr; 04)
                </h2>
              </div>
              <div className="flex items-center space-x-4 font-mono text-xs">
                <span className="inline-flex items-center space-x-1.5 text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>COMPLETE [10]</span>
                </span>
                <span className="inline-flex items-center space-x-1.5 text-amber-400">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  <span>SEMI-COMPLETE [4]</span>
                </span>
              </div>
            </div>

            {/* PHASE 1 */}
            <div className="border border-white/[0.08] bg-obsidian-900/80 rounded-lg p-5 shadow-inner-glow relative">
              <div className="flex items-center justify-between mb-4 border-b border-white/[0.05] pb-2">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 text-[10px] font-mono font-bold tracking-widest bg-champagne-500/10 text-champagne-400 border border-champagne-500/20 rounded">
                    PHASE 01
                  </span>
                  <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-200">
                    Identity & Entity Ingestion
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-slate-500">Stages 01 – 04 • Gateway Protocol</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Node 1 */}
                <div className="relative group bg-obsidian-850 border border-amber-500/30 hover:border-amber-400/60 rounded p-4 transition-all duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2.5">
                      <span className="font-mono text-xs font-bold text-amber-400/90 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">01</span>
                      <h4 className="text-sm font-semibold text-white">Integrate with Govt portals</h4>
                    </div>
                    <span className="px-2 py-0.5 text-[10px] font-mono font-medium rounded tracking-wide bg-amber-500/10 text-amber-400 border border-amber-500/30">
                      SEMI-COMPLETE
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-2 font-mono flex items-center gap-1.5">
                    <span className="text-slate-500">↳</span> Architecture built via Provider Pattern
                  </p>
                  <div className="mt-3 pt-2 border-t border-white/[0.04] flex items-center justify-between text-[11px] text-slate-500 font-mono">
                    <span>Adapter: Standard API/Mock</span>
                    <span className="text-amber-400/80">Pending Live Key Handshake</span>
                  </div>
                </div>

                {/* Node 2 */}
                <div className="relative group bg-obsidian-850 border border-emerald-500/30 hover:border-emerald-400/60 rounded p-4 transition-all duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2.5">
                      <span className="font-mono text-xs font-bold text-emerald-400/90 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">02</span>
                      <h4 className="text-sm font-semibold text-white">Verify Udyam/MSME status</h4>
                    </div>
                    <span className="px-2 py-0.5 text-[10px] font-mono font-medium rounded tracking-wide bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      COMPLETE
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-2 font-mono flex items-center gap-1.5">
                    <span className="text-emerald-500/70">✓</span> Automated AI Extraction
                  </p>
                  <div className="mt-3 pt-2 border-t border-white/[0.04] flex items-center justify-between text-[11px] text-slate-500 font-mono">
                    <span>Entity: Micro/Small/Medium</span>
                    <span className="text-emerald-400">Class & Validity Verified</span>
                  </div>
                </div>

                {/* Node 3 */}
                <div className="relative group bg-obsidian-850 border border-amber-500/30 hover:border-amber-400/60 rounded p-4 transition-all duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2.5">
                      <span className="font-mono text-xs font-bold text-amber-400/90 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">03</span>
                      <h4 className="text-sm font-semibold text-white">Verify GST & Returns</h4>
                    </div>
                    <span className="px-2 py-0.5 text-[10px] font-mono font-medium rounded tracking-wide bg-amber-500/10 text-amber-400 border border-amber-500/30">
                      SEMI-COMPLETE
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-2 font-mono flex items-center gap-1.5">
                    <span className="text-slate-500">↳</span> OCR Extraction Active
                  </p>
                  <div className="mt-3 pt-2 border-t border-white/[0.04] flex items-center justify-between text-[11px] text-slate-500 font-mono">
                    <span>GSTR-3B & 1 Parser</span>
                    <span className="text-amber-400/80">Offline Proof Check</span>
                  </div>
                </div>

                {/* Node 4 */}
                <div className="relative group bg-obsidian-850 border border-emerald-500/30 hover:border-emerald-400/60 rounded p-4 transition-all duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2.5">
                      <span className="font-mono text-xs font-bold text-emerald-400/90 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">04</span>
                      <h4 className="text-sm font-semibold text-white">Verify PAN & Income Tax</h4>
                    </div>
                    <span className="px-2 py-0.5 text-[10px] font-mono font-medium rounded tracking-wide bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      COMPLETE
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-2 font-mono flex items-center gap-1.5">
                    <span className="text-emerald-500/70">✓</span> Checksum & Format Validation
                  </p>
                  <div className="mt-3 pt-2 border-t border-white/[0.04] flex items-center justify-between text-[11px] text-slate-500 font-mono">
                    <span>ITR-V RegEx & 4th Char Rule</span>
                    <span className="text-emerald-400">Entity Match 100%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-2 py-1">
              <div className="h-5 w-px bg-champagne-500/40"></div>
              <span className="text-[10px] font-mono text-champagne-400 bg-obsidian-900 px-2 py-0.5 border border-white/[0.08] rounded">
                TRANSITION: ENTITY CERTIFIED &rarr; REGULATORY COMPLIANCE
              </span>
              <div className="h-5 w-px bg-champagne-500/40"></div>
            </div>

            {/* PHASE 2 */}
            <div className="border border-white/[0.08] bg-obsidian-900/80 rounded-lg p-5 shadow-inner-glow relative">
              <div className="flex items-center justify-between mb-4 border-b border-white/[0.05] pb-2">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 text-[10px] font-mono font-bold tracking-widest bg-champagne-500/10 text-champagne-400 border border-champagne-500/20 rounded">
                    PHASE 02
                  </span>
                  <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-200">
                    Regulatory & Policy Clearance
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-slate-500">Stages 05 – 08 • DPIIT & Labor Mandates</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Node 5 */}
                <div className="relative group bg-obsidian-850 border border-emerald-500/30 hover:border-emerald-400/60 rounded p-4 transition-all duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2.5">
                      <span className="font-mono text-xs font-bold text-emerald-400/90 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">05</span>
                      <h4 className="text-sm font-semibold text-white">Make in India / Local Content</h4>
                    </div>
                    <span className="px-2 py-0.5 text-[10px] font-mono font-medium rounded tracking-wide bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      COMPLETE
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-2 font-mono flex items-center gap-1.5">
                    <span className="text-emerald-500/70">✓</span> Dynamic AST Rule Engine
                  </p>
                  <div className="mt-3 pt-2 border-t border-white/[0.04] flex items-center justify-between text-[11px] text-slate-500 font-mono">
                    <span>Class-I/Class-II Evaluator</span>
                    <span className="text-emerald-400">MII Percentage Auto-Computed</span>
                  </div>
                </div>

                {/* Node 6 */}
                <div className="relative group bg-obsidian-850 border border-amber-500/30 hover:border-amber-400/60 rounded p-4 transition-all duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2.5">
                      <span className="font-mono text-xs font-bold text-amber-400/90 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">06</span>
                      <h4 className="text-sm font-semibold text-white">Verify EPFO/ESIC</h4>
                    </div>
                    <span className="px-2 py-0.5 text-[10px] font-mono font-medium rounded tracking-wide bg-amber-500/10 text-amber-400 border border-amber-500/30">
                      SEMI-COMPLETE
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-2 font-mono flex items-center gap-1.5">
                    <span className="text-slate-500">↳</span> Vault Support Active
                  </p>
                  <div className="mt-3 pt-2 border-t border-white/[0.04] flex items-center justify-between text-[11px] text-slate-500 font-mono">
                    <span>Challan OCR & TRRN Validate</span>
                    <span className="text-amber-400/80">Statutory Vault Staged</span>
                  </div>
                </div>

                {/* Node 7 */}
                <div className="relative group bg-obsidian-850 border border-emerald-500/30 hover:border-emerald-400/60 rounded p-4 transition-all duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2.5">
                      <span className="font-mono text-xs font-bold text-emerald-400/90 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">07</span>
                      <h4 className="text-sm font-semibold text-white">Startup India, NSIC, OEM</h4>
                    </div>
                    <span className="px-2 py-0.5 text-[10px] font-mono font-medium rounded tracking-wide bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      COMPLETE
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-2 font-mono flex items-center gap-1.5">
                    <span className="text-emerald-500/70">✓</span> DIPP Pattern Recognition
                  </p>
                  <div className="mt-3 pt-2 border-t border-white/[0.04] flex items-center justify-between text-[11px] text-slate-500 font-mono">
                    <span>EMD / Turnover Exemption</span>
                    <span className="text-emerald-400">Exemption Matrix Evaluated</span>
                  </div>
                </div>

                {/* Node 8 */}
                <div className="relative group bg-obsidian-850 border border-emerald-500/30 hover:border-emerald-400/60 rounded p-4 transition-all duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2.5">
                      <span className="font-mono text-xs font-bold text-emerald-400/90 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">08</span>
                      <h4 className="text-sm font-semibold text-white">DigiLocker Verification</h4>
                    </div>
                    <span className="px-2 py-0.5 text-[10px] font-mono font-medium rounded tracking-wide bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      COMPLETE
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-2 font-mono flex items-center gap-1.5">
                    <span className="text-emerald-500/70">✓</span> End-to-End Demo Mode
                  </p>
                  <div className="mt-3 pt-2 border-t border-white/[0.04] flex items-center justify-between text-[11px] text-slate-500 font-mono">
                    <span>e-Sign & XML URI Resolver</span>
                    <span className="text-emerald-400">Simulated Authority Link</span>
                  </div>
                </div>

              </div>
            </div>

            <div className="flex items-center justify-center space-x-2 py-1">
              <div className="h-5 w-px bg-champagne-500/40"></div>
              <span className="text-[10px] font-mono text-champagne-400 bg-obsidian-900 px-2 py-0.5 border border-white/[0.08] rounded">
                TRANSITION: STATUTORY POLICY &rarr; FORENSIC INTEGRITY & RISK GATING
              </span>
              <div className="h-5 w-px bg-champagne-500/40"></div>
            </div>

            {/* PHASE 3 */}
            <div className="border border-white/[0.08] bg-obsidian-900/80 rounded-lg p-5 shadow-inner-glow relative">
              <div className="flex items-center justify-between mb-4 border-b border-white/[0.05] pb-2">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 text-[10px] font-mono font-bold tracking-widest bg-champagne-500/10 text-champagne-400 border border-champagne-500/20 rounded">
                    PHASE 03
                  </span>
                  <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-200">
                    Integrity & Risk Gating
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-slate-500">Stages 09 – 12 • Strict Non-Discretionary Checks</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Node 9 */}
                <div className="relative group bg-obsidian-850 border border-emerald-500/30 hover:border-emerald-400/60 rounded p-4 transition-all duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2.5">
                      <span className="font-mono text-xs font-bold text-emerald-400/90 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">09</span>
                      <h4 className="text-sm font-semibold text-white">Blacklisting & Debarment</h4>
                    </div>
                    <span className="px-2 py-0.5 text-[10px] font-mono font-medium rounded tracking-wide bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      COMPLETE
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-2 font-mono flex items-center gap-1.5">
                    <span className="text-emerald-500/70">✓</span> Live DB Query Engine
                  </p>
                  <div className="mt-3 pt-2 border-t border-white/[0.04] flex items-center justify-between text-[11px] text-slate-500 font-mono">
                    <span>GeM / CPP Negative Registry</span>
                    <span className="text-emerald-400">Zero Debarment Matches</span>
                  </div>
                </div>

                {/* Node 10 */}
                <div className="relative group bg-obsidian-850 border border-emerald-500/30 hover:border-emerald-400/60 rounded p-4 transition-all duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2.5">
                      <span className="font-mono text-xs font-bold text-emerald-400/90 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">10</span>
                      <h4 className="text-sm font-semibold text-white">Tender-Specific Compliance</h4>
                    </div>
                    <span className="px-2 py-0.5 text-[10px] font-mono font-medium rounded tracking-wide bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      COMPLETE
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-2 font-mono flex items-center gap-1.5">
                    <span className="text-emerald-500/70">✓</span> Phase 5 Rules Config
                  </p>
                  <div className="mt-3 pt-2 border-t border-white/[0.04] flex items-center justify-between text-[11px] text-slate-500 font-mono">
                    <span>ATC / Technical Clause Matcher</span>
                    <span className="text-emerald-400">18/18 Clauses Satisfied</span>
                  </div>
                </div>

                {/* Node 11 */}
                <div className="relative group bg-obsidian-850 border border-emerald-500/30 hover:border-emerald-400/60 rounded p-4 transition-all duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2.5">
                      <span className="font-mono text-xs font-bold text-emerald-400/90 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">11</span>
                      <h4 className="text-sm font-semibold text-white">AI Identifies Missing Info</h4>
                    </div>
                    <span className="px-2 py-0.5 text-[10px] font-mono font-medium rounded tracking-wide bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      COMPLETE
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-2 font-mono flex items-center gap-1.5">
                    <span className="text-emerald-500/70">✓</span> Strict Gatekeeper
                  </p>
                  <div className="mt-3 pt-2 border-t border-white/[0.04] flex items-center justify-between text-[11px] text-slate-500 font-mono">
                    <span>Missing Annexure Detector</span>
                    <span className="text-emerald-400">Zero Critical Gaps Found</span>
                  </div>
                </div>

                {/* Node 12 */}
                <div className="relative group bg-obsidian-850 border border-emerald-500/30 hover:border-emerald-400/60 rounded p-4 transition-all duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2.5">
                      <span className="font-mono text-xs font-bold text-emerald-400/90 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">12</span>
                      <h4 className="text-sm font-semibold text-white">Compliance Score & Risk Level</h4>
                    </div>
                    <span className="px-2 py-0.5 text-[10px] font-mono font-medium rounded tracking-wide bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      COMPLETE
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-2 font-mono flex items-center gap-1.5">
                    <span className="text-emerald-500/70">✓</span> Dashboard Readiness Score
                  </p>
                  <div className="mt-3 pt-2 border-t border-white/[0.04] flex items-center justify-between text-[11px] text-slate-500 font-mono">
                    <span>Aggregate Risk Index: LOW</span>
                    <span className="text-emerald-400">Score: 98.4 / 100</span>
                  </div>
                </div>

              </div>
            </div>

            <div className="flex items-center justify-center space-x-2 py-1">
              <div className="h-5 w-px bg-champagne-500/40"></div>
              <span className="text-[10px] font-mono text-champagne-400 bg-obsidian-900 px-2 py-0.5 border border-white/[0.08] rounded">
                TRANSITION: RISK VERDICT &rarr; AUDIT FINALITY & DECISION SUPPORT
              </span>
              <div className="h-5 w-px bg-champagne-500/40"></div>
            </div>

            {/* PHASE 4 */}
            <div className="border border-white/[0.08] bg-obsidian-900/80 rounded-lg p-5 shadow-inner-glow relative">
              <div className="flex items-center justify-between mb-4 border-b border-white/[0.05] pb-2">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 text-[10px] font-mono font-bold tracking-widest bg-champagne-500/10 text-champagne-400 border border-champagne-500/20 rounded">
                    PHASE 04
                  </span>
                  <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-200">
                    Adjudication & Permanent Audit
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-slate-500">Stages 13 – 14 • Statutory Defensibility</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Node 13 */}
                <div className="relative group bg-obsidian-850 border border-emerald-500/30 hover:border-emerald-400/60 rounded p-4 transition-all duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2.5">
                      <span className="font-mono text-xs font-bold text-emerald-400/90 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">13</span>
                      <h4 className="text-sm font-semibold text-white">AI Recommendations to Officer</h4>
                    </div>
                    <span className="px-2 py-0.5 text-[10px] font-mono font-medium rounded tracking-wide bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      COMPLETE
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-2 font-mono flex items-center gap-1.5">
                    <span className="text-emerald-500/70">✓</span> Decision-Support Tool
                  </p>
                  <div className="mt-3 pt-2 border-t border-white/[0.04] flex items-center justify-between text-[11px] text-slate-500 font-mono">
                    <span>Human-in-the-Loop Sovereign</span>
                    <span className="text-emerald-400">RECOMMEND ACCEPTANCE</span>
                  </div>
                </div>

                {/* Node 14 */}
                <div className="relative group bg-obsidian-850 border border-emerald-500/30 hover:border-emerald-400/60 rounded p-4 transition-all duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2.5">
                      <span className="font-mono text-xs font-bold text-emerald-400/90 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">14</span>
                      <h4 className="text-sm font-semibold text-white">Maintain Auditable Record</h4>
                    </div>
                    <span className="px-2 py-0.5 text-[10px] font-mono font-medium rounded tracking-wide bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      COMPLETE
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-2 font-mono flex items-center gap-1.5">
                    <span className="text-emerald-500/70">✓</span> Cryptographic Hash Chain
                  </p>
                  <div className="mt-3 pt-2 border-t border-white/[0.04] flex items-center justify-between text-[11px] text-slate-500 font-mono">
                    <span>SHA-256 Ledger Block #48192</span>
                    <span className="text-champagne-400">Immutable Audit Seal</span>
                  </div>
                </div>
              </div>
            </div>

          </section>

          {/* Right Sidebar X-FACTOR */}
          <aside className="xl:col-span-4 space-y-4 sticky top-24">
            <div className="border border-champagne-500/30 bg-obsidian-900 rounded-lg p-5 shadow-glow-gold relative overflow-hidden">
              <div className="flex items-center space-x-3 pb-4 border-b border-white/[0.08]">
                <div className="w-8 h-8 rounded bg-champagne-500/10 border border-champagne-500/40 flex items-center justify-center">
                  <svg className="w-4 h-4 text-champagne-400" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-base font-bold text-white tracking-wide">The X-Factor</h3>
                    <span className="text-[9px] font-mono uppercase bg-champagne-500 text-obsidian-950 font-extrabold px-1.5 py-0.5 rounded">DEFENSE-TIER</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono">Extra features built beyond prompt requirements</p>
                </div>
              </div>
              
              <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                Enterprise capabilities purposefully engineered to withstand parliamentary audits, statutory scrutiny, and deliberate document tampering.
              </p>
              
              <div className="mt-5 space-y-4 font-sans">
                
                <div className="bg-obsidian-850 border border-white/[0.08] hover:border-champagne-500/40 rounded p-4 transition-colors">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-champagne-300 font-mono tracking-tight uppercase">
                      01. Multi-Layer Forgery Detection
                    </h4>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.05] text-slate-300 border border-white/[0.08]">ACTIVE</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    Checks Hash Reuse (collusion between cartel bidders), PDF Metadata inspection (detecting Photoshop, Acrobat Pro edits), and Error Level Analysis (ELA).
                  </p>
                  <div className="mt-3 bg-obsidian-950/70 p-2.5 rounded border border-white/[0.05] font-mono text-[11px] space-y-1.5">
                    <div className="flex justify-between items-center text-slate-400">
                      <span>SHA-256 Collusion Crosscheck:</span>
                      <span className="text-emerald-400 font-semibold">0 Matches</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-400">
                      <span>Metadata Modification Tag:</span>
                      <span className="text-emerald-400 font-semibold">Clean</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-400">
                      <span>ELA Pixel Resave Variance:</span>
                      <span className="text-emerald-400 font-semibold">&lt; 0.04%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-obsidian-850 border border-white/[0.08] hover:border-champagne-500/40 rounded p-4 transition-colors">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-champagne-300 font-mono tracking-tight uppercase">
                      02. Graceful Degradation
                    </h4>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.05] text-slate-300 border border-white/[0.08]">FAIL-SAFE</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    If the AI fails to read a blurry document 3 times, it degrades gracefully to a "Manual Review Queue" with pinned telemetry for zero operational downtime.
                  </p>
                  <div className="mt-3 bg-obsidian-950/70 p-2.5 rounded border border-white/[0.05] font-mono text-[11px] flex items-center justify-between">
                    <span className="text-slate-400">State Machine:</span>
                    <span className="text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20">Strike 0 / 3</span>
                  </div>
                </div>

                <div className="bg-obsidian-850 border border-white/[0.08] hover:border-champagne-500/40 rounded p-4 transition-colors">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-champagne-300 font-mono tracking-tight uppercase">
                      03. Deterministic Evaluation
                    </h4>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">ANTI-HALLUCINATION</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    AI is strictly sandboxed for extraction only. The final Pass/Fail is executed by an Abstract Syntax Tree (AST) Rule Engine.
                  </p>
                  <div className="mt-3 bg-obsidian-950/70 p-2.5 rounded border border-white/[0.05] font-mono text-[11px] space-y-1">
                    <div className="text-slate-400">Rule Execution Boundary:</div>
                    <div className="text-champagne-400 text-[10px] bg-obsidian-900 p-1.5 rounded font-mono border border-white/[0.04]">
                      AST.evaluate(MII_Percent &gt;= 50 &amp;&amp; TurnOver &gt;= 2.5)
                    </div>
                  </div>
                </div>

                <div className="bg-obsidian-850 border border-white/[0.08] hover:border-champagne-500/40 rounded p-4 transition-colors">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-champagne-300 font-mono tracking-tight uppercase">
                      04. Provider Pattern
                    </h4>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.05] text-slate-300 border border-white/[0.08]">ZERO-REWRITE</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    System architecture can seamlessly switch between Demo, Sandbox, and Live environments via environment variables.
                  </p>
                  <div className="mt-3 bg-obsidian-950/70 p-2 rounded border border-white/[0.05] font-mono text-[10px] text-slate-400 flex items-center justify-between">
                    <span>Provider: <code className="text-white">GovPortalLiveAdapter</code></span>
                    <span className="text-emerald-400">HOT-SWAP READY</span>
                  </div>
                </div>

              </div>

              <div className="mt-5 pt-4 border-t border-white/[0.08] flex items-center justify-between font-mono text-[11px] text-slate-400">
                <span className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-champagne-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect height="11" rx="2" ry="2" width="18" x="3" y="11"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                  <span>Dossier Hash: 8f9b...a1c7</span>
                </span>
                <span className="text-champagne-400 font-semibold cursor-pointer hover:underline">Verify Hash Chain</span>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <footer className="border-t border-white/[0.08] bg-obsidian-950 py-4 mt-12">
        <div className="max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
          <div className="flex items-center space-x-3">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-slate-400">GeM COMPLIANCE MATRIX • SIH 2026</span>
          </div>
          <div className="flex items-center space-x-4">
            <span>Statutory Integrity: <span className="text-emerald-400">100% Defensible</span></span>
          </div>
        </div>
      </footer>
    </div>
  );
}
