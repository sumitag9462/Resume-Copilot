import React from 'react';
import { MapPin, DollarSign, Target, Sparkles, Building2, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function JobCard({ job, isActive, onClick }) {
  const matchColor = job.matchScore >= 90 ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10' : 
                     job.matchScore >= 80 ? 'text-accent-teal border-accent-teal/20 bg-accent-teal/10' : 
                     'text-amber-400 border-amber-500/20 bg-amber-500/10';

  return (
    <motion.div 
      layout
      onClick={onClick}
      className={`relative p-5 rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden group ${
        isActive 
          ? 'bg-white/[0.04] border-accent-violet/50 shadow-[0_0_30px_rgba(124,111,247,0.1)]' 
          : 'bg-white/[0.01] border-white/5 hover:border-white/10 hover:bg-white/[0.02]'
      }`}
    >
      {isActive && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent-violet rounded-l-2xl shadow-[0_0_10px_rgba(124,111,247,0.8)]" />
      )}

      <div className="flex gap-4">
        <div className="w-12 h-12 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center shrink-0">
          <Building2 className="w-6 h-6 text-slate-400" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-1">
            <h3 className={`font-bold text-base truncate transition-colors ${isActive ? 'text-white' : 'text-slate-200 group-hover:text-white'}`}>
              {job.role}
            </h3>
            <div className={`flex flex-col items-end shrink-0 ml-2`}>
              <span className={`text-lg font-display font-bold leading-none ${matchColor.split(' ')[0]}`}>
                {job.matchScore}%
              </span>
            </div>
          </div>
          
          <p className="text-sm text-slate-400 font-medium truncate mb-3">
            {job.company}
          </p>

          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {job.location}</span>
            <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5" /> {job.salary}</span>
            <span className="flex items-center gap-1 text-slate-500">• {job.timePosted}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-white/5">
        <div className="flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-accent-violet shrink-0 mt-0.5" />
          <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
            <span className="font-semibold text-white">AI Insight:</span> {job.aiInsight}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
