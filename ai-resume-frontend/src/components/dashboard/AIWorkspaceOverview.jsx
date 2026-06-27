import React from 'react';
import { TrendingUp, Award, Briefcase, FileText, ChevronRight, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import GlassCard from '../ui/GlassCard';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

const OverviewCard = ({ title, value, icon: Icon, trend, trendLabel, color, delay, data, children }) => {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.5 }}>
      <GlassCard className="h-full p-5 relative overflow-hidden group cursor-pointer border-white/5 hover:border-white/20 transition-all duration-300">
        <div className={`absolute -right-10 -top-10 w-32 h-32 bg-${color}-500/10 blur-[40px] rounded-full group-hover:bg-${color}-500/20 transition-colors duration-500`} />
        
        <div className="flex justify-between items-start mb-4 relative z-10">
          <div className={`p-2.5 rounded-xl bg-${color}-500/10 border border-${color}-500/20 text-${color}-400 group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="w-5 h-5" />
          </div>
          {trend && (
            <div className={`flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded bg-${trend > 0 ? 'emerald' : 'rose'}-500/10 text-${trend > 0 ? 'emerald' : 'rose'}-400`}>
              <TrendingUp className={`w-3 h-3 ${trend < 0 ? 'rotate-180' : ''}`} />
              {Math.abs(trend)}%
            </div>
          )}
        </div>

        <div className="relative z-10">
          <h3 className="text-slate-400 text-[13px] font-semibold tracking-wide uppercase">{title}</h3>
          <div className="flex items-end gap-3 mt-1">
            <span className="text-3xl font-display font-bold text-white">{value}</span>
            {trendLabel && <span className="text-xs text-slate-500 mb-1.5">{trendLabel}</span>}
          </div>
        </div>

        {/* Mini Chart Background */}
        {data && (
          <div className="absolute bottom-0 left-0 right-0 h-16 opacity-30 group-hover:opacity-60 transition-opacity duration-300">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id={`color-${title}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color === 'violet' ? '#7c6ff7' : color === 'teal' ? '#2ecbad' : '#f59e0b'} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={color === 'violet' ? '#7c6ff7' : color === 'teal' ? '#2ecbad' : '#f59e0b'} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="value" stroke={color === 'violet' ? '#7c6ff7' : color === 'teal' ? '#2ecbad' : '#f59e0b'} fill={`url(#color-${title})`} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Expandable Hover AI Insight */}
        <div className="absolute inset-x-0 bottom-0 p-5 bg-[#121422]/95 backdrop-blur-xl border-t border-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-1 text-accent-violet">
            <Zap className="w-3.5 h-3.5" />
            <span className="text-[10px] uppercase tracking-widest font-bold">AI Insight</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">{children}</p>
        </div>
      </GlassCard>
    </motion.div>
  );
};

export default function AIWorkspaceOverview() {
  const chartData1 = [{value: 65}, {value: 70}, {value: 68}, {value: 82}, {value: 86}, {value: 94}];
  const chartData2 = [{value: 2}, {value: 4}, {value: 7}, {value: 12}, {value: 24}];
  const chartData3 = [{value: 10}, {value: 15}, {value: 30}, {value: 45}, {value: 82}];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <OverviewCard 
        title="ATS Health Score" value="94" trend={8} trendLabel="vs last week" 
        icon={Award} color="violet" delay={0.2} data={chartData1}
      >
        Your formatting and keyword density are higher than 82% of similar candidates.
      </OverviewCard>
      
      <OverviewCard 
        title="Active Job Matches" value="24" trend={15} trendLabel="new today" 
        icon={Briefcase} color="teal" delay={0.3} data={chartData2}
      >
        You have 5 high-confidence matches (&gt;90%) for Frontend Engineer roles in New York.
      </OverviewCard>

      <OverviewCard 
        title="Interview Readiness" value="82%" trend={4} trendLabel="proficient" 
        icon={TrendingUp} color="amber" delay={0.4} data={chartData3}
      >
        Strong in technical questions. Practice behavioral questions to reach 90%.
      </OverviewCard>

      <OverviewCard 
        title="AI Optimization Credits" value="820" icon={FileText} color="blue" delay={0.5}
      >
        You have enough credits to generate 16 cover letters and 4 full resume rewrites.
      </OverviewCard>
    </div>
  );
}
