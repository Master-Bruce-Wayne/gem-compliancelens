import { Info, Settings, PlayCircle, ClipboardCheck, ShieldCheck, UserCheck } from 'lucide-react';

export default function GuidePage() {
  return (
    <div className="max-w-4xl mx-auto pb-12 animate-in fade-in">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Info className="w-8 h-8 text-brand" />
          How to Use GeM ComplianceLens
        </h1>
        <p className="text-gray-600 mt-2 text-lg">
          A step-by-step guide to automating tender compliance checks according to the SIH Problem Statement.
        </p>
      </header>

      <div className="space-y-8">
        {/* Step 1 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col sm:flex-row gap-4 sm:gap-6">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xl">
              1
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
              <Settings className="w-5 h-5 text-gray-500" />
              Configure Tender Rules (For Buyers)
            </h3>
            <p className="text-gray-600 mb-3">
              Before evaluation begins, the procurement officer defines the compliance criteria for the tender.
            </p>
            <ul className="list-disc pl-5 text-gray-700 space-y-1">
              <li>Navigate to <strong>Rules Config</strong> in the sidebar.</li>
              <li>Toggle mandatory checks (e.g., GST Active, Valid PAN, Not Debarred).</li>
              <li>Set dynamic numerical thresholds (e.g., Minimum Turnover = ₹50,00,000, Local Content ≥ 35%).</li>
              <li>Click <strong>Save Rule Configuration</strong> to lock the engine parameters.</li>
            </ul>
          </div>
        </div>

        {/* Step 2 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col sm:flex-row gap-4 sm:gap-6">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold text-xl">
              2
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-gray-500" />
              Pre-Submission Check (For Bidders)
            </h3>
            <p className="text-gray-600 mb-3">
              Bidders can verify their eligibility <em>before</em> submitting their bid, reducing junk submissions.
            </p>
            <ul className="list-disc pl-5 text-gray-700 space-y-1">
              <li>Navigate to <strong>Bidder Self-Check</strong>.</li>
              <li>Select your mock profile to simulate the check.</li>
              <li>The engine instantly fetches mock API data (GST, EPFO, Udyam) and compares it against the active rules.</li>
              <li>If gaps are found (e.g., Turnover too low), the system provides actionable guidance on why they would fail.</li>
            </ul>
          </div>
        </div>

        {/* Step 3 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col sm:flex-row gap-4 sm:gap-6">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold text-xl">
              3
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
              <PlayCircle className="w-5 h-5 text-gray-500" />
              Run AI Compliance Engine
            </h3>
            <p className="text-gray-600 mb-3">
              Officers can evaluate submitted bids in seconds instead of spending hours manually reading documents.
            </p>
            <ul className="list-disc pl-5 text-gray-700 space-y-1">
              <li>Navigate to <strong>Bid Detail</strong>.</li>
              <li>Select a bidder from the list.</li>
              <li>Review the raw data automatically fetched from external registries (MCA, GSTN, MSME).</li>
              <li>Click <strong>Run Compliance Check</strong>. The system will apply the deterministic Rule Engine and generate natural-language AI explanations for complex clauses.</li>
            </ul>
          </div>
        </div>

        {/* Step 4 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col sm:flex-row gap-4 sm:gap-6">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold text-xl">
              4
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5 text-gray-500" />
              Review Scorecard & Make Decision
            </h3>
            <p className="text-gray-600 mb-3">
              The AI acts as an assistant, but the human officer maintains final authority.
            </p>
            <ul className="list-disc pl-5 text-gray-700 space-y-1">
              <li>After running the evaluation, you are taken to the <strong>Scorecard</strong>.</li>
              <li>Click on any individual check (e.g., "Udyam Certificate") to see the exact AI reasoning and the extracted document data.</li>
              <li>Review the overall Risk Level and AI Recommendation.</li>
              <li>At the bottom of the page, choose the final decision (Qualify, Clarify, Disqualify), provide a justification note, and submit.</li>
            </ul>
          </div>
        </div>

        {/* Step 5 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col sm:flex-row gap-4 sm:gap-6">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-slate-100 text-slate-700 rounded-full flex items-center justify-center font-bold text-xl">
              5
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-gray-500" />
              Verify the Audit Trail
            </h3>
            <p className="text-gray-600 mb-3">
              To ensure transparency and accountability (a core requirement of GeM), every action is logged.
            </p>
            <ul className="list-disc pl-5 text-gray-700 space-y-1">
              <li>Navigate to the <strong>Audit Trail</strong> tab.</li>
              <li>View the cryptographically secure timeline of the bid's lifecycle.</li>
              <li>You will see exactly when the evaluation ran, what rules were applied, and who made the final decision.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
