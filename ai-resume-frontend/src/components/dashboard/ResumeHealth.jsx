import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { Activity, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import GlassCard from '../ui/GlassCard';

const radarData = [
  { subject: 'Keywords', A: 96, fullMark: 100 },
  { subject: 'Formatting', A: 98, fullMark: 100 },
  { subject: 'Experience', A: 85, fullMark: 100 },
  { subject: 'Education', A: 100, fullMark: 100 },
  { subject: 'Projects', A: 75, fullMark: 100 },
  { subject: 'Soft Skills', A: 80, fullMark: 100 },
];

const ProgressRing = ({ label, score, color, delay }) => (
  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay, duration: 0.5 }} className="flex flex-col items-center">
    <div className="relative w-16 h-16 mb-2">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.05)" strokeWidth="8" fill="none" />
        <motion.circle 
          cx="50" cy="50" r="40" stroke={color} strokeWidth="8" fill="none" strokeLinecap="round"
          initial={{ strokeDasharray: "0 251" }}
          animate={{ strokeDasharray: `${(score / 100) * 251} 251` }}
          transition={{ duration: 1.5, delay: delay + 0.2, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-bold text-white">{score}%</span>
      </div>
    </div>
    <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">{label}</span>
  </motion.div>
);

const ProgressBar = ({ label, score, color, delay }) => (
  <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay, duration: 0.5 }} className="mb-4">
    <div className="flex justify-between text-xs font-semibold mb-1">
      <span className="text-slate-300">{label}</span>
      <span className="text-white">{score}%</span>
    </div>
    <div className="h-2 w-full bg-white/[0.05] rounded-full overflow-hidden">
      <motion.div 
        className="h-full rounded-full" style={{ backgroundColor: color }}
        initial={{ width: 0 }}
        animate={{ width: `${score}%` }}
        transition={{ duration: 1, delay: delay + 0.2, ease: "easeOut" }}
      />
    </div>
  </motion.div>
);

export default function ResumeHealth() {
  return (
    <GlassCard animated className="p-6 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-4">
        <Activity className="w-5 h-5 text-accent-violet" />
        <h2 className="text-lg font-display font-bold text-white">Comprehensive Health</h2>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 flex-1">
        {/* Radar Chart */}
        <div className="w-full lg:w-1/2 h-[260px] relative">
          <div className="absolute inset-0 bg-accent-violet/5 blur-[50px] rounded-full pointer-events-none" />
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.1)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              <Radar name="Resume" dataKey="A" stroke="#7c6ff7" strokeWidth={2} fill="#7c6ff7" fillOpacity={0.3} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Detailed Metrics */}
        <div className="w-full lg:w-1/2 flex flex-col justify-between">
          <div className="flex justify-around mb-6">
            <ProgressRing label="Keywords" score={96} color="#2ecbad" delay={0.2} />
            <ProgressRing label="Format" score={98} color="#7c6ff7" delay={0.3} />
            <ProgressRing label="Impact" score={85} color="#f59e0b" delay={0.4} />
          </div>

          <div>
            <ProgressBar label="Measurable Outcomes" score={65} color="#ef4444" delay={0.5} />
            <ProgressBar label="Action Verbs" score={92} color="#2ecbad" delay={0.6} />
            <ProgressBar label="Readability (Flesch)" score={88} color="#3b82f6" delay={0.7} />
          </div>

          <div className="mt-4 p-3 rounded-lg bg-accent-teal/10 border border-accent-teal/20 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-accent-teal shrink-0 mt-0.5" />
            <p className="text-xs text-slate-300 leading-relaxed">
              Your resume is highly optimized for ATS parsers. Focus on increasing measurable outcomes in your <strong className="text-white">Projects</strong> section.
            </p>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
