import React from 'react';
import GlassCard from '../ui/GlassCard';
import { Tag, AlertTriangle, CheckCircle } from 'lucide-react';

export default function KeywordIntelligence({ keywords = {} }) {
  const { detected = [], missing = [], overused = [] } = keywords;

  // Mock data if empty
  const _detected = detected.length ? detected : ["React", "JavaScript", "TypeScript", "Node.js", "GraphQL"];
  const _missing = missing.length ? missing : ["AWS", "Docker", "CI/CD", "System Design"];
  const _overused = overused.length ? overused : ["Responsible for", "Worked on"];

  return (
    <GlassCard className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Tag className="w-5 h-5 text-accent-violet-light" />
        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-300">Keyword Intelligence</h3>
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 mb-3 flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5" /> Detected (Strengths)
          </h4>
          <div className="flex flex-wrap gap-2">
            {_detected.map(kw => (
              <span key={kw} className="px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-200 cursor-pointer hover:bg-emerald-500/20 transition-colors">
                {kw}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-rose-400 mb-3 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" /> Missing (High Priority)
          </h4>
          <div className="flex flex-wrap gap-2">
            {_missing.map(kw => (
              <span key={kw} className="px-2.5 py-1 rounded bg-rose-500/10 border border-rose-500/20 text-xs font-semibold text-rose-200 cursor-pointer hover:bg-rose-500/20 transition-colors relative group">
                {kw}
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-[10px] text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity">
                  High Industry Demand
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
