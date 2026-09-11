import { useState, useEffect } from 'react';
import { Settings, Save, CheckCircle2 } from 'lucide-react';
import { toast, Toaster } from 'sonner';

const TENDER_ID = "92254e09-4f9f-50e6-9861-d04936acc93b";

export default function RulesConfigPage() {
  const [rules, setRules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Available rules catalog
  const catalog = [
    { type: 'gst_active_and_filed', label: 'GST Active & Returns Filed', category: 'Statutory', requiresThreshold: false },
    { type: 'pan_valid', label: 'PAN Valid', category: 'Statutory', requiresThreshold: false },
    { type: 'udyam_valid', label: 'Udyam Registration Valid', category: 'Statutory', requiresThreshold: false },
    { type: 'not_debarred', label: 'Not on Debarment List', category: 'Statutory', requiresThreshold: false },
    { type: 'epfo_esic_compliance', label: 'EPFO/ESIC Compliant', category: 'Statutory', requiresThreshold: false },
    { type: 'mse_exemption', label: 'MSE Exemption Applicable', category: 'Policy', requiresThreshold: false },
    { type: 'local_content_pct', label: 'Minimum Local Content (%)', category: 'Policy', requiresThreshold: true },
    { type: 'turnover_threshold_inr', label: 'Minimum Turnover (INR)', category: 'Financial', requiresThreshold: true },
  ];

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/v1/tenders/${TENDER_ID}/rules`)
      .then(res => res.json())
      .then(data => {
        // Map saved rules to our catalog state
        const savedRules = data.clauses || [];
        const stateRules = catalog.map(c => {
          const saved = savedRules.find((sr: any) => sr.clause_type === c.type);
          return {
            ...c,
            enabled: !!saved,
            threshold_value: saved ? saved.threshold_value : '',
            mandatory: saved ? saved.mandatory : true
          };
        });
        setRules(stateRules);
        setLoading(false);
      });
  }, []);

  const handleToggle = (type: string) => {
    setRules(rules.map(r => r.type === type ? { ...r, enabled: !r.enabled } : r));
  };

  const handleThresholdChange = (type: string, value: string) => {
    setRules(rules.map(r => r.type === type ? { ...r, threshold_value: value } : r));
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    // Validate thresholds
    const invalid = rules.find(r => r.enabled && r.requiresThreshold && !r.threshold_value);
    if (invalid) {
      toast.error(`Please provide a threshold value for ${invalid.label}`);
      setIsSaving(false);
      return;
    }

    const payload = {
      tenderId: TENDER_ID,
      clauses: rules.filter(r => r.enabled).map(r => ({
        clause_type: r.type,
        threshold_value: r.requiresThreshold ? parseFloat(r.threshold_value) : null,
        mandatory: r.mandatory
      }))
    };

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/v1/tenders/${TENDER_ID}/rules`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("Failed to save rules");
      toast.success("Rule configuration saved successfully!");
    } catch (err) {
      toast.error("Failed to save rules");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div className="flex h-full items-center justify-center">Loading configuration...</div>;

  const categories = Array.from(new Set(rules.map(r => r.category)));

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10">
      <Toaster position="bottom-right" />
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-textPrimary">Tender Rule Configuration</h1>
          <p className="text-textSecondary text-sm mt-1">Configure eligibility clauses for CPCL Refinery Unit 3 Tender</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-2.5 bg-brand text-white rounded-lg font-medium hover:bg-brandHover transition-colors disabled:opacity-50"
        >
          {isSaving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-5 h-5" />}
          Save Configuration
        </button>
      </header>

      <div className="bg-surface border border-border rounded-xl shadow-sm overflow-hidden">
        {categories.map((cat, idx) => (
          <div key={cat} className="border-b border-border last:border-0">
            <div className="bg-gray-50 p-4 font-semibold text-gray-700 flex items-center gap-2">
              <Settings className="w-4 h-4 text-gray-400" />
              {cat} Requirements
            </div>
            <div className="divide-y divide-border">
              {rules.filter(r => r.category === cat).map(rule => (
                <div key={rule.type} className="p-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <input 
                      type="checkbox" 
                      checked={rule.enabled} 
                      onChange={() => handleToggle(rule.type)}
                      className="w-5 h-5 text-brand rounded border-gray-300 focus:ring-brand cursor-pointer"
                    />
                    <div>
                      <div className="font-medium text-textPrimary">{rule.label}</div>
                      <div className="text-xs text-textSecondary mt-0.5">Automated engine verification</div>
                    </div>
                  </div>
                  
                  {rule.requiresThreshold && (
                    <div className="flex items-center gap-3">
                      <label className="text-sm font-medium text-gray-600">Threshold:</label>
                      <input 
                        type="number"
                        disabled={!rule.enabled}
                        value={rule.threshold_value}
                        onChange={(e) => handleThresholdChange(rule.type, e.target.value)}
                        placeholder="e.g. 35"
                        className="w-32 border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand disabled:bg-gray-100 disabled:opacity-50"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
