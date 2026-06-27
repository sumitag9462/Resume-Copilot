import React from 'react';
import GlassCard from '../ui/GlassCard';
import { Mic, MicOff, Settings, Sparkles, Volume2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AIInterviewerPanel({ isListening, setIsListening, currentQuestion }) {
  return (
    <GlassCard className="p-0 overflow-hidden flex flex-col items-center">
      <div className="w-full h-40 bg-gradient-to-br from-accent-violet/20 to-accent-teal/20 relative">
        <div className="absolute inset-0 bg-[#0A0B0F]/60 backdrop-blur-sm" />
        <div className="absolute top-4 right-4 flex gap-2">
          <button className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
            <Volume2 className="w-4 h-4" />
          </button>
          <button className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
            <Settings className="w-4 h-4" />
          </button>
        </div>

        {/* Avatar */}
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-accent-violet to-accent-teal p-1 shadow-[0_0_30px_rgba(124,111,247,0.3)]">
              <div className="w-full h-full bg-[#0A0B0F] rounded-xl flex items-center justify-center overflow-hidden">
                <Sparkles className="w-8 h-8 text-accent-violet-light" />
              </div>
            </div>
            
            {/* Speaking indicator / Emotion indicator */}
            {currentQuestion && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute -right-2 -bottom-2 w-6 h-6 rounded-full bg-success flex items-center justify-center border-2 border-[#0A0B0F]"
              >
                <div className="w-2 h-2 rounded-full bg-[#0A0B0F] animate-pulse" />
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <div className="pt-14 pb-8 px-6 text-center w-full">
        <h3 className="text-lg font-bold text-white mb-1">Alex (AI)</h3>
        <p className="text-xs text-slate-400 font-medium mb-6">Senior Engineering Manager</p>

        {currentQuestion ? (
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4 mb-6 text-left">
            <div className="flex gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-accent-violet mt-1.5 animate-pulse" />
              <p className="text-sm text-white font-medium leading-relaxed">"{currentQuestion}"</p>
            </div>
          </div>
        ) : (
          <div className="h-24 flex items-center justify-center text-sm text-slate-500 italic">
            Waiting to start interview...
          </div>
        )}

        <div className="flex justify-center gap-4">
          <button 
            onClick={() => setIsListening(!isListening)}
            className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all ${
              isListening 
              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:bg-rose-500/30 shadow-[0_0_20px_rgba(244,63,94,0.2)]'
              : 'bg-accent-violet text-white hover:bg-accent-violet-light shadow-[0_0_20px_rgba(124,111,247,0.3)]'
            }`}
          >
            {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>
        </div>
        
        {isListening && (
          <div className="mt-4 flex items-center justify-center gap-1 h-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <motion.div
                key={i}
                animate={{ height: ["20%", "100%", "20%"] }}
                transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1 }}
                className="w-1 bg-accent-violet rounded-full"
              />
            ))}
          </div>
        )}
      </div>
    </GlassCard>
  );
}
