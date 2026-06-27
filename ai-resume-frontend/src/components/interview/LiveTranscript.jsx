import React from 'react';
import GlassCard from '../ui/GlassCard';
import { motion, AnimatePresence } from 'framer-motion';

export default function LiveTranscript({ activeQuestionIndex, questions = [] }) {
  // Mock transcript data
  const transcript = [
    { role: 'ai', text: "Hello! I'm Alex. Let's start with your background. " + (questions[0]?.question || "Can you tell me about yourself?") },
    { role: 'user', text: "Sure, I am a frontend engineer with 3 years of experience..." },
    { role: 'ai', text: "Great. Let's move on to the next topic. " + (questions[1]?.question || "Why did you choose React for your recent project?") }
  ];

  return (
    <GlassCard className="flex flex-col h-[500px] p-0 overflow-hidden">
      <div className="h-14 flex items-center px-4 border-b border-white/[0.05] bg-white/[0.02]">
        <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">Live Transcript</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
        <AnimatePresence>
          {transcript.map((msg, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] p-4 text-[14px] leading-relaxed rounded-2xl ${
                msg.role === 'user' 
                ? 'bg-accent-violet text-white rounded-tr-sm font-medium' 
                : 'bg-white/[0.04] border border-white/[0.05] text-slate-300 rounded-tl-sm'
              }`}>
                {msg.text}
              </div>
            </motion.div>
          ))}
          
          {/* Active Listening Indicator */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-end"
          >
             <div className="max-w-[85%] p-4 text-[14px] leading-relaxed rounded-2xl bg-accent-violet/20 border border-accent-violet/30 text-accent-violet-light rounded-tr-sm italic flex items-center gap-2">
                Listening...
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-violet-light animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-violet-light animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-violet-light animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
             </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </GlassCard>
  );
}
