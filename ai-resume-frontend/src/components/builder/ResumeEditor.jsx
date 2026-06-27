import React from 'react';
import { Bold, Italic, Link2, List, ListOrdered, Sparkles, Wand2 } from 'lucide-react';
import GlassCard from '../ui/GlassCard';

export default function ResumeEditor({ activeSection, resumeData, setResumeData }) {
  const activeSectionData = resumeData.sections.find(s => s.id === activeSection);
  const content = resumeData.content[activeSection] || "";

  const handleChange = (e) => {
    setResumeData(prev => ({
      ...prev,
      content: {
        ...prev.content,
        [activeSection]: e.target.value
      }
    }));
  };

  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-white mb-2">{activeSectionData?.title || 'Section Editor'}</h1>
        <p className="text-sm text-slate-400">Edit your professional details. AI suggestions are available via the assistant.</p>
      </div>

      <GlassCard className="p-0 overflow-hidden flex flex-col flex-1 max-h-[600px] border border-white/[0.05]">
        {/* Formatting Toolbar */}
        <div className="flex items-center gap-1 p-2 border-b border-white/[0.05] bg-white/[0.02]">
          <button className="p-2 rounded-lg hover:bg-white/[0.05] text-slate-400 hover:text-white transition-colors" title="Bold (Ctrl+B)">
            <Bold className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-lg hover:bg-white/[0.05] text-slate-400 hover:text-white transition-colors" title="Italic (Ctrl+I)">
            <Italic className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-lg hover:bg-white/[0.05] text-slate-400 hover:text-white transition-colors" title="Link (Ctrl+K)">
            <Link2 className="w-4 h-4" />
          </button>
          
          <div className="w-px h-5 bg-white/[0.1] mx-1" />
          
          <button className="p-2 rounded-lg hover:bg-white/[0.05] text-slate-400 hover:text-white transition-colors" title="Bullet List">
            <List className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-lg hover:bg-white/[0.05] text-slate-400 hover:text-white transition-colors" title="Numbered List">
            <ListOrdered className="w-4 h-4" />
          </button>

          <div className="w-px h-5 bg-white/[0.1] mx-1" />

          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-accent-violet/20 text-accent-violet-light transition-colors ml-auto text-xs font-bold uppercase tracking-wider border border-transparent hover:border-accent-violet/30">
            <Wand2 className="w-3.5 h-3.5" /> Improve with AI
          </button>
        </div>

        {/* Text Area (Simulating Rich Text) */}
        <textarea
          value={content}
          onChange={handleChange}
          className="flex-1 w-full p-6 bg-transparent text-slate-200 resize-none outline-none leading-relaxed custom-scrollbar placeholder:text-slate-600 font-body text-[15px]"
          placeholder={`Write your ${activeSectionData?.title.toLowerCase()} here...`}
        />
      </GlassCard>

      {/* AI Contextual Suggestion (Mock) */}
      <div className="mt-6 p-4 rounded-xl bg-accent-teal/10 border border-accent-teal/20 flex items-start gap-4">
        <div className="w-8 h-8 rounded-full bg-accent-teal/20 flex items-center justify-center shrink-0 mt-0.5">
          <Sparkles className="w-4 h-4 text-accent-teal-light" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-accent-teal-light mb-1">AI Suggestion</h4>
          <p className="text-sm text-accent-teal/80 leading-relaxed mb-3">
            Your summary could be stronger by quantifying your impact. Try mentioning specific metrics like "increased efficiency by X%".
          </p>
          <div className="flex gap-3">
            <button className="text-xs font-bold uppercase tracking-wider text-accent-teal-light hover:text-white transition-colors">Apply Suggestion</button>
            <button className="text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-300 transition-colors">Dismiss</button>
          </div>
        </div>
      </div>
    </div>
  );
}
