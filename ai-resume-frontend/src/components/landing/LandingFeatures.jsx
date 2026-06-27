import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, LayoutTemplate, Target, Edit3, 
  MessageSquare, History, SplitSquareHorizontal, TrendingUp, 
  ArrowRight, CheckCircle2, ChevronRight, Lock
} from 'lucide-react';
import GlassCard from '../ui/GlassCard';

// Reusable animated mini-demo components
const DemoAnalyzer = ({ inView }) => (
  <div className="relative h-48 w-full bg-[#0d0f15]/50 rounded-xl border border-white/5 overflow-hidden p-4 flex flex-col justify-center items-center">
    <div className="relative w-24 h-24 mb-4">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="none" />
        <motion.circle 
          cx="50" cy="50" r="40" stroke="#7C5CFC" strokeWidth="8" fill="none" strokeLinecap="round"
          initial={{ strokeDasharray: "0 251" }}
          animate={inView ? { strokeDasharray: "235 251" } : { strokeDasharray: "0 251" }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center flex-col">
        <motion.span 
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : { opacity: 0 }} transition={{ delay: 1 }}
          className="text-2xl font-bold text-white leading-none"
        >94%</motion.span>
      </div>
    </div>
    <div className="flex gap-2">
      <span className="text-[10px] px-2 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded">Leadership</span>
      <span className="text-[10px] px-2 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded">CI/CD ✓</span>
    </div>
  </div>
);

const DemoBuilder = ({ inView }) => {
  const [sections, setSections] = useState([]);
  
  useEffect(() => {
    if (inView) {
      const items = ['Education', 'Experience', 'Projects', 'Skills'];
      items.forEach((item, i) => {
        setTimeout(() => setSections(prev => [...prev, item]), i * 400 + 300);
      });
    } else {
      setSections([]);
    }
  }, [inView]);

  return (
    <div className="h-48 w-full bg-[#0d0f15]/50 rounded-xl border border-white/5 p-4 flex flex-col gap-2">
      <div className="w-1/2 h-4 bg-white/10 rounded mb-2" />
      <AnimatePresence>
        {sections.map((sec, i) => (
          <motion.div 
            key={sec} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-xs text-slate-300 p-2 bg-white/5 rounded border border-white/5"
          >
            <CheckCircle2 className="w-3 h-3 text-accent-teal" /> {sec}
          </motion.div>
        ))}
      </AnimatePresence>
      {!sections.includes('Skills') && <div className="text-xs text-slate-500 mt-auto animate-pulse">Adding sections...</div>}
    </div>
  );
};

const DemoMatch = ({ inView }) => (
  <div className="h-48 w-full bg-[#0d0f15]/50 rounded-xl border border-white/5 p-4 flex flex-col gap-3 justify-center">
    {[
      { company: 'Google', score: 96, color: 'bg-emerald-500' },
      { company: 'Microsoft', score: 93, color: 'bg-teal-400' },
      { company: 'Adobe', score: 90, color: 'bg-cyan-400' },
    ].map((item, i) => (
      <div key={item.company} className="flex items-center gap-3">
        <div className="w-16 text-xs text-slate-400">{item.company}</div>
        <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            className={`h-full ${item.color}`}
            initial={{ width: 0 }}
            animate={inView ? { width: `${item.score}%` } : { width: 0 }}
            transition={{ duration: 1, delay: i * 0.2 + 0.2, ease: "easeOut" }}
          />
        </div>
        <div className="text-xs font-mono text-white">{item.score}%</div>
      </div>
    ))}
  </div>
);

const DemoCoverLetter = ({ inView }) => {
  const text = "Dear Hiring Manager,\n\nI am excited to apply for the Frontend Engineer role. My background in React and performance optimization aligns perfectly...";
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    if (inView) {
      let i = 0;
      const interval = setInterval(() => {
        setDisplayed(text.slice(0, i));
        i++;
        if (i > text.length) clearInterval(interval);
      }, 30);
      return () => clearInterval(interval);
    } else {
      setDisplayed("");
    }
  }, [inView]);

  return (
    <div className="h-48 w-full bg-[#0d0f15]/50 rounded-xl border border-white/5 p-4 relative font-mono text-xs text-slate-300 leading-relaxed overflow-hidden">
      <div className="absolute top-2 right-2 text-[8px] uppercase tracking-widest text-accent-violet animate-pulse border border-accent-violet/30 bg-accent-violet/10 px-1 rounded">AI Writing</div>
      {displayed}
      <span className="animate-ping inline-block w-1.5 h-3 bg-white ml-0.5 align-middle" />
    </div>
  );
};

