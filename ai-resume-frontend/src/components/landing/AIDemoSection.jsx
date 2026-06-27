import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useSpring, useMotionValueEvent } from 'framer-motion';
import { FileUp, ScanText, FileText, Brain, Database, Shield, Target, Award, Terminal } from 'lucide-react';
import GlassCard from '../ui/GlassCard';

export const pipelineStages = [
  {
    id: 'upload', icon: FileUp, title: 'Resume Upload', desc: 'Securely receiving document',
    color: 'text-blue-500', bgGlow: 'bg-blue-500/20', border: 'border-blue-500/30',
    terminal: ["$ Uploading resume...", "✓ PDF securely transferred", "✓ File integrity verified"],
    metadata: [ { label: 'Input', value: 'resume.pdf' }, { label: 'Size', value: '482 KB' }, { label: 'Latency', value: '12ms' } ],
    json: { file: "resume.pdf", pages: 2, status: "uploaded" },
    status: "EXTRACTED"
  },
  {
    id: 'ocr', icon: ScanText, title: 'OCR & Text Extraction', desc: 'Converting document to raw tokens',
    color: 'text-cyan-400', bgGlow: 'bg-cyan-400/20', border: 'border-cyan-400/30',
    terminal: ["$ Initializing vision model...", "✓ OCR completed", "✓ 1842 tokens extracted"],
    metadata: [ { label: 'Tokens', value: '1842' }, { label: 'Confidence', value: '99.8%' }, { label: 'Latency', value: '24ms' }, { label: 'Model', value: 'Gemini 2.5 Flash' } ],
    json: { file: "resume.pdf", pages: 2, tokens: 1842, extraction_accuracy: 0.998 },
    status: "TOKENIZED"
  },
  {
    id: 'parse', icon: FileText, title: 'Structure Parsing', desc: 'Identifying logical sections',
    color: 'text-purple-500', bgGlow: 'bg-purple-500/20', border: 'border-purple-500/30',
    terminal: ["$ Analyzing semantic structure...", "✓ Experience section found", "✓ Education mapped", "✓ Structure identified"],
    metadata: [ { label: 'Sections', value: '4 Detected' }, { label: 'Latency', value: '18ms' } ],
    json: { file: "resume.pdf", pages: 2, tokens: 1842, sections: ["Experience", "Education", "Projects", "Skills"] },
    status: "PARSED"
  },
  {
    id: 'skills', icon: Brain, title: 'Skill Detection', desc: 'Extracting technical and soft skills',
    color: 'text-pink-500', bgGlow: 'bg-pink-500/20', border: 'border-pink-500/30',
    terminal: ["$ Running NER for entities...", "✓ Hard skills extracted", "✓ Soft skills evaluated", "✓ Skills indexed"],
    metadata: [ { label: 'Skills', value: '28' }, { label: 'Latency', value: '31ms' }, { label: 'Experience', value: '2 Years' } ],
    json: { file: "resume.pdf", pages: 2, tokens: 1842, sections: ["Experience", "Education", "Projects", "Skills"], candidate: { experience: "2 Years", skills: ["React", "Node.js", "MongoDB", "AWS", "Docker", "TypeScript"] } },
    status: "INDEXED"
  },
  {
    id: 'embed', icon: Database, title: 'Semantic Embedding', desc: 'Translating text to vector space',
    color: 'text-rose-500', bgGlow: 'bg-rose-500/20', border: 'border-rose-500/30',
    terminal: ["$ Generating embeddings...", "✓ 1536-dimensional vector created", "✓ Vector indexed into memory"],
    metadata: [ { label: 'Dimensions', value: '1536' }, { label: 'Latency', value: '45ms' } ],
    json: { file: "resume.pdf", pages: 2, tokens: 1842, sections: ["Experience", "Education", "Projects", "Skills"], candidate: { experience: "2 Years", skills: ["React", "Node.js", "MongoDB", "AWS", "Docker", "TypeScript"] }, embedding: "1536d-vector-indexed" },
    status: "EMBEDDED"
  },
  {
    id: 'ats', icon: Shield, title: 'ATS Evaluation', desc: 'Checking against standard ATS filters',
    color: 'text-orange-500', bgGlow: 'bg-orange-500/20', border: 'border-orange-500/30',
    terminal: ["$ Loading ATS constraints...", "✓ Format passes checks", "✓ Keyword density optimal", "✓ ATS analysis finished"],
    metadata: [ { label: 'ATS Score', value: '94/100' }, { label: 'Coverage', value: '91%' }, { label: 'Latency', value: '14ms' } ],
    json: { file: "resume.pdf", pages: 2, tokens: 1842, sections: ["Experience", "Education", "Projects", "Skills"], candidate: { experience: "2 Years", skills: ["React", "Node.js", "MongoDB", "AWS", "Docker", "TypeScript"] }, atsScore: 94, keywordCoverage: 0.91 },
    status: "ANALYZED"
  },
  {
    id: 'match', icon: Target, title: 'Job Matching', desc: 'Querying vector database for roles',
    color: 'text-emerald-500', bgGlow: 'bg-emerald-500/20', border: 'border-emerald-500/30',
    terminal: ["$ Querying active jobs...", "✓ Cosine similarity computed", "✓ 24 High-confidence matches found", "✓ Job matching complete"],
    metadata: [ { label: 'Matches', value: '24' }, { label: 'Top Match', value: 'Software Engineer' }, { label: 'Latency', value: '38ms' } ],
    json: { file: "resume.pdf", pages: 2, tokens: 1842, sections: ["Experience", "Education", "Projects", "Skills"], candidate: { experience: "2 Years", skills: ["React", "Node.js", "MongoDB", "AWS", "Docker", "TypeScript"] }, atsScore: 94, matches: 24, topRole: "Software Engineer" },
    status: "MATCHED"
  },
  {
    id: 'report', icon: Award, title: 'Final Report', desc: 'Compiling actionable feedback',
    color: 'text-amber-400', bgGlow: 'bg-amber-400/20', border: 'border-amber-400/30',
    terminal: ["$ Formatting response...", "✓ Processing Complete"],
    metadata: [ { label: 'Total Time', value: '1.4s' }, { label: 'Recommendations', value: '8' }, { label: 'Status', value: 'Ready' } ],
    json: { file: "resume.pdf", pages: 2, tokens: 1842, sections: ["Experience", "Education", "Projects", "Skills"], candidate: { experience: "2 Years", skills: ["React", "Node.js", "MongoDB", "AWS", "Docker", "TypeScript"] }, atsScore: 94, matches: 24, topRole: "Software Engineer", recommendations: 8, processingTime: "1.4s" },
    status: "COMPLETED"
  }
];

