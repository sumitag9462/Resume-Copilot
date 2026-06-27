import React from 'react';
import { ChevronLeft, Cloud, Check, Download, Share2, Sparkles, LayoutTemplate, Settings2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import GradientButton from '../ui/GradientButton';

export default function TopToolbar({ resumeData, toggleAI, isAIOpen }) {
  return (
    <header className="h-16 flex items-center justify-between px-4 border-b border-white/[0.05] bg-[#0A0B0F] shrink-0 z-30">
      <div className="flex items-center gap-4">
        <Link to="/resumes" className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/[0.05] text-slate-400 hover:text-white transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            <h1 className="text-sm font-bold text-white tracking-wide">{resumeData.name}</h1>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-white/[0.03] px-2 py-0.5 rounded border border-white/[0.05]">
              v{resumeData.version}
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Cloud className="w-3 h-3 text-slate-500" />
            <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
              Auto-saved <Check className="w-3 h-3 text-success ml-1" />
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-3 mr-4">
          <div className="flex items-center gap-2 bg-white/[0.02] border border-white/[0.05] rounded-lg px-3 py-1.5">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">ATS Score</span>
            <span className="text-sm font-bold text-success">{resumeData.atsScore}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white/[0.02] border border-white/[0.05] rounded-xl p-1">
          <button className="h-8 px-3 text-xs font-semibold text-slate-400 hover:text-white rounded-lg hover:bg-white/[0.05] transition-colors flex items-center gap-2">
            <LayoutTemplate className="w-4 h-4" /> Template
          </button>
          <button className="h-8 px-3 text-xs font-semibold text-slate-400 hover:text-white rounded-lg hover:bg-white/[0.05] transition-colors flex items-center gap-2">
            <Settings2 className="w-4 h-4" /> Theme
          </button>
        </div>

        <div className="w-px h-6 bg-white/[0.05] mx-2" />

        <button className="h-10 px-4 text-sm font-semibold text-slate-300 hover:text-white rounded-xl hover:bg-white/[0.05] border border-transparent hover:border-white/[0.05] transition-all flex items-center gap-2">
          <Share2 className="w-4 h-4" /> Share
        </button>
        <button className="h-10 px-4 text-sm font-semibold text-slate-300 hover:text-white rounded-xl hover:bg-white/[0.05] border border-white/[0.05] transition-all flex items-center gap-2">
          <Download className="w-4 h-4" /> Export
        </button>

        <GradientButton 
          variant={isAIOpen ? "secondary" : "primary"}
          className={`h-10 px-4 text-sm rounded-xl ml-2 flex items-center gap-2 transition-all ${isAIOpen ? "border-accent-violet text-accent-violet-light bg-accent-violet/10" : ""}`}
          onClick={toggleAI}
        >
          <Sparkles className="w-4 h-4" /> {isAIOpen ? "Close AI" : "AI Assistant"}
        </GradientButton>
      </div>
    </header>
  );
}
