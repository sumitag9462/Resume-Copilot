import React from 'react';
import { Lightbulb, ArrowRight, Zap, AlertTriangle, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import GlassCard from '../ui/GlassCard';

const insights = [
  {
    id: 1,
    type: 'critical',
    title: 'Missing Leadership Metrics',
    description: 'Your target is "Staff Engineer", but your recent resume lacks keywords like "mentored", "led", or "architected". Adding 2-3 leadership metrics could boost your match rate by 15%.',
    icon: AlertTriangle,
    color: 'amber'
  },
  {
    id: 2,
    type: 'opportunity',
    title: 'Rising Skill Demand: Next.js',
    description: 'Next.js appears in 84% of your saved job descriptions. Consider moving it from "Familiar" to "Expert" in your skills section if applicable.',
    icon: TrendingUp,
    color: 'emerald'
  },
  {
    id: 3,
    type: 'action',
    title: 'Profile Optimization Ready',
    description: 'AI has generated a new summary tailored for Senior React Developer roles based on your latest scan.',
    icon: Zap,
    color: 'violet'
  }
];

export default function AICareerInsights() {
  return (
    <GlassCard animated className="p-6 h-full flex flex-col relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute -right-20 -top-20 w-48 h-48 bg-accent-violet/10 blur-[60px] rounded-full pointer-events-none" />
      
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-accent-violet/10 border border-accent-violet/20">
            <Lightbulb className="w-4 h-4 text-accent-violet-light" />
          </div>
          <h2 className="text-lg font-display font-bold text-white">AI Career Insights</h2>
        </div>
      </div>

      <div className="flex-1 space-y-4 relative z-10">
        {insights.map((insight, idx) => (
          <motion.div 
            key={insight.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + (idx * 0.1) }}
            className={`p-4 rounded-xl border border-${insight.color}-500/20 bg-${insight.color}-500/[0.05] relative overflow-hidden group cursor-pointer hover:bg-${insight.color}-500/[0.08] transition-colors`}
          >
            <div className={`absolute left-0 top-0 bottom-0 w-1 bg-${insight.color}-500/50 rounded-l-xl`} />
            
            <div className="flex gap-3">
              <insight.icon className={`w-5 h-5 text-${insight.color}-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform`} />
              <div>
                <h3 className={`text-sm font-bold text-${insight.color}-100 mb-1`}>{insight.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  {insight.description}
                </p>
                <button className={`text-[11px] font-bold uppercase tracking-wider text-${insight.color}-400 flex items-center gap-1 group-hover:gap-2 transition-all`}>
                  Take Action <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </GlassCard>
  );
}