const ProcessingBadge = ({ isActive, isPast, color }) => {
  const [thinking, setThinking] = useState(false);
  
  useEffect(() => {
    if (isActive && !isPast) {
      setThinking(true);
      const timer = setTimeout(() => setThinking(false), 800);
      return () => clearTimeout(timer);
    }
  }, [isActive, isPast]);

  if (!isActive && !isPast) return <div className="text-[10px] uppercase font-bold tracking-widest text-slate-500 border border-slate-700/50 bg-slate-800/30 px-2 py-1 rounded-md">QUEUED</div>;
  if (thinking) return (
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

const AICard = ({ stage, isActive, isPast }) => {
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
            <stage.icon className={`w-6 h-6 ${showActiveState ? stage.color : 'text-slate-500'}`} />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className={`font-bold font-display truncate ${showActiveState ? 'text-white' : 'text-slate-400'}`}>{stage.title}</h3>
              <ProcessingBadge isActive={isActive} isPast={isPast} color={stage.color} />
            </div>
            <p className="text-sm text-slate-400 truncate mb-3">{stage.desc}</p>
            
            <AnimatePresence>
              {showActiveState && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }} 
                  animate={{ opacity: 1, height: 'auto' }}
                  className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10"
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
    offset: ["start center", "end 80%"]
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 20 });
  const lineHeight = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);
  const packetTop = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);
  const progressPercent = useTransform(smoothProgress, (val) => Math.round(val * 100));

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // Adding slight offset so the first step activates quickly
    const step = Math.floor(Math.min(latest * pipelineStages.length + 0.5, pipelineStages.length - 1));
    if (step >= 0 && step !== activeStep) {
      setActiveStep(step);
    }
  });

  // Calculate accumulated terminal logs
  const visibleLogs = pipelineStages.slice(0, activeStep + 1).flatMap(s => s.terminal);

  return (
    <section id="demo" ref={containerRef} className="py-24 relative bg-[#0A0B0F] border-t border-white/[0.04]">
      {/* Background System */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(124,111,247,0.03),transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/10 mb-6">
            <span className="w-2 h-2 rounded-full bg-accent-teal animate-pulse" />
            <span className="text-xs font-mono text-slate-300 uppercase tracking-widest">Live Execution Engine</span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
            AI Resume Intelligence Engine
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Watch Resume Copilot understand, analyze, and optimize your resume in real time.
          </p>
          <div className="flex items-center justify-center gap-4 mt-8 font-mono text-sm">
            <div className="flex items-center gap-1 text-slate-500">
              [<motion.span>{progressPercent}</motion.span>%]
            </div>
            <div className="h-1 w-32 bg-white/5 rounded-full overflow-hidden">
              <motion.div style={{ width: useTransform(smoothProgress, v => `${v * 100}%`) }} className="h-full bg-gradient-to-r from-accent-violet to-accent-teal" />
            </div>
          </div>
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
              {pipelineStages.map((stage, idx) => {
                const isActive = idx === activeStep;
                const isPast = idx < activeStep;
                
                return (
                  <div key={stage.id} className="relative">
                    {/* Node connector dot */}
                    <div className="absolute -left-10 md:-left-16 top-6 w-3 h-3 rounded-full -translate-x-[1.5px] border-2 border-[#0A0B0F] bg-slate-700 transition-colors duration-500 z-10"
                         style={{ backgroundColor: isActive || isPast ? '#fff' : '#334155' }} />
                    <AICard stage={stage} isActive={isActive} isPast={isPast} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Terminal & JSON */}
          <div className="w-full lg:w-[450px] flex flex-col gap-6 sticky top-24 h-fit">
            
            {/* Live AI Terminal */}
            <GlassCard className="p-0 overflow-hidden border-white/10 bg-[#0d0f15]/80 backdrop-blur-xl flex flex-col h-[280px]">
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
              <div className="p-4 overflow-y-auto flex-1 font-mono text-xs text-slate-300 flex flex-col gap-2">
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
                  <motion.div animate={{ opacity: [0, 1] }} transition={{ repeat: Infinity, duration: 0.8 }} className="text-slate-500">
                    █
                  </motion.div>
                )}
              </div>
            </GlassCard>

            {/* Live JSON Output */}
            <GlassCard className="p-0 overflow-hidden border-white/10 bg-[#0d0f15]/80 backdrop-blur-xl flex flex-col h-[380px]">
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
