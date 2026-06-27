import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TopToolbar from '../components/builder/TopToolbar';
import LeftSidebar from '../components/builder/LeftSidebar';
import ResumeEditor from '../components/builder/ResumeEditor';
import LivePreview from '../components/builder/LivePreview';
import AIAssistantDrawer from '../components/builder/AIAssistantDrawer';

export default function BuilderPage() {
  const [activeSection, setActiveSection] = useState('summary');
  const [showAI, setShowAI] = useState(false);

  // Resume state mocking for now. In a real app, this would be managed by a context or redux.
  const [resumeData, setResumeData] = useState({
    name: 'Untitled Resume',
    version: '1.0',
    atsScore: 82,
    sections: [
      { id: 'personal', title: 'Personal Information', completed: 100 },
      { id: 'summary', title: 'Professional Summary', completed: 80 },
      { id: 'experience', title: 'Experience', completed: 60 },
      { id: 'education', title: 'Education', completed: 100 },
      { id: 'skills', title: 'Skills', completed: 40 },
    ],
    content: {
      summary: "Experienced software engineer with a passion for developing innovative programs that expedite the efficiency and effectiveness of organizational success."
    }
  });

  return (
    <div className="h-screen w-full bg-[#0A0B0F] text-slate-300 flex flex-col overflow-hidden font-body selection:bg-accent-violet/30 selection:text-white">
      {/* Top Toolbar */}
      <TopToolbar 
        resumeData={resumeData} 
        toggleAI={() => setShowAI(!showAI)} 
        isAIOpen={showAI} 
      />

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar (Navigator) */}
        <div className="w-[280px] hidden lg:flex flex-col border-r border-white/[0.05] bg-[#0A0B0F]">
          <LeftSidebar 
            sections={resumeData.sections} 
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            setResumeData={setResumeData}
          />
        </div>

        {/* Editor Area */}
        <div className="flex-1 flex flex-col bg-[#050505] overflow-y-auto custom-scrollbar relative">
          <ResumeEditor 
            activeSection={activeSection} 
            resumeData={resumeData}
            setResumeData={setResumeData}
          />
        </div>

        {/* Live Preview */}
        <div className="w-[450px] hidden xl:flex flex-col border-l border-white/[0.05] bg-[#0A0B0F]/50">
          <LivePreview resumeData={resumeData} />
        </div>

        {/* AI Assistant Drawer */}
        <AnimatePresence>
          {showAI && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="border-l border-white/[0.05] bg-[#111318] flex flex-col z-20 shrink-0"
            >
              <AIAssistantDrawer onClose={() => setShowAI(false)} />
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
