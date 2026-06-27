import React from 'react';
import { Reorder } from 'framer-motion';
import { GripVertical, AlertCircle, CheckCircle2, ChevronRight, Plus } from 'lucide-react';

export default function LeftSidebar({ sections, activeSection, setActiveSection, setResumeData }) {
  
  const handleReorder = (newOrder) => {
    setResumeData(prev => ({ ...prev, sections: newOrder }));
  };

  return (
    <div className="flex flex-col h-full w-full relative">
      <div className="p-6 pb-4">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-6">Document Structure</h2>
        
        <Reorder.Group 
          axis="y" 
          values={sections} 
          onReorder={handleReorder}
          className="flex flex-col gap-2"
        >
          {sections.map((section) => (
            <Reorder.Item 
              key={section.id} 
              value={section}
              className={`flex flex-col rounded-xl border border-transparent cursor-pointer transition-colors relative group ${activeSection === section.id ? 'bg-white/[0.04] border-white/[0.08]' : 'hover:bg-white/[0.02]'}`}
              onClick={() => setActiveSection(section.id)}
            >
              <div className="flex items-center justify-between p-3">
                <div className="flex items-center gap-3">
                  <div className="cursor-grab active:cursor-grabbing text-slate-600 hover:text-slate-400 p-1 rounded hover:bg-white/[0.05] transition-colors -ml-1">
                    <GripVertical className="w-4 h-4" />
                  </div>
                  <span className={`text-sm font-semibold transition-colors ${activeSection === section.id ? 'text-white' : 'text-slate-400 group-hover:text-slate-300'}`}>
                    {section.title}
                  </span>
                </div>
                
                {section.completed === 100 ? (
                  <CheckCircle2 className="w-4 h-4 text-success" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-warning" />
                )}
              </div>
              
              {/* Progress Indicator */}
              <div className="px-3 pb-3">
                <div className="h-1 w-full bg-white/[0.05] rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${section.completed === 100 ? 'bg-success' : 'bg-warning'}`}
                    style={{ width: `${section.completed}%` }}
                  />
                </div>
              </div>

              {/* Active Indicator Line */}
              {activeSection === section.id && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-accent-violet rounded-r-full" />
              )}
            </Reorder.Item>
          ))}
        </Reorder.Group>
      </div>

      <div className="px-6 py-4 mt-auto border-t border-white/[0.05]">
        <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-white/[0.1] text-sm font-semibold text-slate-400 hover:text-white hover:border-white/20 hover:bg-white/[0.02] transition-all">
          <Plus className="w-4 h-4" /> Add Section
        </button>
      </div>
    </div>
  );
}
