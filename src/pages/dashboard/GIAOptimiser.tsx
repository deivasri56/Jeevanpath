import React, { useState } from 'react';
import { Sparkles, ArrowRight, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const GIAOptimiser: React.FC = () => {
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [results, setResults] = useState<null | any>(null);

  const handleRunAnalysis = () => {
    setIsAnalysing(true);
    // Simulate AI API call
    setTimeout(() => {
      setResults({
        totalBudget: '₹ 5.2 Cr',
        allocations: [
          { sector: 'Electrical / Power', percentage: 40, amount: '₹ 2.08 Cr', reason: 'High demand from 4,500 seekers. 82% placement rate historically.' },
          { sector: 'Apparel / Tailoring', percentage: 30, amount: '₹ 1.56 Cr', reason: 'Strong interest among women beneficiaries in rural wards.' },
          { sector: 'Green Energy / Solar', percentage: 20, amount: '₹ 1.04 Cr', reason: 'Emerging sector with 45% month-on-month growth in interest.' },
          { sector: 'Plumbing / Construction', percentage: 10, amount: '₹ 0.52 Cr', reason: 'Steady baseline demand, though placement rates are average.' }
        ],
        warnings: [
          'Fund utilisation for IT/BPO training is historically poor. Suggested reallocation to core trades.'
        ]
      });
      setIsAnalysing(false);
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-indigo-900 rounded-xl p-8 text-white shadow-lg mb-8 relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <Sparkles className="text-amber-400" />
            AI GIA Optimiser
          </h2>
          <p className="text-indigo-200 mb-6 max-w-2xl">
            Our Grant-in-Aid (GIA) Optimiser uses the aggregated profile data (interests, skills, education) of all JeevanPath beneficiaries to suggest the most effective distribution of training funds across PMKVY and DDU-GKY centres.
          </p>
          
          <button 
            onClick={handleRunAnalysis}
            disabled={isAnalysing}
            className={`px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition ${
              isAnalysing ? 'bg-indigo-800 text-indigo-400 cursor-not-allowed' : 'bg-white text-indigo-900 hover:bg-indigo-50 shadow-md'
            }`}
          >
            {isAnalysing ? (
              <>Analysing 12,450 profiles...</>
            ) : (
              <>Run Allocation Analysis <ArrowRight size={18} /></>
            )}
          </button>
        </div>
        
        {/* Background decorative element */}
        <div className="absolute -right-20 -bottom-20 opacity-10">
          <Sparkles size={300} />
        </div>
      </div>

      {results && (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 fade-in">
          <h3 className="text-xl font-bold text-slate-800 border-b border-slate-200 pb-2">
            Recommended Fund Allocation (FY 24-25)
          </h3>
          
          <div className="grid gap-4">
            {results.allocations.map((item: any, idx: number) => (
              <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-start gap-4">
                <div className="w-12 h-12 shrink-0 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 font-bold text-lg">
                  {item.percentage}%
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="text-lg font-bold text-slate-800">{item.sector}</h4>
                    <span className="text-emerald-600 font-bold">{item.amount}</span>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">{item.reason}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-start gap-3 mt-6">
            <AlertTriangle className="text-amber-500 shrink-0" />
            <div>
              <h4 className="font-bold text-amber-800 mb-1">AI Insight Warning</h4>
              <p className="text-amber-700 text-sm">{results.warnings[0]}</p>
            </div>
          </div>
          
          <div className="flex justify-end mt-4">
            <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg font-medium transition shadow-sm">
              <CheckCircle2 size={18} />
              Approve & Export Proposal
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
