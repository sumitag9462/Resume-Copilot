import React from 'react';
import GlassCard from '../ui/GlassCard';
import { Target, CheckCircle2, TrendingUp, Zap } from 'lucide-react';
import ScoreRing from '../ui/ScoreRing';

export default function AnalysisDashboard({ results }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Main ATS Score */}
        <GlassCard className="p-6 flex flex-col justify-between relative overflow-hidden group col-span-2">
          <div className="absolute right-0 top-0 w-32 h-32 bg-accent-violet/20 blur-[60px] rounded-full pointer-events-none transition-transform duration-700 group-hover:scale-150" />
          <div className="flex justify-between items-start relative z-10 mb-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-accent-violet-light mb-1">Overall ATS Score</p>
              <h2 className="text-3xl font-bold text-white tracking-tight">{results?.atsScore || 92}<span className="text-xl text-slate-500">/100</span></h2>
            </div>
            <div className="w-10 h-10 rounded-full bg-accent-violet/10 border border-accent-violet/20 flex items-center justify-center">
              <Target className="w-5 h-5 text-accent-violet-light" />
            </div>
          </div>
          <div className="relative z-10 flex items-center gap-2">
            <span className="flex items-center gap-1 text-[11px] font-bold text-success bg-success/10 px-2 py-0.5 rounded border border-success/20">
              <TrendingUp className="w-3 h-3" /> +14%
            </span>
            <span className="text-xs text-slate-400">vs industry average</span>
          </div>
        </GlassCard>

        <GlassCard className="p-6 flex flex-col justify-between group">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 mb-1">Formatting</p>
              <h2 className="text-2xl font-bold text-white tracking-tight">98<span className="text-base text-slate-500">%</span></h2>
            </div>
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <p className="text-xs text-slate-400">Machine Readable</p>
        </GlassCard>

        <GlassCard className="p-6 flex flex-col justify-between group">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#8FB3FF] mb-1">Impact</p>
              <h2 className="text-2xl font-bold text-white tracking-tight">High</h2>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#8FB3FF]/10 flex items-center justify-center">
              <Zap className="w-4 h-4 text-[#8FB3FF]" />
            </div>
          </div>
          <p className="text-xs text-slate-400">Strong Action Verbs</p>
        </GlassCard>
      </div>

      <GlassCard className="p-6 flex flex-col sm:flex-row items-center gap-8">
         <ScoreRing 
            score={results?.overallScore || 87}
            size={120}
            label="Recruiter Grade"
            color="#2ECBAD"
          />
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white mb-2">Excellent Technical Foundation</h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              Your resume demonstrates strong frontend expertise and modern framework knowledge. 
              To reach a perfect score, focus on adding more quantifiable metrics to your recent role.
            </p>
            <div className="flex gap-4">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-slate-500">Readability</span>
                <span className="text-sm font-bold text-emerald-400">9th Grade Level</span>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-slate-500">Word Count</span>
                <span className="text-sm font-bold text-white">412</span>
              </div>
            </div>
          </div>
      </GlassCard>
    </div>
  );
}
