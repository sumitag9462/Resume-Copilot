import React from 'react';
import GlassCard from '../ui/GlassCard';
import ScoreRing from '../ui/ScoreRing';
import { Target, MessageSquare, Zap, Activity } from 'lucide-react';

export default function PerformanceDashboard() {
  return (
    <GlassCard className="p-0 border-t-2 border-t-accent-violet h-full flex flex-col">
      <div className="h-14 flex items-center px-4 border-b border-white/[0.05] bg-white/[0.02]">
        <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">Performance Analytics</h3>
      </div>
      
      <div className="p-6 flex-1 flex flex-col items-center custom-scrollbar overflow-y-auto">
        {/* Overall Score */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-accent-violet/20 blur-2xl rounded-full" />
          <ScoreRing score={91} size={140} label="Overall Score" color="#7C6FF7" />
        </div>

        {/* Breakdown */}
        <div className="w-full space-y-4">
          <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-2">Category Breakdown</h4>
          
          <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-white">Communication</span>
                <span className="text-emerald-400">95%</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 rounded-full" style={{ width: '95%' }} />
              </div>
            </div>
          </div>

          <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent-violet/10 flex items-center justify-center">
              <Zap className="w-4 h-4 text-accent-violet-light" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-white">Technical Accuracy</span>
                <span className="text-accent-violet-light">88%</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-accent-violet rounded-full" style={{ width: '88%' }} />
              </div>
            </div>
          </div>

          <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center">
              <Target className="w-4 h-4 text-warning" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-white">Completeness</span>
                <span className="text-warning">72%</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-warning rounded-full" style={{ width: '72%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Feedback Snippet */}
        <div className="mt-8 w-full">
          <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-3">AI Feedback</h4>
          <p className="text-xs text-slate-300 leading-relaxed bg-white/[0.03] p-4 rounded-xl border border-white/5">
            Your technical explanations are clear and accurate. However, you often forget to mention the business impact of your work. Try using the STAR method for behavioral answers.
          </p>
        </div>
      </div>
    </GlassCard>
  );
}
