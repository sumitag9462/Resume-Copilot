// src/components/copilot/RightPanel.jsx
import { motion, AnimatePresence } from 'framer-motion';
import { Target, FileText, Briefcase, Zap, Info, ChevronRight } from 'lucide-react';

const QuickAction = ({ icon: Icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg border border-white/[0.04] bg-white/[0.02]
               hover:bg-[#181C24] hover:border-white/[0.08] transition-all duration-200 group"
  >
    <div className="flex items-center gap-2.5">
      <div className="p-1.5 rounded-md bg-accent-violet/10 text-accent-violet group-hover:bg-accent-violet/20 transition-colors">
        <Icon className="w-3.5 h-3.5" />
      </div>
      <span className="text-xs font-medium text-text-secondary group-hover:text-text-primary transition-colors">{label}</span>
    </div>
    <ChevronRight className="w-3.5 h-3.5 text-text-muted group-hover:text-accent-violet-light transition-colors" />
  </button>
);

const GaugeScore = ({ score, label }) => {
  const dashArray = 2 * Math.PI * 24; // r=24
  const dashOffset = dashArray - (dashArray * score) / 100;
  const color = score >= 80 ? '#2ECBAD' : score >= 60 ? '#FBBF24' : '#F87171';

  return (
    <div className="flex flex-col items-center p-3 rounded-xl border border-white/[0.06] bg-[#111318]">
      <div className="relative w-16 h-16 flex items-center justify-center mb-2">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 56 56">
          <circle cx="28" cy="28" r="24" className="stroke-white/[0.05]" strokeWidth="4" fill="none" />
          <circle
            cx="28" cy="28" r="24"
            className="transition-all duration-1000 ease-out"
            stroke={color} strokeWidth="4" fill="none"
            strokeDasharray={dashArray} strokeDashoffset={dashOffset} strokeLinecap="round"
          />
        </svg>
        <span className="absolute text-base font-bold text-text-primary">{score}</span>
      </div>
      <span className="text-[10px] uppercase tracking-wider text-text-muted font-semibold">{label}</span>
    </div>
  );
};

export default function RightPanel({ isOpen, activeContext, onAction }) {
  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          className="w-80 h-full border-l border-white/[0.06] bg-[#0A0B0F]/90 flex flex-col flex-shrink-0"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 320, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          style={{ backdropFilter: 'blur(16px)' }}
        >
          {/* Header */}
          <div className="p-4 border-b border-white/[0.06]">
            <h2 className="text-sm font-semibold text-text-primary flex items-center gap-2">
              <Zap className="w-4 h-4 text-accent-violet" />
              AI Context Engine
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6" style={{ scrollbarWidth: 'none' }}>
            
            {/* Active Context Status */}
            <div>
              <h3 className="text-[10px] uppercase tracking-widest text-text-muted font-bold mb-3">Current Target</h3>
              <div className="space-y-2">
                <div className="flex items-start gap-3 p-3 rounded-xl border border-white/[0.06] bg-[#111318]">
                  <FileText className="w-4 h-4 text-accent-teal mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-text-primary leading-tight mb-0.5">Senior Frontend Engineer.pdf</p>
                    <p className="text-[10px] text-text-muted">Last updated 2 days ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl border border-white/[0.06] bg-[#111318]">
                  <Briefcase className="w-4 h-4 text-accent-violet mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-text-primary leading-tight mb-0.5">Staff Engineer @ Stripe</p>
                    <p className="text-[10px] text-text-muted">Job Description loaded</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div>
              <h3 className="text-[10px] uppercase tracking-widest text-text-muted font-bold mb-3">Live Analysis</h3>
              <div className="grid grid-cols-2 gap-3">
                <GaugeScore score={82} label="ATS Match" />
                <div className="p-3 rounded-xl border border-white/[0.06] bg-[#111318] flex flex-col">
                  <span className="text-2xl font-bold text-text-primary mb-1 mt-1">4</span>
                  <span className="text-[10px] uppercase tracking-wider text-text-muted font-semibold mt-auto">Missing Skills</span>
                </div>
              </div>
            </div>

            {/* Keyword Chips */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[10px] uppercase tracking-widest text-text-muted font-bold">Missing Keywords</h3>
                <Info className="w-3.5 h-3.5 text-text-muted" />
              </div>
              <div className="flex flex-wrap gap-2">
                {['GraphQL', 'WebGL', 'Figma API', 'CI/CD Pipelines'].map(kw => (
                  <span key={kw} className="px-2.5 py-1 rounded-md text-[10px] font-medium border border-red-500/20 bg-red-500/10 text-red-300">
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h3 className="text-[10px] uppercase tracking-widest text-text-muted font-bold mb-3">Copilot Actions</h3>
              <div className="space-y-2">
                <QuickAction icon={Target} label="Analyze Match Score" onClick={() => onAction('/ats')} />
                <QuickAction icon={FileText} label="Optimize Resume" onClick={() => onAction('/resume')} />
                <QuickAction icon={Zap} label="Start Mock Interview" onClick={() => onAction('/mock')} />
              </div>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
