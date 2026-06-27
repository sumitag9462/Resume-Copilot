import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, File, FileText, CheckCircle2 } from 'lucide-react';
import GlassCard from '../ui/GlassCard';

export default function UploadExperience({ onUploadComplete }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStep, setProcessStep] = useState(0);

  const processingSteps = [
    "Uploading Resume...",
    "Scanning Document...",
    "Extracting Text...",
    "Understanding Experience...",
    "Generating Embeddings...",
    "Running ATS Evaluation...",
    "Matching Job Database...",
    "Generating Insights...",
    "Done."
  ];

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      startProcessing();
    }
  };

  const startProcessing = () => {
    setIsProcessing(true);
    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step < processingSteps.length) {
        setProcessStep(step);
      } else {
        clearInterval(interval);
        setTimeout(() => {
          onUploadComplete();
        }, 500);
      }
    }, 600);
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[60vh]">
      <AnimatePresence mode="wait">
        {!isProcessing ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full"
          >
            <div className="text-center mb-8">
              <h1 className="text-3xl font-display font-bold text-white mb-3">Upload Resume for Analysis</h1>
              <p className="text-slate-400">PDF or DOCX up to 20MB</p>
            </div>
            
            <GlassCard
              className={`p-12 flex flex-col items-center justify-center border-2 border-dashed transition-all duration-300 relative overflow-hidden cursor-pointer ${
                isDragging 
                ? 'border-accent-violet bg-accent-violet/5 scale-[1.02]' 
                : 'border-white/10 hover:border-white/30 hover:bg-white/[0.02]'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={startProcessing}
            >
              {isDragging && <div className="absolute inset-0 bg-accent-violet/10 pointer-events-none" />}
              
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-all duration-300 ${
                isDragging ? 'bg-accent-violet text-white scale-110' : 'bg-white/5 text-slate-400'
              }`}>
                <UploadCloud className="w-8 h-8" />
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">Drag & Drop your resume</h3>
              <p className="text-slate-500 text-sm mb-6">or click to browse files</p>
              
              <div className="flex gap-4">
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <File className="w-3.5 h-3.5" /> PDF
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <FileText className="w-3.5 h-3.5" /> DOCX
                </span>
              </div>
            </GlassCard>
          </motion.div>
        ) : (
          <motion.div
            key="processing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full flex flex-col items-center justify-center"
          >
            <div className="relative w-32 h-32 mb-8">
              <svg className="w-full h-full animate-spin-slow" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
                <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray="300" strokeDashoffset="150" className="text-accent-violet" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                {processStep === processingSteps.length - 1 ? (
                  <CheckCircle2 className="w-10 h-10 text-success" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-accent-violet/20 flex items-center justify-center">
                    <div className="w-3 h-3 bg-accent-violet-light rounded-full animate-ping" />
                  </div>
                )}
              </div>
            </div>
            
            <div className="text-center">
              <h2 className="text-xl font-bold text-white mb-3">AI Intelligence Active</h2>
              <div className="h-6 overflow-hidden">
                <AnimatePresence mode="popLayout">
                  <motion.p
                    key={processStep}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-accent-violet-light font-medium"
                  >
                    {processingSteps[processStep]}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full max-w-md h-1.5 bg-white/5 rounded-full overflow-hidden mt-8">
              <motion.div 
                className="h-full bg-accent-violet"
                initial={{ width: 0 }}
                animate={{ width: `${(processStep / (processingSteps.length - 1)) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
