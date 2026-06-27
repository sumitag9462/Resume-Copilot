import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useSpring, useMotionValueEvent, LayoutGroup } from 'framer-motion';
import { FileUp, ScanText, FileText, Brain, Database, Shield, Target, Award, Terminal, Lightbulb, MessageSquare, Download, ArrowRight } from 'lucide-react';
import GlassCard from '../ui/GlassCard';

export const pipelineStages = [
  {
    id: 'upload', icon: FileUp, title: 'Resume Upload', desc: 'Secure document ingestion',
    color: 'text-blue-500', bgGlow: 'bg-blue-500/20', border: 'border-blue-500/30',
    terminal: ["$ Uploading Resume...", "✓ PDF Loaded", "✓ Secure connection established"],
    metadata: [ { label: 'Input', value: 'resume.pdf' }, { label: 'Size', value: '482 KB' }, { label: 'Pages', value: '2' } ],
    json: { file: "resume.pdf" }
  },
  {
    id: 'ocr', icon: ScanText, title: 'OCR & Text Extraction', desc: 'Converting document to raw tokens',
    color: 'text-cyan-400', bgGlow: 'bg-cyan-400/20', border: 'border-cyan-400/30',
    terminal: ["$ Initializing vision model...", "✓ OCR Complete", "✓ 1842 tokens extracted"],
    metadata: [ { label: 'Tokens', value: '1842' }, { label: 'Accuracy', value: '99.8%' }, { label: 'Language', value: 'English' }, { label: 'Model', value: 'Gemini 2.5 Flash' } ],
    json: { file: "resume.pdf", pages: 2, tokens: 1842, language: "en" }
  },
  {
    id: 'parse', icon: FileText, title: 'Structure Detection', desc: 'Identifying logical sections',
    color: 'text-purple-500', bgGlow: 'bg-purple-500/20', border: 'border-purple-500/30',
    terminal: ["$ Analyzing semantic structure...", "✓ Parsing Layout", "✓ Structure mapped successfully"],
    metadata: [ { label: 'Sections', value: 'Education, Experience, Projects, Skills, Achievements' } ],
    json: { file: "resume.pdf", pages: 2, tokens: 1842, language: "en", sections: ["Education", "Experience", "Projects", "Skills", "Achievements"] }
  },
  {
    id: 'skills', icon: Brain, title: 'Skill Intelligence', desc: 'Extracting technical and soft skills',
    color: 'text-pink-500', bgGlow: 'bg-pink-500/20', border: 'border-pink-500/30',
    terminal: ["$ Running NER for entities...", "✓ Detecting Skills", "✓ Skills indexed"],
    metadata: [ { label: 'Skills Found', value: 'React, Node.js, MongoDB, AWS, Docker, Redis, TypeScript' } ],
    json: { file: "resume.pdf", pages: 2, tokens: 1842, language: "en", sections: ["Education", "Experience", "Projects", "Skills", "Achievements"], skills: ["React", "Node.js", "MongoDB", "AWS", "Docker", "Redis", "TypeScript"] }
  },
  {
    id: 'embed', icon: Database, title: 'Semantic Embedding', desc: 'Translating text to vector space',
    color: 'text-rose-500', bgGlow: 'bg-rose-500/20', border: 'border-rose-500/30',
    terminal: ["$ Generating Embeddings...", "✓ 1536-dimensional vector created", "✓ Vector indexed into memory"],
    metadata: [ { label: 'Embedding', value: '1536 Dimensions' }, { label: 'Database', value: 'Vector Indexed' } ],
    json: { file: "resume.pdf", pages: 2, tokens: 1842, language: "en", sections: ["Education", "Experience", "Projects", "Skills", "Achievements"], skills: ["React", "Node.js", "MongoDB", "AWS", "Docker", "Redis", "TypeScript"], embedding: "1536d", vectorId: "v_849201a" }
  },
  {
    id: 'ats', icon: Shield, title: 'ATS Evaluation', desc: 'Checking against standard ATS filters',
    color: 'text-orange-500', bgGlow: 'bg-orange-500/20', border: 'border-orange-500/30',
    terminal: ["$ ATS Model Initialized...", "✓ Format passes checks", "✓ Keyword density optimal"],
    metadata: [ { label: 'ATS Score', value: '94' }, { label: 'Keyword Coverage', value: '91%' }, { label: 'Formatting', value: '98%' } ],
    json: { file: "resume.pdf", pages: 2, tokens: 1842, language: "en", sections: ["Education", "Experience", "Projects", "Skills", "Achievements"], skills: ["React", "Node.js", "MongoDB", "AWS", "Docker", "Redis", "TypeScript"], embedding: "1536d", vectorId: "v_849201a", atsScore: 94, coverage: 0.91, formatScore: 0.98 }
  },
  {
    id: 'match', icon: Target, title: 'Job Intelligence', desc: 'Querying vector database for roles',
    color: 'text-emerald-500', bgGlow: 'bg-emerald-500/20', border: 'border-emerald-500/30',
    terminal: ["$ Job Matching Started...", "✓ Searching 12,000 Jobs...", "✓ 24 High-confidence matches found"],
    metadata: [ { label: 'Database', value: '12,000 Jobs' }, { label: 'Matches Found', value: '24' } ],
    json: { file: "resume.pdf", pages: 2, tokens: 1842, language: "en", sections: ["Education", "Experience", "Projects", "Skills", "Achievements"], skills: ["React", "Node.js", "MongoDB", "AWS", "Docker", "Redis", "TypeScript"], embedding: "1536d", vectorId: "v_849201a", atsScore: 94, coverage: 0.91, formatScore: 0.98, matchedJobs: 24, topRole: "Software Engineer" }
  },
  {
    id: 'recommend', icon: Lightbulb, title: 'Recommendation Engine', desc: 'Identifying career gaps',
    color: 'text-teal-400', bgGlow: 'bg-teal-400/20', border: 'border-teal-400/30',
    terminal: ["$ Analyzing skill gaps...", "✓ AI Recommendations Generated"],
    metadata: [ { label: 'Missing Skills', value: 'Redis, AWS, System Design, CI/CD' } ],
    json: { file: "resume.pdf", pages: 2, tokens: 1842, language: "en", sections: ["Education", "Experience", "Projects", "Skills", "Achievements"], skills: ["React", "Node.js", "MongoDB", "AWS", "Docker", "Redis", "TypeScript"], embedding: "1536d", vectorId: "v_849201a", atsScore: 94, coverage: 0.91, formatScore: 0.98, matchedJobs: 24, topRole: "Software Engineer", recommendations: 8, missingSkills: ["System Design", "CI/CD"] }
  },
  {
    id: 'interview', icon: MessageSquare, title: 'Interview Intelligence', desc: 'Generating tailored questions',
    color: 'text-indigo-400', bgGlow: 'bg-indigo-400/20', border: 'border-indigo-400/30',
    terminal: ["$ Generating mock interview...", "✓ 12 Personalized Questions Generated"],
    metadata: [ { label: 'Questions', value: '12 Generated' } ],
    json: { file: "resume.pdf", pages: 2, tokens: 1842, language: "en", sections: ["Education", "Experience", "Projects", "Skills", "Achievements"], skills: ["React", "Node.js", "MongoDB", "AWS", "Docker", "Redis", "TypeScript"], embedding: "1536d", vectorId: "v_849201a", atsScore: 94, coverage: 0.91, formatScore: 0.98, matchedJobs: 24, topRole: "Software Engineer", recommendations: 8, missingSkills: ["System Design", "CI/CD"], interviewQuestions: 12 }
  },
  {
    id: 'report', icon: Award, title: 'Final AI Report', desc: 'Compiling actionable feedback',
    color: 'text-amber-400', bgGlow: 'bg-amber-400/20', border: 'border-amber-400/30',
    terminal: ["$ Formatting response...", "✓ Final Report Created", "✓ Processing Complete"],
    metadata: [ { label: 'ATS Score', value: '94' }, { label: 'Jobs', value: '24' }, { label: 'Suggestions', value: '8' }, { label: 'Ready', value: 'Yes' } ],
    json: { file: "resume.pdf", pages: 2, tokens: 1842, language: "en", sections: ["Education", "Experience", "Projects", "Skills", "Achievements"], skills: ["React", "Node.js", "MongoDB", "AWS", "Docker", "Redis", "TypeScript"], embedding: "1536d", vectorId: "v_849201a", atsScore: 94, coverage: 0.91, formatScore: 0.98, matchedJobs: 24, topRole: "Software Engineer", recommendations: 8, missingSkills: ["System Design", "CI/CD"], interviewQuestions: 12, candidate: "John Doe", processingTime: "1.4s", status: "complete" }
  }
];

