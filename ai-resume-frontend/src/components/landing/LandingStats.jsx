import React, { useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import gsap from 'gsap';

const StatCard = ({ title, value, suffix = "", prefix = "", delay = 0, duration = 2, decimals = 0 }) => {
  const nodeRef = useRef(null);
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView || !nodeRef.current) return;
    const obj = { val: 0 };
    gsap.to(obj, {
      val: value,
      duration,
      delay,
      ease: "power3.out",
      onUpdate: () => {
        if (nodeRef.current) {
          nodeRef.current.textContent = obj.val.toFixed(decimals);
        }
      }
    });
  }, [isInView, value, duration, delay, decimals]);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="glass-card p-8 rounded-2xl flex flex-col items-center justify-center text-center group hover:border-white/[0.1] transition-colors"
    >
      <div className="text-4xl md:text-5xl font-display font-bold text-white mb-2 flex items-baseline justify-center">
        {prefix && <span className="text-3xl text-accent-violet">{prefix}</span>}
        <span ref={nodeRef}>0</span>
        <span className="text-3xl text-accent-teal">{suffix}</span>
      </div>
      <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">{title}</p>
    </motion.div>
  );
};

export default function LandingStats() {
  return (
    <section className="py-24 relative bg-base">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-[300px] bg-accent-violet/5 rounded-[100%] blur-[100px]" />
      </div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <StatCard 
            title="Resumes Processed" 
            value={50} 
            suffix="k+" 
            delay={0}
          />
          <StatCard 
            title="Avg. ATS Improvement" 
            value={94} 
            suffix="%" 
            delay={0.1}
          />
          <StatCard 
            title="Avg. Job Matches" 
            value={24} 
            suffix="+" 
            delay={0.2}
          />
          <StatCard 
            title="Processing Time" 
            value={1.4} 
            suffix="s" 
            delay={0.3}
            decimals={1}
          />
        </div>
      </div>
    </section>
  );
}
