import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Zap, Clock, MapPin, DollarSign, Briefcase, ChevronRight, PlayCircle, CheckCircle2, AlertTriangle, FileText, Share, Bookmark } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import GradientButton from '../ui/GradientButton';

const tabs = ['Overview', 'Resume Match', 'Skill Gap', 'Salary Intel'];

export default function JobDetailsPanel({ job }) {
  const [activeTab, setActiveTab] = useState('Overview');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationProgress, setOptimizationProgress] = useState(0);

  if (!job) return null;

  const handleOptimize = () => {
    setIsOptimizing(true);
    setOptimizationProgress(0);
    const interval = setInterval(() => {
      setOptimizationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsOptimizing(false), 500);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  return (
    <GlassCard className="h-full flex flex-col relative overflow-hidden rounded-2xl border-white/5 bg-[#0d0e15]/80 backdrop-blur-2xl">
      {/* Header */}
      <div className="p-8 border-b border-white/5 relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-3xl font-display font-bold text-white mb-2">{job.role}</h2>
            <div className="flex items-center gap-2 text-lg text-slate-300 font-medium">
              <span>{job.company}</span>
              <span className="text-slate-600">•</span>
              <span className="text-accent-teal">{job.matchScore}% Match</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
              <Share className="w-4 h-4" />
            </button>
            <button className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
              <Bookmark className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5"><MapPin className="w-4 h-4" /> {job.location}</span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5"><DollarSign className="w-4 h-4" /> {job.salary}</span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5"><Briefcase className="w-4 h-4" /> Full-time</span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5"><Clock className="w-4 h-4" /> Posted {job.timePosted}</span>
        </div>
      </div>

      {/* Action Hub */}
      <div className="px-8 py-4 bg-gradient-to-r from-accent-violet/10 to-accent-teal/10 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent-violet/20 flex items-center justify-center border border-accent-violet/30">
            <Zap className="w-5 h-5 text-accent-violet-light" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">AI Application Ready</h4>
            <p className="text-xs text-slate-400">Optimize resume & generate cover letter.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <GradientButton onClick={handleOptimize} disabled={isOptimizing} className="py-2 px-6 h-10 text-sm">
            {isOptimizing ? `Optimizing... ${optimizationProgress}%` : "1-Click Optimize"}
          </GradientButton>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-8 border-b border-white/5 flex gap-6">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-4 text-sm font-semibold transition-colors relative ${activeTab === tab ? 'text-white' : 'text-slate-400 hover:text-slate-200'}`}
          >
            {tab}
            {activeTab === tab && (
              <motion.div layoutId="activeTabIndicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-violet" />
            )}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-8 scrollbar-hide">
        <AnimatePresence mode="wait">
          {activeTab === 'Overview' && (
            <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
              <div>
                <h3 className="text-lg font-bold text-white mb-3">About the Role</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  We are looking for a highly skilled Senior Frontend Engineer to join our core product team. You will be responsible for architecting and building highly scalable, interactive web applications using React, Next.js, and TypeScript.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-white mb-3">Key Responsibilities</h3>
                <ul className="space-y-2">
                  {['Lead frontend architecture for high-traffic surfaces.', 'Collaborate with designers to implement complex animations (Framer Motion).', 'Optimize performance and Core Web Vitals.', 'Mentor junior engineers and establish best practices.'].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                      <ChevronRight className="w-4 h-4 text-accent-violet shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}

          {activeTab === 'Skill Gap' && (
            <motion.div key="skillgap" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-[11px] uppercase tracking-widest font-bold text-emerald-400 mb-4 flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Verified Skills</h3>
                  <div className="space-y-2">
                    {job.matchedSkills.map(skill => (
                      <div key={skill} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                        <span className="text-sm text-white font-medium">{skill}</span>
                        <span className="text-xs text-emerald-400 font-bold">100%</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-[11px] uppercase tracking-widest font-bold text-amber-400 mb-4 flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> Missing / Gap</h3>
                  <div className="space-y-2">
                    {job.missingSkills.map(skill => (
                      <div key={skill} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-white font-medium">{skill}</span>
                          <span className="text-xs text-amber-400 font-bold">0%</span>
                        </div>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3" /> Est. 3 weeks to learn</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-accent-violet/20 bg-accent-violet/5 flex items-start gap-3">
                <Target className="w-5 h-5 text-accent-violet shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">AI Recommendation</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Adding {job.missingSkills.join(' and ')} to your portfolio could increase your match score to 99%. Would you like me to generate a learning path?
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'Salary Intel' && (
            <motion.div key="salary" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                  <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Expected Salary</p>
                  <p className="text-2xl font-display font-bold text-white">{job.salary}</p>
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                  <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Market Average</p>
                  <p className="text-2xl font-display font-bold text-slate-300">$175k</p>
                </div>
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                  <p className="text-[10px] uppercase tracking-widest text-emerald-400 font-bold mb-1">Premium</p>
                  <p className="text-2xl font-display font-bold text-emerald-400">+12%</p>
                </div>
              </div>
              <div className="h-48 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-slate-500 text-sm">
                [Salary Growth Chart Placeholder]
              </div>
            </motion.div>
          )}

          {activeTab === 'Resume Match' && (
            <motion.div key="match" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
               <div className="flex items-center justify-center py-10">
                 <div className="text-center">
                   <div className="text-6xl font-display font-bold text-accent-teal mb-2">{job.matchScore}%</div>
                   <p className="text-sm text-slate-400 font-medium">Overall Fit</p>
                 </div>
               </div>
               <div className="space-y-4">
                 {[
                   { label: 'Technical Skills', score: 95, color: 'bg-emerald-400' },
                   { label: 'Experience Level', score: 90, color: 'bg-accent-teal' },
                   { label: 'Leadership', score: 65, color: 'bg-amber-400' },
                 ].map(item => (
                   <div key={item.label}>
                     <div className="flex justify-between text-xs font-bold mb-1">
                       <span className="text-slate-300">{item.label}</span>
                       <span className="text-white">{item.score}%</span>
                     </div>
                     <div className="h-1.5 w-full bg-white/[0.05] rounded-full overflow-hidden">
                       <motion.div initial={{ width: 0 }} animate={{ width: `${item.score}%` }} transition={{ duration: 1 }} className={`h-full rounded-full ${item.color}`} />
                     </div>
                   </div>
                 ))}
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Progress Overlay for Optimization */}
      <AnimatePresence>
        {isOptimizing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-[#0A0B0F]/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
            <Zap className="w-12 h-12 text-accent-violet animate-pulse mb-6" />
            <h3 className="text-2xl font-display font-bold text-white mb-2">Tailoring Resume</h3>
            <p className="text-sm text-slate-400 mb-8 max-w-sm text-center">AI is analyzing {job.company}'s job description and rewriting your bullet points to maximize ATS compatibility.</p>
            
            <div className="w-64 h-2 bg-white/10 rounded-full overflow-hidden mb-2">
              <motion.div className="h-full bg-accent-violet rounded-full" animate={{ width: `${optimizationProgress}%` }} />
            </div>
            <p className="text-xs font-bold text-accent-violet-light">{optimizationProgress}% Complete</p>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  );
}
