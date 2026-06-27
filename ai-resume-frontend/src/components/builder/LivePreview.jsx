import React from 'react';
import { Maximize2, Minus, Plus, Search } from 'lucide-react';

export default function LivePreview({ resumeData }) {
  return (
    <div className="flex flex-col h-full w-full bg-[#0A0B0F]/50">
      {/* Preview Toolbar */}
      <div className="h-14 flex items-center justify-between px-4 border-b border-white/[0.05]">
        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">Live Preview</span>
        <div className="flex items-center gap-1 bg-white/[0.02] border border-white/[0.05] rounded-lg p-1">
          <button className="p-1.5 rounded hover:bg-white/[0.05] text-slate-400 hover:text-white transition-colors">
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="text-[10px] font-bold text-slate-300 w-10 text-center">100%</span>
          <button className="p-1.5 rounded hover:bg-white/[0.05] text-slate-400 hover:text-white transition-colors">
            <Plus className="w-3.5 h-3.5" />
          </button>
          <div className="w-px h-4 bg-white/[0.1] mx-1" />
          <button className="p-1.5 rounded hover:bg-white/[0.05] text-slate-400 hover:text-white transition-colors">
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* PDF Viewport */}
      <div className="flex-1 overflow-auto custom-scrollbar p-8 bg-[#050505] flex justify-center items-start">
        {/* Mock A4 Paper */}
        <div className="w-full max-w-[400px] aspect-[1/1.414] bg-white shadow-xl rounded-sm p-8 text-black font-sans relative overflow-hidden transition-all duration-300 transform origin-top hover:shadow-2xl">
          {/* Content Mock */}
          <div className="border-b-2 border-slate-200 pb-4 mb-4">
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">John Doe</h1>
            <p className="text-[10px] text-slate-500 mt-1">Software Engineer | contact@johndoe.com | linkedin.com/in/johndoe</p>
          </div>
          
          <div className="mb-4 relative">
            {/* Highlight overlay for active editing section */}
            <div className="absolute -inset-2 bg-accent-violet/10 border border-accent-violet/30 rounded pointer-events-none opacity-0 transition-opacity" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2">Professional Summary</h2>
            <p className="text-[9px] leading-relaxed text-slate-600">
              {resumeData.content.summary || "Experienced software engineer with a passion for developing innovative programs..."}
            </p>
          </div>

          <div className="mb-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2">Experience</h2>
            <div className="mb-3">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="text-[10px] font-bold text-slate-800">Senior Frontend Engineer</h3>
                <span className="text-[9px] text-slate-500">2021 - Present</span>
              </div>
              <p className="text-[9px] text-slate-600 italic mb-1">Tech Corp Inc.</p>
              <ul className="list-disc pl-4 text-[9px] text-slate-600 space-y-1">
                <li>Led migration to React 18, improving performance by 40%.</li>
                <li>Mentored 5 junior developers and established CI/CD pipelines.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
