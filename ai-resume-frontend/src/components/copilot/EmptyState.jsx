// src/components/copilot/EmptyState.jsx
// The cinematic hero empty state shown when no messages exist.
// Features an animated AI orb, floating particles, and prompt chips.

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import {
  Sparkles, FileText, Target, Wand2, Mail, Mic,
  Briefcase, Linkedin, GitBranch, Map, DollarSign, BookOpen
} from 'lucide-react';

const PROMPTS = [
  { icon: FileText,   label: 'Improve Resume',         cmd: 'Review my resume and give me a full ATS audit with specific improvements.' },
  { icon: Target,     label: 'ATS Audit',               cmd: '/ats Analyze my resume against the job description I provided.' },
  { icon: Briefcase,  label: 'Analyze Job Description', cmd: '/jd Break down the job description and tell me what they really want.' },
  { icon: Wand2,      label: 'Rewrite Experience',      cmd: 'Rewrite my work experience bullets to be more impactful with strong action verbs and metrics.' },
  { icon: Mail,       label: 'Generate Cover Letter',   cmd: '/cover Write a compelling cover letter for this role.' },
  { icon: Mic,        label: 'Prepare Interview',       cmd: '/interview Give me the top 15 interview questions I should prepare for this role.' },
  { icon: Mic,        label: 'Mock Interview',          cmd: '/mock Start a mock interview for this position. Ask me one question at a time.' },
  { icon: Linkedin,   label: 'LinkedIn Review',         cmd: '/linkedin Review my LinkedIn profile and tell me how to optimize it for this role.' },
  { icon: GitBranch,  label: 'GitHub Review',           cmd: 'How should I present my GitHub projects to make the strongest impression for this role?' },
  { icon: Map,        label: 'Career Roadmap',          cmd: '/roadmap Create a 6-month career roadmap to help me land this role.' },
  { icon: DollarSign, label: 'Salary Estimation',       cmd: '/salary What is the salary range for this role and how should I negotiate?' },
  { icon: BookOpen,   label: 'Skills Gap Analysis',     cmd: 'What skills am I missing for this role and how quickly can I acquire them?' },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.4 } },
};
const chip = {
  hidden: { opacity: 0, y: 16, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

export default function EmptyState({ onPrompt }) {
  const orbRef = useRef(null);
  const chipsRef = useRef([]);

  // GSAP magnetic effect on prompt chips
  useEffect(() => {
    chipsRef.current.forEach((el) => {
      if (!el) return;
      const handleMove = (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        gsap.to(el, { x: x * 0.18, y: y * 0.18, duration: 0.3, ease: 'power2.out' });
      };
      const handleLeave = () => gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
      el.addEventListener('mousemove', handleMove);
      el.addEventListener('mouseleave', handleLeave);
      return () => {
        el.removeEventListener('mousemove', handleMove);
        el.removeEventListener('mouseleave', handleLeave);
      };
    });
  }, []);

  return (
    <div className="flex flex-col items-center justify-start pt-12 pb-8 px-6 h-full overflow-y-auto">
      {/* AI Orb */}
      <motion.div
        ref={orbRef}
        className="relative mb-8 select-none"
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Outer glow ring */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(124,92,252,0.25) 0%, transparent 70%)' }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        />
        {/* Core orb */}
        <div
          className="relative w-24 h-24 rounded-full flex items-center justify-center"
          style={{
            background: 'radial-gradient(circle at 35% 35%, #a78bfa, #7C5CFC 40%, #4f46e5 80%, #1e1b4b)',
            boxShadow: '0 0 60px rgba(124,92,252,0.5), 0 0 120px rgba(124,92,252,0.2), inset 0 1px 0 rgba(255,255,255,0.15)',
          }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
          >
            <Sparkles className="w-10 h-10 text-white/90" strokeWidth={1.5} />
          </motion.div>
        </div>
        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full"
            style={{
              background: i % 2 === 0 ? '#7C5CFC' : '#2ECBAD',
              top: `${20 + Math.sin(i * 60 * (Math.PI / 180)) * 55}%`,
              left: `${50 + Math.cos(i * 60 * (Math.PI / 180)) * 55}%`,
            }}
            animate={{
              y: [0, -8, 0],
              opacity: [0.4, 1, 0.4],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{ repeat: Infinity, duration: 2 + i * 0.3, delay: i * 0.2, ease: 'easeInOut' }}
          />
        ))}
      </motion.div>

      {/* Headline */}
      <motion.h1
        className="text-3xl font-display font-bold text-center mb-3"
        style={{ letterSpacing: '-0.03em' }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <span className="gradient-text">Your AI Career Copilot</span>
      </motion.h1>
      <motion.p
        className="text-text-secondary text-center text-sm max-w-md leading-relaxed mb-10"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        Ask anything about resumes, ATS, interviews, jobs, LinkedIn, GitHub, career growth, or salary negotiation.
      </motion.p>

      {/* Prompt suggestion chips */}
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 w-full max-w-3xl"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {PROMPTS.map((p, i) => (
          <motion.button
            key={p.label}
            ref={(el) => (chipsRef.current[i] = el)}
            variants={chip}
            onClick={() => onPrompt(p.cmd)}
            className="group flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-left
                       border border-white/[0.07] bg-[#111318]/80
                       hover:border-accent-violet/30 hover:bg-[#181C24]
                       transition-all duration-200 cursor-pointer"
            style={{ backdropFilter: 'blur(12px)' }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            <div className="shrink-0 w-6 h-6 rounded-lg bg-accent-violet/10 flex items-center justify-center
                            group-hover:bg-accent-violet/20 transition-colors duration-200">
              <p.icon className="w-3.5 h-3.5 text-accent-violet-light" strokeWidth={1.8} />
            </div>
            <span className="text-xs font-medium text-text-secondary group-hover:text-text-primary transition-colors duration-200 leading-tight">
              {p.label}
            </span>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}
