import React from 'react';
import GlassCard from '../ui/GlassCard';
import { FileText, Maximize2, Search } from 'lucide-react';

export default function AnalyzerResumePreview() {
  return (
    <GlassCard className="p-0 overflow-hidden flex flex-col h-full border-t-2 border-t-accent-violet">
      <div className="h-14 flex items-center justify-between px-4 border-b border-white/[0.05] bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-accent-violet-light" />
          <span className="text-sm font-bold text-white">Document Preview</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-1.5 rounded-lg hover:bg-white/[0.05] text-slate-400 hover:text-white transition-colors">
            <Search className="w-4 h-4" />
          </button>
          <button className="p-1.5 rounded-lg hover:bg-white/[0.05] text-slate-400 hover:text-white transition-colors">
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 bg-[#050505] overflow-auto custom-scrollbar p-6 flex justify-center">
        {/* Mock PDF Document */}
        <div className="w-full max-w-[400px] bg-white text-black p-8 rounded-sm shadow-2xl relative min-h-[500px]">
          {/* Heatmap Overlay Simulation */}
          <div className="absolute top-10 left-6 right-6 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded pointer-events-none" />
          <div className="absolute top-28 left-6 right-6 h-20 bg-rose-500/10 border border-rose-500/20 rounded pointer-events-none" />
          
          <div className="border-b-2 border-slate-200 pb-4 mb-4">
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">John Doe</h1>
            <p className="text-[10px] text-slate-500 mt-1">Software Engineer | contact@johndoe.com</p>
          </div>
          
          <div className="mb-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2">Professional Summary</h2>
            <p className="text-[9px] leading-relaxed text-slate-600">
              Experienced software engineer with a passion for developing innovative programs that expedite the efficiency and effectiveness of organizational success.
            </p>
          </div>

          <div className="mb-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2">Experience</h2>
            <div className="mb-3">
              <h3 className="text-[10px] font-bold text-slate-800">Senior Frontend Engineer</h3>
              <p className="text-[9px] text-slate-600 italic mb-1">Tech Corp Inc.</p>
              <ul className="list-disc pl-4 text-[9px] text-slate-600 space-y-1">
                <li>Led migration to <span className="bg-emerald-500/20 text-emerald-800 font-bold px-1 rounded">React</span> 18.</li>
                <li>Responsible for fixing bugs and improving the UI.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
