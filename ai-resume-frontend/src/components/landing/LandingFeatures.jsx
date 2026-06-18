import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Briefcase, FileText, Zap, BrainCircuit, ShieldCheck } from 'lucide-react';

const features = [
  { icon: BarChart3, title: 'ATS Analysis', desc: 'Instant compatibility scoring with keyword gaps and section-by-section coaching.', color: '#7C5CFC' },
  { icon: Briefcase, title: 'JD Match', desc: 'Paste any job description and align your resume with exact requirements.', color: '#00D4AA' },
  { icon: FileText, title: 'AI Cover Letter', desc: 'Generate a tailored cover letter in professional or startup style instantly.', color: '#5B8FFF' },
  { icon: Zap, title: 'Instant Results', desc: 'Full analysis in seconds with zero friction and actionable insights.', color: '#F59E0B' },
  { icon: BrainCircuit, title: 'Interview Prep', desc: 'Technical & behavioral questions personalized to your resume and target role.', color: '#F472B6' },
  { icon: ShieldCheck, title: 'Secure Vault', desc: 'Encrypted storage for all your resume versions. Access them anytime.', color: '#10B981' },
];

function FeatureCard({ feature, index }) {
  const cardRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ delay: index * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="card-3d relative rounded-3xl overflow-hidden bg-[#111318]/40 backdrop-blur-xl border border-white/[0.05] p-8 group cursor-pointer"
      style={{
        boxShadow: isHovered 
          ? `0 20px 40px -10px rgba(0,0,0,0.5), 0 0 40px -10px ${feature.color}40` 
          : '0 4px 20px -10px rgba(0,0,0,0.3)',
      }}
    >
      {/* Mouse Follow Light */}
      <div 
        className="absolute inset-0 z-0 transition-opacity duration-300"
        style={{
          background: isHovered 
            ? `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, ${feature.color}15, transparent 40%)` 
            : 'transparent',
        }}
      />
      
      {/* Specular border reflection */}
      <div 
        className="absolute inset-0 z-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, ${feature.color}50, transparent 40%)`,
          WebkitMaskImage: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          padding: '1px'
        }}
      />

      <div className="relative z-10">
        <div 
          className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3"
          style={{ background: `linear-gradient(135deg, ${feature.color}30, ${feature.color}10)`, border: `1px solid ${feature.color}50` }}
        >
          <feature.icon className="w-7 h-7 text-white" style={{ filter: `drop-shadow(0 0 8px ${feature.color})` }} />
        </div>
        <h3 className="text-xl font-display font-semibold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-400 transition-all duration-300">
          {feature.title}
        </h3>
        <p className="text-sm text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors duration-300">
          {feature.desc}
        </p>
      </div>
    </motion.div>
  );
}

export default function LandingFeatures() {
  return (
    <section id="features" className="py-32 relative bg-base">
      <div className="absolute left-0 top-1/4 w-[500px] h-[500px] bg-accent-teal/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute right-0 bottom-1/4 w-[500px] h-[500px] bg-accent-violet/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] mb-6"
          >
            <div className="w-2 h-2 rounded-full bg-accent-violet animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-300">Platform Features</span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-[56px] font-display font-bold text-white tracking-tight leading-[1.1]"
          >
            Stop guessing.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-violet to-accent-teal">Start landing.</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => (
            <FeatureCard key={idx} feature={feat} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}
