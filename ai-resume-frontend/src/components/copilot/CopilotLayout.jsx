// src/components/copilot/CopilotLayout.jsx
import { useState, useEffect } from 'react';
import LeftPanel from './LeftPanel';
import RightPanel from './RightPanel';
import { PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function CopilotLayout({
  children,
  onNewChat,
  activeContext,
  onQuickAction,
  sessions,
  activeSessionId,
  onSelectSession,
  onDeleteSession,
  onRenameSession
}) {
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Handle window resize to auto-collapse panels on smaller screens
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024; // lg breakpoint
      setIsMobile(mobile);
      if (mobile) {
        setLeftOpen(false);
        setRightOpen(false);
      } else {
        setLeftOpen(true);
        setRightOpen(true);
      }
    };
    
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex w-full h-full overflow-hidden bg-bg-base relative">
      
      {/* Mobile Backdrop - closes panels when clicked */}
      <AnimatePresence>
        {isMobile && (leftOpen || rightOpen) && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => { setLeftOpen(false); setRightOpen(false); }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Floating Toggle Buttons - always visible when panels are closed */}
      {!leftOpen && (
        <button
          onClick={() => setLeftOpen(true)}
          className="absolute left-3 top-4 z-20 p-2 rounded-xl bg-[#181C24]/90 border border-white/[0.08] text-text-muted hover:text-text-primary backdrop-blur-md transition-all shadow-lg"
        >
          <PanelLeftOpen className="w-4 h-4" />
        </button>
      )}

      {!rightOpen && (
        <button
          onClick={() => setRightOpen(true)}
          className="absolute right-3 top-4 z-20 p-2 rounded-xl bg-[#181C24]/90 border border-white/[0.08] text-text-muted hover:text-text-primary backdrop-blur-md transition-all shadow-lg"
        >
          <PanelRightOpen className="w-4 h-4" />
        </button>
      )}

      {/* LEFT PANEL */}
      <div className={`absolute lg:relative h-full flex z-40 lg:z-10 transition-transform duration-300 ${
        leftOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-0 overflow-hidden'
      }`}>
        <LeftPanel 
          isOpen={leftOpen} 
          onNewChat={onNewChat}
          sessions={sessions}
          activeSessionId={activeSessionId}
          onSelectSession={onSelectSession}
          onDeleteSession={onDeleteSession}
          onRenameSession={onRenameSession}
        />
        
        {/* Close Button overlay for left panel */}
        {leftOpen && (
          <button
            onClick={() => setLeftOpen(false)}
            className="absolute -right-4 top-4 z-50 p-1.5 rounded-lg bg-[#181C24] border border-white/[0.08] text-text-muted hover:text-white shadow-xl opacity-100 lg:opacity-0 lg:hover:opacity-100 transition-opacity"
          >
            {isMobile ? <X className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* CENTER CONTENT */}
      <div className="flex-1 min-w-0 h-full flex flex-col relative z-0">
        {children}
      </div>

      {/* RIGHT PANEL */}
      <div className={`absolute lg:relative right-0 h-full flex z-40 lg:z-10 transition-transform duration-300 ${
        rightOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0 lg:w-0 overflow-hidden'
      }`}>
        {/* Close Button overlay for right panel */}
        {rightOpen && (
          <button
            onClick={() => setRightOpen(false)}
            className="absolute -left-4 top-4 z-50 p-1.5 rounded-lg bg-[#181C24] border border-white/[0.08] text-text-muted hover:text-white shadow-xl opacity-100 lg:opacity-0 lg:hover:opacity-100 transition-opacity"
          >
             {isMobile ? <X className="w-4 h-4" /> : <PanelRightClose className="w-4 h-4" />}
          </button>
        )}
        <RightPanel isOpen={rightOpen} activeContext={activeContext} onAction={onQuickAction} />
      </div>

    </div>
  );
}
