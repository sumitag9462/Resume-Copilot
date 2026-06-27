import React from 'react';
import GlassCard from '../ui/GlassCard';
import { Eye, ShieldCheck, ThumbsUp, ThumbsDown, HelpCircle } from 'lucide-react';

export default function RecruiterPerspective({ feedback }) {
  const { 
    firstImpression = "Strong technical background, but lacks business impact metrics.", 
    strengths = ["Clear career progression", "Modern tech stack"], 
    weaknesses = ["No mention of leadership", "Summary is too generic"],
    questions = ["Can you elaborate on the performance improvements you achieved?"]
  } = feedback || {};

  return (
    <GlassCard className="p-6 border-t-2 border-t-[#8FB3FF]">
      <div className="flex items-center gap-2 mb-6">
        <ShieldCheck className="w-5 h-5 text-[#8FB3FF]" />
        <h3 className="text-sm font-bold uppercase tracking-widest text-[#8FB3FF]">What a Recruiter Sees</h3>
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5" /> First Impression (6 Seconds)
          </h4>
          <p className="text-sm text-slate-300 leading-relaxed bg-white/[0.02] p-3 rounded-lg border border-white/[0.05]">
            "{firstImpression}"
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 mb-2 flex items-center gap-1.5">
              <ThumbsUp className="w-3.5 h-3.5" /> Strengths
            </h4>
            <ul className="space-y-2">
              {strengths.map((str, i) => (
                <li key={i} className="text-[13px] text-slate-400 flex items-start gap-2">
                  <span className="mt-1.5 w-1 h-1 rounded-full bg-emerald-400 shrink-0" />
                  {str}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-rose-400 mb-2 flex items-center gap-1.5">
              <ThumbsDown className="w-3.5 h-3.5" /> Weaknesses
            </h4>
            <ul className="space-y-2">
              {weaknesses.map((wk, i) => (
                <li key={i} className="text-[13px] text-slate-400 flex items-start gap-2">
                  <span className="mt-1.5 w-1 h-1 rounded-full bg-rose-400 shrink-0" />
                  {wk}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-warning mb-2 flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5" /> Likely Interview Questions
          </h4>
          <ul className="space-y-2">
            {questions.map((q, i) => (
              <li key={i} className="text-[13px] text-slate-300 bg-warning/10 border border-warning/20 p-2.5 rounded-lg">
                {q}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </GlassCard>
  );
}
