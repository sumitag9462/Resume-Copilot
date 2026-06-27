import React, { useState, useEffect } from 'react';
import { Sparkles, Calendar as CalendarIcon, Clock, ArrowRight, PlayCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '../ui/GlassCard';
import GradientButton from '../ui/GradientButton';
import { useAuth } from '../../context/AuthContext';

export default function WelcomeBanner() {
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] || 'Sumit';
  
  const [timeState, setTimeState] = useState({
    time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
    date: new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeState({
        time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
        date: new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
      });
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <GlassCard animated className="relative overflow-hidden p-8 lg:p-10 border-white/5 bg-gradient-to-br from-[#121422]/90 to-[#0A0B0F]/90">
      <div className="absolute right-0 top-0 w-[500px] h-[500px] bg-accent-violet/20 blur-[120px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/3" />
      <div className="absolute left-0 bottom-0 w-[400px] h-[400px] bg-accent-teal/15 blur-[120px] rounded-full pointer-events-none translate-y-1/3 -translate-x-1/4" />
      
      <div className="relative z-10 flex flex-col xl:flex-row justify-between gap-8 lg:gap-12">
        <div className="flex-1 max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex items-center gap-3 mb-4">
            <div className="px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 flex items-center gap-2 text-xs font-semibold text-slate-300">
              <CalendarIcon className="w-3.5 h-3.5 text-accent-teal" /> {timeState.date}
            </div>
            <div className="px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 flex items-center gap-2 text-xs font-semibold text-slate-300">
              <Clock className="w-3.5 h-3.5 text-accent-violet" /> {timeState.time}
            </div>
          </motion.div>
          
          <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white tracking-tight leading-[1.1] mb-6">
            {greeting}, {firstName}.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-violet to-accent-teal">Here is your AI brief.</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-lg text-slate-400 leading-relaxed max-w-xl">
            Your resume score improved by <strong className="text-emerald-400">6%</strong> since your last optimization. You have <strong className="text-white">12 new job matches</strong> today waiting for review.
          </motion.p>
        </div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4, duration: 0.5 }} className="w-full xl:w-[380px] shrink-0">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-md shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)]">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-accent-violet" />
              <h3 className="font-display font-bold text-white text-lg">AI Assistant Suggests</h3>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3 group cursor-pointer">
                <div className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center shrink-0 mt-0.5 group-hover:border-accent-teal transition-colors">
                  <div className="w-2.5 h-2.5 bg-accent-teal rounded-full scale-0 group-hover:scale-100 transition-transform" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-300 group-hover:text-white transition-colors">Improve React Keywords</p>
                  <p className="text-xs text-slate-500 mt-0.5">Missing "Redux Toolkit" & "Next.js"</p>
                </div>
              </div>
              <div className="flex items-start gap-3 group cursor-pointer">
                <div className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center shrink-0 mt-0.5 group-hover:border-accent-teal transition-colors">
                  <div className="w-2.5 h-2.5 bg-accent-teal rounded-full scale-0 group-hover:scale-100 transition-transform" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-300 group-hover:text-white transition-colors">Practice Interview Q#12</p>
                  <p className="text-xs text-slate-500 mt-0.5">Behavioral: "Tell me about a time..."</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-white/10 pt-4">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Est. Time: 18m</span>
              <button className="flex items-center gap-1.5 text-[13px] font-bold text-accent-violet hover:text-accent-violet-light transition-colors">
                Start Tasks <PlayCircle className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </GlassCard>
  );
}
