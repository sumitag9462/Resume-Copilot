import React from 'react';
import GlassCard from '../ui/GlassCard';
import { Route, Check, ArrowRight, Wand2 } from 'lucide-react';

export default function ImprovementRoadmap({ roadmap = [] }) {
  // Mock data
  const _roadmap = roadmap.length ? roadmap : [
    { title: "Fix Formatting", status: "completed", description: "Standardized margins and font sizes." },
    { title: "Inject Keywords", status: "current", description: "Add missing AWS and CI/CD keywords." },
    { title: "Rewrite Summary", status: "pending", description: "Make the summary more impact-driven." },
    { title: "Quantify Projects", status: "pending", description: "Add metrics to project bullet points." },
  ];

  return (
    <GlassCard className="p-6 border-t-2 border-t-accent-violet">
      <div className="flex items-center gap-2 mb-6">
        <Route className="w-5 h-5 text-accent-violet-light" />
        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-300">Improvement Roadmap</h3>
      </div>

      <div className="space-y-0 relative">
        {/* Timeline Line */}
        <div className="absolute left-[15px] top-4 bottom-4 w-px bg-white/[0.05]" />

        {_roadmap.map((step, idx) => (
          <div key={idx} className="relative pl-10 py-4 group">
            {/* Status Dot */}
            <div className={`absolute left-2 top-5 w-3.5 h-3.5 rounded-full border-2 transition-colors ${
              step.status === 'completed' ? 'bg-success border-success' :
              step.status === 'current' ? 'bg-accent-violet border-accent-violet shadow-[0_0_10px_rgba(124,111,247,0.5)]' :
              'bg-[#0A0B0F] border-slate-600'
            }`}>
              {step.status === 'completed' && <Check className="w-2.5 h-2.5 text-[#0A0B0F] absolute -left-[1px] -top-[1px]" />}
            </div>

            <div className={`p-4 rounded-xl border transition-all ${
              step.status === 'current' ? 'bg-accent-violet/5 border-accent-violet/30' : 'bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.04]'
            }`}>
              <div className="flex justify-between items-start mb-1">
                <h4 className={`text-sm font-bold ${step.status === 'current' ? 'text-accent-violet-light' : 'text-slate-300'}`}>
                  {step.title}
                </h4>
                {step.status === 'current' && (
                  <button className="flex items-center gap-1.5 px-2 py-1 rounded bg-accent-violet text-white text-[10px] font-bold uppercase tracking-wider hover:bg-accent-violet-light transition-colors shadow-lg shadow-accent-violet/20">
                    <Wand2 className="w-3 h-3" /> Auto Fix
                  </button>
                )}
              </div>
              <p className="text-[11px] text-slate-400">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