const DemoInterview = ({ inView }) => (
  <div className="h-48 w-full bg-[#0d0f15]/50 rounded-xl border border-white/5 p-4 flex flex-col justify-end">
    <motion.div 
      initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }} transition={{ delay: 0.3 }}
      className="mb-3 p-3 bg-white/5 border border-white/10 rounded-lg rounded-tl-none text-xs text-slate-300"
    >
      <span className="text-pink-400 font-semibold text-[10px] block mb-1">AI INTERVIEWER</span>
      Tell me about a challenging React project and how you optimized its performance.
    </motion.div>
    <motion.div 
      initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }} transition={{ delay: 1.2 }}
      className="p-3 bg-accent-violet/10 border border-accent-violet/20 rounded-lg rounded-tr-none text-xs text-slate-300 ml-6"
    >
      <span className="text-accent-violet font-semibold text-[10px] block mb-1">SUGGESTED ANSWER</span>
      In my last role, I reduced TTI by 40% by implementing route-based code splitting... <span className="animate-pulse">▋</span>
    </motion.div>
  </div>
);

const DemoVersions = ({ inView }) => (
  <div className="h-48 w-full bg-[#0d0f15]/50 rounded-xl border border-white/5 p-4 flex flex-col justify-center gap-4 relative">
    <div className="absolute left-6 top-8 bottom-8 w-[2px] bg-white/10" />
    <motion.div 
      className="absolute left-6 top-8 bottom-8 w-[2px] bg-emerald-500 origin-top" 
      initial={{ scaleY: 0 }} animate={inView ? { scaleY: 1 } : { scaleY: 0 }} transition={{ duration: 1.5 }}
    />
    {['Resume v1 (Original)', 'Software Engineer Version', 'Startup Generalist Version'].map((v, i) => (
      <motion.div 
        key={v} initial={{ opacity: 0, x: -10 }} animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }} transition={{ delay: i * 0.4 }}
        className="flex items-center gap-3 relative z-10"
      >
        <div className={`w-3 h-3 rounded-full border-2 border-[#0A0B0F] ${i === 2 ? 'bg-emerald-400 shadow-[0_0_10px_#10b981]' : 'bg-slate-600'}`} />
        <div className="text-xs text-slate-300 bg-white/5 px-2 py-1 rounded border border-white/5">{v}</div>
      </motion.div>
    ))}
  </div>
);

const DemoGap = ({ inView }) => (
  <div className="h-48 w-full bg-[#0d0f15]/50 rounded-xl border border-white/5 p-4 flex items-center justify-center gap-4">
    <div className="flex-1 space-y-2">
      <div className="text-[10px] uppercase text-slate-500 font-bold mb-3">Current Skills</div>
      {['React', 'Node.js'].map((s, i) => (
        <motion.div key={s} initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : { opacity: 0 }} transition={{ delay: i * 0.2 }} className="text-xs text-slate-300 p-2 bg-white/5 rounded border border-white/5 flex justify-between">
          {s} <CheckCircle2 className="w-3 h-3 text-emerald-400" />
        </motion.div>
      ))}
    </div>
    <ArrowRight className="w-4 h-4 text-slate-600" />
    <div className="flex-1 space-y-2">
      <div className="text-[10px] uppercase text-slate-500 font-bold mb-3">Required for Role</div>
      {['AWS', 'Docker'].map((s, i) => (
        <motion.div key={s} initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : { opacity: 0 }} transition={{ delay: 0.8 + i * 0.2 }} className="text-xs text-red-300 p-2 bg-red-500/10 rounded border border-red-500/20 flex justify-between">
          {s} <span className="text-[10px]">Missing</span>
        </motion.div>
      ))}
    </div>
  </div>
);

const DemoInsights = ({ inView }) => (
  <div className="h-48 w-full bg-[#0d0f15]/50 rounded-xl border border-white/5 p-4 flex flex-col justify-center">
    <div className="flex justify-between items-end mb-4">
      <div>
        <div className="text-[10px] text-slate-500 uppercase">Avg Salary</div>
        <motion.div 
          initial={{ opacity: 0, y: 5 }} animate={inView ? { opacity: 1, y: 0 } : { opacity: 0 }} transition={{ delay: 0.2 }}
          className="text-xl font-bold text-white"
        >$145k</motion.div>
      </div>
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }} animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0 }} transition={{ delay: 0.4 }}
        className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20"
      >
        <TrendingUp className="w-3 h-3" /> +12% YoY
      </motion.div>
    </div>
    <div className="flex items-end gap-2 h-16 mt-4">
      {[40, 60, 45, 80, 100].map((h, i) => (
        <motion.div 
          key={i} 
          initial={{ height: 0 }} animate={inView ? { height: `${h}%` } : { height: 0 }} transition={{ duration: 0.6, delay: 0.4 + i * 0.1 }}
          className="flex-1 bg-gradient-to-t from-accent-violet/20 to-accent-violet rounded-t-sm"
        />
      ))}
    </div>
  </div>
);

