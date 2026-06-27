import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Check, Cpu, FileText, Target, Award, Play, Terminal, ChevronDown } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import HeroBackground3D from './HeroBackground3D';
import MagneticButton from './MagneticButton';
import GradientButton from '../ui/GradientButton';
import GlassCard from '../ui/GlassCard';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

export default function LandingHero() {
  const headlineRef = useRef(null);
  const scoreRef = useRef(null);
  const jobsRef = useRef(null);
  const [insightText, setInsightText] = useState("");
  const prefersReduced = usePrefersReducedMotion();

  const fullInsight = "Your React experience strongly matches Senior Frontend Engineer positions.\nAdd measurable achievements to increase ATS score.";
  
  const terminalLines = [
    "Uploading Resume...",
    "✓ Parsing PDF",
    "✓ OCR Complete",
    "✓ Extracting Skills",
    "✓ Generating Embeddings",
    "✓ Matching Jobs",
    "Done."
  ];

  const [visibleTerminalLines, setVisibleTerminalLines] = useState(0);

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
      animateCounter(scoreRef, 94, 2.5, 1.2),
      animateCounter(jobsRef, 24, 2, 1.8),
    ].filter(Boolean);

    return () => tweens.forEach(t => t.kill());
  }, []);

  useEffect(() => {
    let timeout;
    let index = 0;
    const typeInsight = () => {
      if (index < fullInsight.length) {
        setInsightText(fullInsight.substring(0, index + 1));
        index++;
        timeout = setTimeout(typeInsight, 30);
      }
    };
    
    // Start typing after initial load animations
    const initialDelay = setTimeout(() => {
      typeInsight();
    }, 2500);
    
    return () => {
      clearTimeout(timeout);
      clearTimeout(initialDelay);
    };
  }, []);

  useEffect(() => {
    let index = 0;
    const showTerminalLine = () => {
      if (index <= terminalLines.length) {
        setVisibleTerminalLines(index);
        index++;
        setTimeout(showTerminalLine, index === 1 ? 800 : Math.random() * 400 + 200);
      }
    };
    
    const initialDelay = setTimeout(() => {
      showTerminalLine();
    }, 1000);
    
    return () => clearTimeout(initialDelay);
  }, []);

  useEffect(() => {
    gsap.fromTo(
      headlineRef.current,
      { y: 40, opacity: 0, rotateX: -20 },
      { y: 0, opacity: 1, rotateX: 0, duration: 1.2, ease: "power3.out" }
    );
  }, []);

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-base flex flex-col items-center justify-center pt-32 pb-20">
      {/* 3D Background */}
      {!prefersReduced && (
        <div className="absolute inset-0 z-0 pointer-events-auto">
          <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
            <color attach="background" args={['#050505']} />
            <ambientLight intensity={0.5} />
            <HeroBackground3D count={150} />
          </Canvas>
        </div>
      )}

      {/* Aurora glow overlays */}
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-accent-violet/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-accent-teal/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
      
      {/* Radial spotlight from top center */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-white/[0.02] rounded-[100%] blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Left Side: Copy */}
        <div className="space-y-8 max-w-2xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="badge badge-violet backdrop-blur-md px-3 py-1.5 text-xs">
              <Sparkles className="h-3.5 w-3.5" />
              Next-Generation Career OS
            </span>
          </motion.div>

          <div style={{ perspective: '1000px' }}>
            <h1 ref={headlineRef} className="text-5xl md:text-7xl lg:text-[80px] font-bold tracking-tight text-white leading-[1.05] font-display">
              Your AI Career<br />
              <span className="gradient-text-warm pb-2 inline-block">
                Co-Pilot.
              </span>
            </h1>
          </div>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-lg md:text-xl text-secondary leading-relaxed max-w-[600px]"
          >
            Resume Copilot analyzes your resume, optimizes it for ATS systems, matches it with thousands of jobs, and generates AI-powered interview preparation—all in seconds.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 items-center"
          >
            <MagneticButton className="w-full sm:w-auto">
              <Link to="/register" className="btn-primary w-full sm:w-auto h-12 px-8 shadow-glow-violet text-base group">
                Start for Free
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </MagneticButton>
            
            <MagneticButton className="w-full sm:w-auto">
              <a href="#demo" className="btn-ghost w-full sm:w-auto h-12 px-6 group hover:text-white transition-colors text-base">
                <Play className="w-4 h-4 mr-2 fill-current opacity-70 group-hover:opacity-100" />
                Watch Live AI Demo
              </a>
            </MagneticButton>
          </motion.div>
          
          <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 1, duration: 1 }}
             className="pt-8 flex flex-col gap-3"
          >
             <p className="text-xs text-tertiary uppercase tracking-widest font-semibold">Trusted by candidates interviewing at</p>
             <div className="flex gap-6 items-center opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
               <span className="text-sm font-bold tracking-tight text-white">Google</span>
               <span className="text-sm font-bold tracking-tight text-white">Microsoft</span>
               <span className="text-sm font-bold tracking-tight text-white">Amazon</span>
               <span className="text-sm font-bold tracking-tight text-white">Apple</span>
             </div>
             <p className="text-xs text-secondary mt-1">Along with <span className="text-white font-medium">50,000+</span> Resumes analyzed</p>
          </motion.div>
        </div>

        {/* Right Side: Interactive AI Dashboard */}
        <motion.div 
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 1.2, ease: "easeOut" }}
          className="relative h-[650px] w-full flex items-center justify-center perspective-[1200px]"
        >
          {/* Main Glass Workspace */}
          <motion.div 
            animate={{ 
              y: [-8, 8, -8],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="card relative z-10 w-full h-full max-w-[560px] p-6 shadow-2xl flex flex-col gap-5 border border-white/[0.08]"
          >
            {/* Header */}
            <div className="flex justify-between items-center pb-4 border-b border-white/[0.06]">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-danger/80" />
                <div className="w-3 h-3 rounded-full bg-warning/80" />
                <div className="w-3 h-3 rounded-full bg-success/80" />
              </div>
              <div className="text-[10px] font-mono text-success uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                AI Workspace Active
              </div>
            </div>

            {/* Top Stats */}
            <div className="grid grid-cols-2 gap-4">
              {/* ATS Score */}
              <div className="card p-4 bg-white/[0.02] border-white/[0.04]">
                <div className="flex justify-between items-start mb-2">
                  <div className="w-8 h-8 rounded-lg bg-success/20 flex items-center justify-center">
                    <Target className="text-success w-4 h-4" />
                  </div>
                  <div className="text-xs text-success font-medium bg-success/10 px-2 py-0.5 rounded-full">+12%</div>
                </div>
                <div className="text-xs text-tertiary font-medium mb-1 uppercase tracking-wider">ATS Score</div>
                <div className="text-3xl font-display font-bold text-white flex items-baseline gap-1">
                  <span ref={scoreRef}>0</span><span className="text-lg text-secondary">%</span>
                </div>
              </div>

              {/* Job Matches */}
              <div className="card p-4 bg-white/[0.02] border-white/[0.04]">
                <div className="flex justify-between items-start mb-2">
                  <div className="w-8 h-8 rounded-lg bg-info/20 flex items-center justify-center">
                    <Check className="text-info w-4 h-4" />
                  </div>
                  <div className="text-xs text-info font-medium bg-info/10 px-2 py-0.5 rounded-full">Top 96%</div>
                </div>
                <div className="text-xs text-tertiary font-medium mb-1 uppercase tracking-wider">Job Matches</div>
                <div className="text-3xl font-display font-bold text-white flex items-baseline gap-1">
                  <span ref={jobsRef}>0</span>
                </div>
              </div>
            </div>

            {/* Health Bars */}
            <div className="card p-5 bg-white/[0.02] border-white/[0.04] space-y-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-secondary font-medium">Resume Health</span>
                <span className="text-success font-medium">Excellent</span>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs text-tertiary mb-1.5">
                    <span>Formatting</span>
                    <span>92%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: '92%' }} transition={{ delay: 1.5, duration: 1.5, ease: "easeOut" }} className="h-full bg-info" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs text-tertiary mb-1.5">
                    <span>Keywords</span>
                    <span>88%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: '88%' }} transition={{ delay: 1.7, duration: 1.5, ease: "easeOut" }} className="h-full bg-accent-violet" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs text-tertiary mb-1.5">
                    <span>Structure</span>
                    <span>95%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: '95%' }} transition={{ delay: 1.9, duration: 1.5, ease: "easeOut" }} className="h-full bg-success" />
                  </div>
                </div>
              </div>
            </div>

            {/* Skills Cascading */}
            <div className="space-y-2">
              <div className="text-xs text-tertiary font-medium uppercase tracking-wider pl-1">Skills Detected</div>
              <div className="flex flex-wrap gap-2">
                {['React', 'Node.js', 'TypeScript', 'AWS', 'GraphQL', 'Docker'].map((skill, i) => (
                  <motion.span 
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 2 + (i * 0.1), duration: 0.4 }}
                    className="text-xs px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-secondary hover:text-white transition-colors cursor-default"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </div>

            {/* Streaming Insight */}
            <div className="mt-auto card p-4 bg-accent-violet/[0.05] border-accent-violet/[0.15]">
               <div className="text-xs text-accent-violet font-medium mb-2 flex items-center gap-1.5">
                 <Sparkles className="w-3.5 h-3.5" />
                 AI Insight
               </div>
               <p className="text-sm text-primary leading-relaxed min-h-[44px]">
                 {insightText}
                 <span className="ai-cursor inline-block w-1.5 h-3.5 bg-accent-violet ml-0.5 align-middle animate-blink" />
               </p>
            </div>
          </motion.div>

          {/* Floating UI Elements (Parallax) */}
          <motion.div 
            animate={{ y: [0, -15, 0] }} 
            transition={{ duration: 4, repeat: Infinity, delay: 1 }}
            className="absolute -right-4 md:-right-12 top-20 z-20 glass-panel px-4 py-3 rounded-xl border border-white/10 flex items-center gap-3 backdrop-blur-xl shadow-2xl"
          >
            <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center">
              <Check className="w-4 h-4 text-success" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">ATS Passed</div>
              <div className="text-xs text-secondary">Resume Optimized</div>
            </div>
          </motion.div>

          <motion.div 
            animate={{ y: [0, 20, 0] }} 
            transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
            className="absolute -left-4 md:-left-16 bottom-32 z-20 glass-panel px-4 py-3 rounded-xl border border-white/10 flex items-center gap-3 backdrop-blur-xl shadow-2xl"
          >
            <div className="w-8 h-8 rounded-full bg-info/20 flex items-center justify-center">
              <FileText className="w-4 h-4 text-info" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Cover Letter Ready</div>
              <div className="text-xs text-secondary">Customized for Google</div>
            </div>
          </motion.div>
          
          <motion.div 
            animate={{ y: [0, -10, 0] }} 
            transition={{ duration: 6, repeat: Infinity, delay: 2 }}
            className="absolute left-4 md:left-[-10px] top-[10%] z-20 glass-panel px-4 py-3 rounded-xl border border-white/10 flex flex-col gap-1 backdrop-blur-xl shadow-2xl w-[180px]"
          >
            <div className="flex items-center gap-2 mb-1">
              <Terminal className="w-4 h-4 text-secondary" />
              <div className="text-[10px] font-mono text-tertiary uppercase">Processing</div>
            </div>
            <div className="space-y-1">
              {terminalLines.slice(0, visibleTerminalLines).map((line, i) => (
                <div key={i} className="text-[10px] font-mono text-success flex items-center gap-1">
                  {line}
                </div>
              ))}
              {visibleTerminalLines < terminalLines.length && (
                <div className="text-[10px] font-mono text-secondary animate-pulse">...</div>
              )}
            </div>
          </motion.div>

        </motion.div>
      </div>
      
      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer group"
        onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
      >
        <div className="w-6 h-10 rounded-full border border-white/20 flex justify-center p-1 group-hover:border-white/40 transition-colors">
          <motion.div 
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-1.5 h-1.5 rounded-full bg-accent-violet"
          />
        </div>
      </motion.div>
    </section>
  );
}
