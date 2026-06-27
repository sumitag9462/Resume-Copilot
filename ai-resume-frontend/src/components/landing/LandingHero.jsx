import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Check, Cpu, FileText, Target, Award } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import HeroBackground3D from './HeroBackground3D';
import MagneticButton from './MagneticButton';
import GradientButton from '../ui/GradientButton';
import GlassCard from '../ui/GlassCard';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

const words = ["Optimize.", "Match.", "Prepare.", "Win."];

export default function LandingHero() {
  const headlineRef = useRef(null);
  const scoreRef = useRef(null);
  const keywordsRef = useRef(null);
  const formattingRef = useRef(null);
  const [currentWord, setCurrentWord] = useState(0);
  const prefersReduced = usePrefersReducedMotion();

  useEffect(() => {
    const animateCounter = (ref, targetValue, duration, delay) => {
      if (!ref.current) return null;
      const obj = { val: 0 };
      return gsap.to(obj, {
        val: targetValue,
        duration,
        ease: 'power3.out',
        delay,
        onUpdate: () => {
          if (ref.current) ref.current.textContent = Math.ceil(obj.val);
        },
      });
    };

    const tweens = [
      animateCounter(scoreRef, 94, 2, 1),
      animateCounter(keywordsRef, 24, 2, 1.2),
      animateCounter(formattingRef, 8, 1.5, 1.4),
    ].filter(Boolean);

    return () => tweens.forEach(t => t.kill());
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    gsap.fromTo(
      headlineRef.current,
      { y: 50, opacity: 0, rotateX: 90 },
      { y: 0, opacity: 1, rotateX: 0, duration: 1.2, ease: "back.out(1.7)" }
    );
  }, []);

  return (
    <section className="relative min-h-[100dvh] w-full overflow-hidden bg-base flex items-center justify-center pt-24 pb-20">
      {/* 3D Background */}
      {!prefersReduced && (
        <div className="absolute inset-0 z-0 pointer-events-auto">
          <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
            <color attach="background" args={['#0A0B0F']} />
            <ambientLight intensity={0.5} />
            <HeroBackground3D count={150} />
          </Canvas>
        </div>
      )}

      {/* Aurora glow overlays */}
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-accent-violet/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-accent-teal/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />

      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Left Side: Copy */}
        <div className="space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="glow-badge inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] text-slate-300 bg-white/[0.03] border border-white/[0.08] backdrop-blur-md">
              <Sparkles className="h-4 w-4 text-accent-teal" />
              Next-Generation Career OS
            </span>
          </motion.div>

          <div style={{ perspective: '1000px' }}>
            <h1 ref={headlineRef} className="text-6xl md:text-[80px] lg:text-[100px] font-bold tracking-tighter text-white leading-[0.95] font-display">
              Your AI Career<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-violet via-blue-400 to-accent-teal">
                Co-Pilot.
              </span>
            </h1>
            <div className="h-[60px] md:h-[90px] mt-4 overflow-hidden relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentWord}
                  initial={{ y: 80, opacity: 0, rotateX: -90 }}
                  animate={{ y: 0, opacity: 1, rotateX: 0 }}
                  exit={{ y: -80, opacity: 0, rotateX: 90 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute text-5xl md:text-[70px] lg:text-[80px] font-bold tracking-tight text-white font-display"
                >
                  {words[currentWord]}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="max-w-xl text-lg md:text-xl text-slate-400 leading-relaxed"
          >
            Stop guessing what recruiters want. Our AI analyzes your resume, matches it with job descriptions, and generates pixel-perfect cover letters.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <GradientButton variant="primary" as="div" className="h-14 px-8 text-base w-full shadow-[0_0_40px_rgba(124,111,247,0.3)]">
              <Link to="/register" className="flex items-center justify-center w-full h-full">
                Start for Free
                <ArrowRight className="h-5 w-5 ml-1" />
              </Link>
            </GradientButton>
            <GradientButton variant="secondary" as="div" className="h-14 px-8 text-base w-full">
              <a href="#demo" className="flex items-center justify-center w-full h-full">
                View Live Demo
              </a>
            </GradientButton>
          </motion.div>
        </div>

        {/* Right Side: Floating Glass Dashboard */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="relative h-full flex items-center justify-center perspective-[1200px]"
        >
          {/* Main Glass Panel */}
          <motion.div 
            animate={{ 
              y: [-10, 10, -10],
              rotateX: [2, -2, 2],
              rotateY: [-2, 2, -2]
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="relative z-10 w-full max-w-[500px]"
          >
            <GlassCard className="p-8 shadow-[0_0_80px_rgba(124,111,247,0.15)]">
            <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <div className="text-xs font-mono text-accent-teal uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent-teal animate-pulse" />
                Live Analysis
              </div>
            </div>

            <div className="space-y-6">
              {/* Score Display */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent-violet/20 flex items-center justify-center">
                    <Target className="text-accent-violet w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-400">ATS Match Score</div>
                    <div className="text-xl font-bold text-white flex items-center"><span ref={scoreRef}>0</span>%</div>
                  </div>
                </div>
                <div className="text-right">
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }} className="text-sm text-green-400">+12%</motion.div>
                  <div className="text-xs text-slate-500">vs last scan</div>
                </div>
              </div>

              {/* Skills Radar Mock */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex flex-col items-center justify-center">
                  <Cpu className="text-blue-400 w-8 h-8 mb-2" />
                  <div className="text-2xl font-bold text-white flex items-center"><span ref={keywordsRef}>0</span></div>
                  <div className="text-xs text-slate-400 uppercase tracking-wider">Keywords</div>
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex flex-col items-center justify-center">
                  <Award className="text-amber-400 w-8 h-8 mb-2" />
                  <div className="text-2xl font-bold text-white flex items-center"><span ref={formattingRef}>0</span>/10</div>
                  <div className="text-xs text-slate-400 uppercase tracking-wider">Formatting</div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Resume Health</span>
                  <span className="text-accent-teal">Excellent</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '92%' }}
                    transition={{ delay: 1.5, duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-accent-violet to-accent-teal"
                  />
                </div>
              </div>
            </div>
            </GlassCard>
          </motion.div>

          {/* Floating UI Elements (Parallax) */}
          <motion.div 
            animate={{ y: [0, -15, 0] }} 
            transition={{ duration: 4, repeat: Infinity, delay: 1 }}
            className="absolute -right-8 top-12 z-20 glass-panel px-4 py-3 rounded-2xl border border-white/10 flex items-center gap-3 backdrop-blur-xl"
          >
            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
              <Check className="w-4 h-4 text-green-400" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">ATS Passed</div>
              <div className="text-xs text-slate-400">Format verified</div>
            </div>
          </motion.div>

          <motion.div 
            animate={{ y: [0, 20, 0] }} 
            transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
            className="absolute -left-12 bottom-20 z-20 glass-panel px-4 py-3 rounded-2xl border border-white/10 flex items-center gap-3 backdrop-blur-xl"
          >
            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
              <FileText className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Cover Letter</div>
              <div className="text-xs text-slate-400">Generated in 1.2s</div>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}
