import { useState } from 'react';
import { 
  Building2, UserCheck, UploadCloud, FileSearch, ShieldCheck, 
  Send, Bell, MessageSquare, Scale, Fingerprint, Database, AlertCircle, FileLock2, Languages
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';

export default function HowItWorksPage() {
  const [activeTab, setActiveTab] = useState<'officer' | 'bidder'>('officer');
  const navigate = useNavigate();

  const BidderSteps = [
    { id: 1, title: 'Register & Log In', desc: 'Securely authenticate as a vendor on the platform.', icon: UserCheck, status: 'Live' },
    { id: 2, title: 'Browse Open Tenders', desc: 'View eligibility requirements and custom rules upfront before applying.', icon: Building2, status: 'Live' },
    { id: 3, title: 'Upload Documents', desc: 'Securely upload PDFs and Images for automated processing.', icon: UploadCloud, status: 'Live' },
    { id: 4, title: 'Fetch via DigiLocker', desc: 'Pull verified documents directly from the government repository.', icon: Database, status: 'Demo Mode' },
    { id: 5, title: 'Real-time AI Extraction', desc: 'Instantly view OCR-extracted fields from your uploaded documents.', icon: FileSearch, status: 'Live' },
    { id: 6, title: 'Pre-Bid Readiness Score', desc: 'Check if you meet the specific tender requirements before submitting.', icon: ShieldCheck, status: 'Live' },
    { id: 7, title: 'Submit Application', desc: 'Send your completed vault and compliance data for officer review.', icon: Send, status: 'Live' },
    { id: 8, title: 'Track Application Status', desc: 'Monitor where your bid is in the evaluation pipeline.', icon: Bell, status: 'Live' },
    { id: 9, title: 'Respond to Clarifications', desc: 'Directly answer queries from Procurement Officers.', icon: MessageSquare, status: 'Live' },
    { id: 10, title: 'Receive Final Decision', desc: 'Get a plain-language explanation of your qualification or disqualification.', icon: Scale, status: 'Live' },
  ];

  const OfficerSteps = [
    { id: 1, title: 'Log In to Dashboard', desc: 'Access the centralized procurement officer interface.', icon: UserCheck, status: 'Live' },
    { id: 2, title: 'Configure Tender Rules', desc: 'Use the RulesConfig to set exact thresholds (e.g., Local Content %).', icon: Building2, status: 'Live' },
    { id: 3, title: 'View Bid Queue', desc: 'Monitor all submitted applications for your active tenders.', icon: Database, status: 'Live' },
    { id: 4, title: 'Automated Compliance Check', desc: 'The Rule Engine evaluates OCR data mathematically against your rules.', icon: FileSearch, status: 'Live' },
    { id: 5, title: 'Review Scorecard', desc: 'Instantly see the overall Compliance Score and Risk Level.', icon: ShieldCheck, status: 'Live' },
    { id: 6, title: 'Drill-Down Explanations', desc: 'Click any check to see the plain-language reasoning and evidence.', icon: AlertCircle, status: 'Live' },
    { id: 7, title: '1-Click Verification', desc: 'Cross-check flagged items with government portals manually if needed.', icon: UserCheck, status: 'Live' },
    { id: 8, title: 'Document Forensics', desc: 'Review PDF Metadata, Cryptographic Hashes, and ELA image analysis.', icon: Fingerprint, status: 'Live' },
    { id: 9, title: 'Clarification & Decision', desc: 'Request more info from the bidder or submit the final verdict.', icon: Scale, status: 'Live' },
    { id: 10, title: 'Immutable Audit Trail', desc: 'View the cryptographically chained timeline for CVC/CAG defensibility.', icon: FileLock2, status: 'Live' },
  ];

  const Roadmap = [
    { 
      title: 'Live Government APIs', 
      desc: 'Swap Demo Provider for Live OAuth keys (GSTN, MCA, DigiLocker).', 
      icon: Database,
      issueId: 17,
      limitation: 'Requires institutional partnership and secure API keys from Govt of India, unavailable during a public hackathon.'
    },
    { 
      title: 'Multilingual UI (i18n)', 
      desc: 'Full localization for Hindi and regional languages.', 
      icon: Languages,
      issueId: 19,
      limitation: 'Architectural overhead. Requires massive translation dictionaries which distracts from the core AI extraction MVP.'
    },
    { 
      title: 'Deepfake & AI Fraud', 
      desc: 'Advanced ML models to detect synthetic generative documents.', 
      icon: ShieldCheck,
      issueId: 15,
      limitation: 'Requires specialized GPU instances and large datasets of deepfake documents for training, constrained by free-tier hosting.'
    },
    { 
      title: 'Database PII Encryption', 
      desc: 'AES-256 encryption at rest for all bidder sensitive data.', 
      icon: FileLock2,
      issueId: 13,
      limitation: 'Adds significant latency to the OCR pipeline. Deferred to production deployment.'
    },
  ];

  const getBadgeColor = (status: string) => {
    switch(status) {
      case 'Live': return 'bg-green-100 text-green-800 border-green-200';
      case 'Demo Mode': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Coming Soon': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const steps = activeTab === 'officer' ? OfficerSteps : BidderSteps;

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      
      {/* Hero Section */}
      <section className="text-center pt-8 space-y-6">
        <div className="w-16 h-16 mx-auto bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-3xl shadow-lg">
          G
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
          How GeM ComplianceLens Works
        </h1>
        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
          An AI-enabled integrated platform for automated verification of bidder compliance in GeM procurement.
        </p>
        
        <div className="flex items-center justify-center gap-4 pt-4">
          <button 
            onClick={() => setActiveTab('officer')}
            className={cn(
              "px-6 py-3 rounded-lg font-medium transition-all shadow-sm border",
              activeTab === 'officer' 
                ? "bg-slate-900 text-white border-slate-900" 
                : "bg-white text-slate-700 hover:bg-slate-50 border-slate-200"
            )}
          >
            I'm a Procurement Officer
          </button>
          <button 
            onClick={() => setActiveTab('bidder')}
            className={cn(
              "px-6 py-3 rounded-lg font-medium transition-all shadow-sm border",
              activeTab === 'bidder' 
                ? "bg-slate-900 text-white border-slate-900" 
                : "bg-white text-slate-700 hover:bg-slate-50 border-slate-200"
            )}
          >
            I'm a Bidder
          </button>
        </div>
      </section>

      {/* Role Journey */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 md:p-10 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
        <h2 className="text-2xl font-bold text-slate-900 mb-8">
          The {activeTab === 'officer' ? 'Officer' : 'Bidder'} Journey
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
          {steps.map((step, idx) => (
            <div key={step.id} className="relative bg-slate-50 border border-slate-100 rounded-xl p-5 hover:shadow-md transition-shadow group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <step.icon size={20} />
                </div>
                <span className={cn("text-xs font-bold px-2.5 py-1 rounded-full border", getBadgeColor(step.status))}>
                  {step.status}
                </span>
              </div>
              <h3 className="font-semibold text-slate-900 mb-1 flex items-center gap-2">
                <span className="text-slate-400 text-sm">{idx + 1}.</span> {step.title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Deep Dive */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900">Platform Capabilities Explained</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
            <h3 className="font-bold text-lg text-slate-900 mb-2 flex items-center gap-2">
              <Database className="w-5 h-5 text-blue-600" /> Deterministic Rule Engine
            </h3>
            <p className="text-sm text-slate-600">
              Unlike other platforms that use hallucination-prone LLMs to make final decisions, our AI is strictly limited to <strong>Data Extraction</strong>. The actual Pass/Fail verdicts are calculated mathematically by an Abstract Syntax Tree (AST) Rule Engine, guaranteeing that the same input always gives the exact same output.
            </p>
          </div>
          
          <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
            <h3 className="font-bold text-lg text-slate-900 mb-2 flex items-center gap-2">
              <Fingerprint className="w-5 h-5 text-blue-600" /> Layered Document Forensics
            </h3>
            <p className="text-sm text-slate-600">
              We go beyond basic OCR text matching. We analyze the hidden <strong>PDF Metadata</strong> to catch Adobe Photoshop manipulation. We run <strong>Error Level Analysis (ELA)</strong> on image pixels. We check cryptographic hashes to detect bidders sharing identical fake documents to simulate competition.
            </p>
          </div>

          <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
            <h3 className="font-bold text-lg text-slate-900 mb-2 flex items-center gap-2">
              <Scale className="w-5 h-5 text-blue-600" /> Three-State Verdict System
            </h3>
            <p className="text-sm text-slate-600">
              Ambiguous edge cases are never auto-rejected. The system categorizes results into: <strong>Compliant</strong>, <strong>Non-Compliant</strong>, and <strong>Needs Review</strong>. If the AI cannot read a blurry document after 3 strikes, it degrades gracefully to the manual review queue, ensuring zero operational downtime.
            </p>
          </div>

          <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
            <h3 className="font-bold text-lg text-slate-900 mb-2 flex items-center gap-2">
              <FileLock2 className="w-5 h-5 text-blue-600" /> Immutable Pseudo-Blockchain
            </h3>
            <p className="text-sm text-slate-600">
              For complete CVC/CAG defensibility, every action is logged into an immutable <strong>Cryptographic Hash Chain</strong> within our database. Each event computes a SHA-256 hash using the previous row's hash. If a malicious insider alters a record, the chain breaks instantly.
            </p>
          </div>

        </div>
      </section>

      {/* Roadmap & Limitations */}
      <section className="bg-slate-900 text-white rounded-2xl p-6 md:p-8 shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold">What's Next (Post-SIH Roadmap)</h2>
          <a href="https://github.com/Shubham15986/gem-compliancelens/issues" target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-1">
            View Issue Tracker &rarr;
          </a>
        </div>
        <p className="text-slate-400 mb-8 max-w-3xl">
          While the core AI and Rule Engine are fully complete, the following features are officially tracked in our GitHub repository for post-hackathon implementation. We have explicitly documented the technical or institutional limitations that prevented them from being included in the MVP.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Roadmap.map((item, idx) => (
            <div key={idx} className="bg-slate-800 border border-slate-700 p-5 rounded-xl hover:border-blue-500/50 transition-colors relative group">
              <div className="flex justify-between items-start mb-3">
                <item.icon className="w-8 h-8 text-blue-400" />
                <a href={`https://github.com/Shubham15986/gem-compliancelens/issues/${item.issueId}`} target="_blank" rel="noreferrer" className="bg-slate-700/50 text-slate-300 hover:text-white px-2.5 py-1 rounded text-xs font-mono font-medium transition-colors">
                  Issue #{item.issueId}
                </a>
              </div>
              <h3 className="font-bold text-lg mb-2">{item.title}</h3>
              <p className="text-slate-300 text-sm mb-4 leading-relaxed">{item.desc}</p>
              
              <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700">
                <span className="text-amber-500 text-xs font-bold uppercase tracking-wider block mb-1">Limitation / Blocker</span>
                <p className="text-slate-400 text-xs italic">{item.limitation}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