const ProcessingBadge = ({ isActive, isPast, color }) => {
  const [state, setState] = useState('QUEUED');
  
  useEffect(() => {
    if (isActive && !isPast) {
      setState('INITIALIZING');
      const timer1 = setTimeout(() => setState('PROCESSING'), 150);
      const timer2 = setTimeout(() => setState('COMPLETED'), 800);
      return () => { clearTimeout(timer1); clearTimeout(timer2); };
    }
  }, [isActive, isPast]);

  if (!isActive && !isPast) return <div className="text-[10px] uppercase font-bold tracking-widest text-slate-500 border border-slate-700/50 bg-slate-800/30 px-2 py-1 rounded-md">QUEUED</div>;
  if (state === 'INITIALIZING') return <div className={`text-[10px] uppercase font-bold tracking-widest ${color} border border-current bg-current/10 px-2 py-1 rounded-md`}>INITIALIZING</div>;
  if (state === 'PROCESSING') return (
    <div className={`text-[10px] uppercase font-bold tracking-widest ${color} border border-current bg-current/10 px-2 py-1 rounded-md flex items-center gap-1`}>
      PROCESSING <span className="animate-pulse">● ● ●</span>
    </div>
  );
  return (
    <div className={`text-[10px] uppercase font-bold tracking-widest ${color} border border-current bg-current/10 px-2 py-1 rounded-md`}>
      ✓ COMPLETED
    </div>
  );
};