export default function LandingFeatures() {
  const containerRef = useRef(null);
  const inView = useInView(containerRef, { once: true, margin: "-100px" });

  const features = [
    {
      title: "AI Resume Analyzer",
      desc: "Instant ATS compatibility scoring, keyword gaps, and line-by-line actionable feedback.",
      icon: BarChart3, color: "text-purple-400", bg: "bg-purple-500/10", glow: "#a855f7",
      span: "md:col-span-2",
      demo: <DemoAnalyzer inView={inView} />
    },
    {
      title: "AI Cover Letter",
      desc: "Generate tailored cover letters perfectly aligned with the job description.",
      icon: Edit3, color: "text-blue-400", bg: "bg-blue-500/10", glow: "#3b82f6",
      span: "md:col-span-1",
      demo: <DemoCoverLetter inView={inView} />
    },
    {
      title: "Live Resume Builder",
      desc: "Construct professional layouts with intelligent auto-filling sections.",
      icon: LayoutTemplate, color: "text-pink-400", bg: "bg-pink-500/10", glow: "#ec4899",
      span: "md:col-span-1",
      demo: <DemoBuilder inView={inView} />
    },
    {
      title: "Precision Job Match",
      desc: "Vector-based job matching to discover roles you are statically favored to win.",
      icon: Target, color: "text-emerald-400", bg: "bg-emerald-500/10", glow: "#10b981",
      span: "md:col-span-2",
      demo: <DemoMatch inView={inView} />
    },
    {
      title: "Skill Gap Analysis",
      desc: "Cross-reference your current stack with market demands to upskill perfectly.",
      icon: SplitSquareHorizontal, color: "text-orange-400", bg: "bg-orange-500/10", glow: "#f97316",
      span: "md:col-span-3",
      demo: <DemoGap inView={inView} />
    },
    {
      title: "Interview Prep",
      desc: "AI simulates challenging behavioral and technical questions based on your CV.",
      icon: MessageSquare, color: "text-indigo-400", bg: "bg-indigo-500/10", glow: "#6366f1",
      span: "md:col-span-1",
      demo: <DemoInterview inView={inView} />
    },
    {
      title: "Version Manager",
      desc: "Fork your resume for different roles while keeping a single source of truth.",
      icon: History, color: "text-cyan-400", bg: "bg-cyan-500/10", glow: "#22d3ee",
      span: "md:col-span-1",
      demo: <DemoVersions inView={inView} />
    },
    {
      title: "Career Insights",
      desc: "Real-time market salary data, hiring trends, and demand forecasting.",
      icon: TrendingUp, color: "text-amber-400", bg: "bg-amber-500/10", glow: "#fbbf24",
      span: "md:col-span-1",
      demo: <DemoInsights inView={inView} />
    },
  ];

  return (
    <section id="features" ref={containerRef} className="py-32 relative bg-[#0A0B0F] overflow-hidden">
      {/* Premium Background Effects */}
      <div className="absolute left-0 top-1/4 w-[800px] h-[800px] bg-accent-violet/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute right-0 bottom-1/4 w-[800px] h-[800px] bg-accent-teal/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        
        {/* Section Storytelling Header */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] mb-8"
          >
            <div className="w-2 h-2 rounded-full bg-accent-teal animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-300">Interactive Product Showcase</span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white tracking-tight leading-[1.1] mb-6"
          >
            Everything you need to land your next job.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-violet to-accent-teal">Powered by one intelligent AI workspace.</span>
          </motion.h2>
        </div>

        {/* Asymmetric Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feat, idx) => (
            <motion.div 
              key={feat.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + idx * 0.1 }}
              className={feat.span}
            >
              <GlassCard 
                className="group h-full p-6 flex flex-col transition-all duration-500 hover:-translate-y-2 overflow-hidden relative cursor-pointer"
                style={{ '--glow-color': feat.glow }}
              >
                {/* Hover Glow Background */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none -z-10"
                  style={{ background: `radial-gradient(circle at 50% 0%, ${feat.glow}15, transparent 70%)` }}
                />
                
                {/* Header */}
                <div className="flex items-start gap-4 mb-6 relative z-10">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${feat.bg} border border-white/5 group-hover:border-white/20 transition-colors duration-300`}>
                    <feat.icon className={`w-6 h-6 ${feat.color} group-hover:rotate-12 transition-transform duration-300`} />
                  </div>
                  <div>
                    <h3 className="text-xl font-display font-bold text-white mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-400 transition-all">{feat.title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">{feat.desc}</p>
                  </div>
                </div>

                {/* Interactive Demo Block */}
                <div className="mt-auto relative z-10 group-hover:shadow-[0_0_30px_-10px_var(--glow-color)] transition-shadow duration-500 rounded-xl">
                  {feat.demo}
                </div>

              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 1 }}
          className="mt-20 text-center flex flex-col items-center justify-center gap-6"
        >
          <div className="w-px h-16 bg-gradient-to-b from-transparent to-white/20" />
          <h3 className="text-2xl font-display font-bold text-white">Ready to see the AI in action?</h3>
          <button className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#0A0B0F] font-bold rounded-2xl overflow-hidden hover:scale-105 transition-transform duration-300 shadow-[0_0_40px_-10px_rgba(255,255,255,0.5)]">
            <span className="relative z-10">Explore the Resume Intelligence Engine</span>
            <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-200 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </motion.div>

      </div>
    </section>
  );
}
