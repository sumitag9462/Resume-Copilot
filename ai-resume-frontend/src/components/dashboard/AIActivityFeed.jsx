import React from 'react';
import { Activity, ScanText, FileText, Briefcase, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import GlassCard from '../ui/GlassCard';

const activities = [
  {
    id: 1,
    title: 'Resume Analyzed',
    desc: 'ATS score improved by 6% (Frontend_v4.pdf)',
    time: '2 hours ago',
    icon: ScanText,
    color: 'text-violet-400',
    bg: 'bg-violet-400/10 border-violet-400/20'
  },
  {
    id: 2,
    title: 'Cover Letter Generated',
    desc: 'Tailored for Senior UI Role at Stripe',
    time: '5 hours ago',
    icon: FileText,
    color: 'text-teal-400',
    bg: 'bg-teal-400/10 border-teal-400/20'
  },
  {
    id: 3,
    title: 'Job Match Found',
    desc: '94% match for Vercel Staff Engineer',
    time: '1 day ago',
    icon: Briefcase,
    color: 'text-amber-400',
    bg: 'bg-amber-400/10 border-amber-400/20'
  }
];

export default function AIActivityFeed() {
  return (
    <GlassCard animated className="p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-slate-400" />
          <h2 className="text-lg font-display font-bold text-white">Activity Timeline</h2>
        </div>
        <button className="text-[11px] uppercase tracking-wider font-bold text-slate-500 hover:text-white transition-colors">
          View All
        </button>
      </div>

      <div className="flex-1 space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
        {activities.map((activity, index) => (
          <motion.div 
            key={activity.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
          >
            {/* Icon */}
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 ${activity.bg}`}>
              <activity.icon className={`w-4 h-4 ${activity.color}`} />
            </div>
            
            {/* Content */}
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-white/5 bg-white/[0.02] group-hover:bg-white/[0.04] transition-colors cursor-pointer">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-bold text-white text-sm group-hover:text-accent-violet transition-colors">{activity.title}</h3>
                <time className="text-[10px] font-semibold text-slate-500">{activity.time}</time>
              </div>
              <p className="text-xs text-slate-400">{activity.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </GlassCard>
  );
}