const AICard = ({ stage, isActive, isPast, isFinal }) => {
  const showActiveState = isActive || isPast;
  
  return (
    <motion.div
      layout
      initial={false}
      animate={{ 
        opacity: showActiveState ? 1 : 0.4,
        scale: isActive ? 1.02 : 1,
        filter: showActiveState ? 'blur(0px)' : 'blur(2px)'
      }}
      whileHover={{ scale: 1.03, y: -2 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="relative z-10 w-full"
    >
      <GlassCard className={`p-5 transition-all duration-500 overflow-hidden ${showActiveState ? 'border-white/20 bg-white/[0.04] shadow-2xl' : 'border-white/5 bg-white/[0.01]'}`}>
        {isActive && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className={`absolute inset-0 ${stage.bgGlow} blur-[60px] -z-10`} 
          />
        )}
        
        <div className="flex items-start gap-4">
          <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-500 ${showActiveState ? stage.bgGlow + ' border ' + stage.border : 'bg-white/5 border border-white/10'}`}>
            <stage.icon className={`w-6 h-6 ${showActiveState ? stage.color : 'text-slate-500 group-hover:text-white group-hover:rotate-12 transition-transform duration-300'}`} />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className={`font-bold font-display truncate ${showActiveState ? 'text-white' : 'text-slate-400'}`}>{stage.title}</h3>
              <ProcessingBadge isActive={isActive} isPast={isPast} color={stage.color} />
            </div>
            <p className="text-sm text-slate-400 truncate mb-3">{stage.desc}</p>
            
            <AnimatePresence>
              {showActiveState && !isFinal && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }} 
                  animate={{ opacity: 1, height: 'auto' }}
                  className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-white/10"
                >
                  {stage.metadata.map((meta, i) => (
                    <div key={i} className="flex flex-col">
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider">{meta.label}</span>
                      <span className="text-xs font-mono text-slate-300 truncate">{meta.value}</span>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Final Report Dashboard Expansion */}
            <AnimatePresence>
              {showActiveState && isFinal && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="pt-4 mt-4 border-t border-white/10"
                >
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <div className="text-xs text-slate-400 mb-1">ATS Score</div>
                      <div className="text-2xl font-bold text-accent-teal">94</div>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <div className="text-xs text-slate-400 mb-1">Job Matches</div>
                      <div className="text-2xl font-bold text-emerald-400">24</div>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <div className="text-xs text-slate-400 mb-1">Suggestions</div>
                      <div className="text-2xl font-bold text-amber-400">8</div>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <div className="text-xs text-slate-400 mb-1">Processing Time</div>
                      <div className="text-2xl font-bold text-purple-400">1.4s</div>
                    </div>
                  </div>
                  <button className="w-full py-3 rounded-xl bg-gradient-to-r from-accent-violet to-accent-teal text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                    <Download className="w-4 h-4" /> Download Full Report
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
};

export default function AIDemoSection() {
  const containerRef = useRef(null);
  const [activeStep, setActiveStep] = useState(0);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end 90%"]
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 20 });
  const packetTop = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);
  const progressPercent = useTransform(smoothProgress, (val) => Math.round(val * 100));

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const step = Math.floor(Math.min(latest * pipelineStages.length + 0.3, pipelineStages.length - 1));
    if (step >= 0 && step !== activeStep) {
      setActiveStep(step);
    }
  });

  // Calculate accumulated terminal logs
  const visibleLogs = pipelineStages.slice(0, activeStep + 1).flatMap(s => s.terminal);

  return (
    <section id="demo" ref={containerRef} className="py-24 relative bg-[#0A0B0F] border-t border-white/[0.04] overflow-hidden">
      {/* Background System */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(124,111,247,0.03),transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />
      {/* Dynamic spotlight behind active card */}
      <motion.div 
        className="absolute w-[600px] h-[600px] rounded-full blur-[120px] opacity-20 pointer-events-none transition-colors duration-1000"
        style={{ 
          top: `calc(${Math.min(activeStep * 10, 80)}% + 100px)`, 
          left: '20%',
          backgroundColor: pipelineStages[activeStep]?.bgGlow.match(/bg-(.+?)-\d+\//)?.[1] === 'blue' ? '#3b82f6' : 
                          pipelineStages[activeStep]?.bgGlow.match(/bg-(.+?)-\d+\//)?.[1] === 'cyan' ? '#22d3ee' : 
                          pipelineStages[activeStep]?.bgGlow.match(/bg-(.+?)-\d+\//)?.[1] === 'purple' ? '#a855f7' :
                          pipelineStages[activeStep]?.bgGlow.match(/bg-(.+?)-\d+\//)?.[1] === 'pink' ? '#ec4899' :
                          pipelineStages[activeStep]?.bgGlow.match(/bg-(.+?)-\d+\//)?.[1] === 'emerald' ? '#10b981' : '#7C5CFC'
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
            AI Resume Intelligence Engine
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-8">
            Watch Resume Copilot understand, analyze, optimize and match your resume in real time using enterprise-grade AI.
          </p>
          
          {/* Progress Header */}
          <GlassCard className="max-w-md mx-auto p-4 border-white/10 bg-white/[0.02]">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
              <span>Processing Resume...</span>
              <span className="text-white"><motion.span>{progressPercent}</motion.span>%</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden mb-3">
              <motion.div style={{ width: useTransform(smoothProgress, v => `${v * 100}%`) }} className="h-full bg-gradient-to-r from-accent-violet to-accent-teal" />
            </div>
            <div className="text-[10px] text-slate-500 uppercase tracking-widest text-left">
              Current Step: <span className="text-accent-teal">{pipelineStages[activeStep].title}...</span>
            </div>
          </GlassCard>
        </div>

        {/* 2-Column Layout */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
          
          {/* Left Column: Pipeline */}
          <div className="flex-1 relative pb-10">
            {/* The Line */}
            <div className="absolute left-6 md:left-12 top-8 bottom-0 w-[2px] bg-white/5 rounded-full" />
            
            {/* Animated Fill */}
            <motion.div 
              className="absolute left-6 md:left-12 top-8 bottom-0 w-[2px] rounded-full bg-gradient-to-b from-purple-500 via-cyan-400 to-emerald-500 origin-top"
              style={{ scaleY: scrollYProgress }} 
            />
            
            {/* Moving Packet */}
            <motion.div 
              className="absolute left-6 md:left-12 w-[2px] h-24 -ml-0 z-20"
              style={{ top: packetTop }}
            >
              <div className="w-3 h-8 rounded-full bg-white shadow-[0_0_20px_#fff,0_0_40px_#00D4AA] -translate-x-[5px]" />
              <div className="w-[2px] h-16 bg-gradient-to-t from-transparent to-white/50" />
            </motion.div>

            {/* Stages */}
            <div className="flex flex-col gap-6 relative z-10 pl-16 md:pl-28">
              <LayoutGroup>
                {pipelineStages.map((stage, idx) => {
                  const isActive = idx === activeStep;
                  const isPast = idx < activeStep;
                  const isFinal = idx === pipelineStages.length - 1;
                  
                  return (
                    <div key={stage.id} className="relative">
                      {/* Node connector dot */}
                      <div className="absolute -left-10 md:-left-16 top-6 w-3 h-3 rounded-full -translate-x-[1.5px] border-2 border-[#0A0B0F] bg-slate-700 transition-colors duration-500 z-10"
                           style={{ backgroundColor: isActive || isPast ? '#fff' : '#334155', boxShadow: isActive ? '0 0 10px #fff' : 'none' }} />
                      <AICard stage={stage} isActive={isActive} isPast={isPast} isFinal={isFinal} />
                    </div>
                  );
                })}
              </LayoutGroup>
            </div>
          </div>

          {/* Right Column: Terminal & JSON */}
          <div className="w-full lg:w-[450px] flex flex-col gap-6 sticky top-24 h-fit">
            
            {/* Live AI Terminal */}
            <GlassCard className="p-0 overflow-hidden border-white/10 bg-[#0d0f15]/80 backdrop-blur-xl flex flex-col h-[320px]">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-white/[0.02]">
                <Terminal className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-mono text-slate-400">copilot-processing.log</span>
                <div className="flex-1" />
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                </div>
              </div>
              <div className="p-4 overflow-y-auto flex-1 font-mono text-[11px] text-slate-300 flex flex-col gap-2">
                <AnimatePresence initial={false}>
                  {visibleLogs.map((log, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, x: -10 }} 
                      animate={{ opacity: 1, x: 0 }}
                      className={log.startsWith('✓') ? 'text-green-400' : log.startsWith('$') ? 'text-accent-teal' : 'text-slate-300'}
                    >
                      {log}
                    </motion.div>
                  ))}
                </AnimatePresence>
                {activeStep < pipelineStages.length - 1 && (
                  <motion.div animate={{ opacity: [0, 1] }} transition={{ repeat: Infinity, duration: 0.8 }} className="text-slate-500 mt-2">
                    █
                  </motion.div>
                )}
              </div>
            </GlassCard>

            {/* Live JSON Output */}
            <GlassCard className="p-0 overflow-hidden border-white/10 bg-[#0d0f15]/80 backdrop-blur-xl flex flex-col h-[420px]">
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/[0.02]">
                <span className="text-xs font-mono text-accent-violet">parsed_output.json</span>
                <span className="text-[10px] font-mono text-slate-500 bg-white/5 px-2 py-0.5 rounded">application/json</span>
              </div>
              <div className="p-4 overflow-y-auto flex-1 font-mono text-[11px] text-slate-300 leading-relaxed">
                <pre className="m-0">
                  <code className="language-json text-blue-300">
                    {JSON.stringify(pipelineStages[activeStep].json, null, 2)}
                  </code>
                </pre>
              </div>
            </GlassCard>
            
          </div>
        </div>
      </div>
    </section>
  );
}
