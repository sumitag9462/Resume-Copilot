import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, FileText, BrainCircuit, LayoutDashboard, Settings2, Sparkles, Command } from 'lucide-react';

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

  const commands = [
    { id: 'dashboard', title: 'Go to Dashboard', icon: LayoutDashboard, path: '/dashboard', section: 'Navigation' },
    { id: 'resumes', title: 'Manage Resumes', icon: FileText, path: '/resumes', section: 'Navigation' },
    { id: 'builder', title: 'AI Resume Builder', icon: Sparkles, path: '/builder', section: 'Tools' },
    { id: 'analyzer', title: 'ATS Analyzer', icon: BrainCircuit, path: '/analyzer', section: 'Tools' },
    { id: 'interview', title: 'Interview Copilot', icon: Command, path: '/interview-prep', section: 'Tools' },
    { id: 'settings', title: 'Workspace Settings', icon: Settings2, path: '/settings', section: 'Preferences' },
  ];

  const filteredCommands = commands.filter(cmd => 
    cmd.title.toLowerCase().includes(query.toLowerCase()) || 
    cmd.section.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleSelect = (path) => {
    setIsOpen(false);
    setQuery('');
    navigate(path);
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleNavigation = (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
      }
      if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
        e.preventDefault();
        handleSelect(filteredCommands[selectedIndex].path);
      }
    };

    window.addEventListener('keydown', handleNavigation);
    return () => window.removeEventListener('keydown', handleNavigation);
  }, [isOpen, filteredCommands, selectedIndex]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-[#0A0B0F]/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-2xl bg-[#111318] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="flex items-center px-4 border-b border-white/10">
              <Search className="w-5 h-5 text-slate-400" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="What do you need?"
                className="w-full h-14 bg-transparent border-none text-white text-lg placeholder-slate-500 focus:outline-none focus:ring-0 px-4"
              />
              <div className="flex gap-1">
                <kbd className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[10px] font-bold text-slate-400">ESC</kbd>
              </div>
            </div>

            <div className="max-h-[60vh] overflow-y-auto custom-scrollbar p-2">
              {filteredCommands.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-sm">
                  No commands found for "{query}"
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredCommands.map((cmd, idx) => (
                    <button
                      key={cmd.id}
                      onClick={() => handleSelect(cmd.path)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                        selectedIndex === idx 
                        ? 'bg-accent-violet/20 text-white' 
                        : 'text-slate-400 hover:bg-white/5'
                      }`}
                    >
                      <cmd.icon className={`w-5 h-5 ${selectedIndex === idx ? 'text-accent-violet-light' : 'opacity-70'}`} />
                      <div className="flex flex-col items-start">
                        <span className="text-sm font-bold">{cmd.title}</span>
                        <span className="text-[10px] uppercase tracking-wider opacity-70">{cmd.section}</span>
                      </div>
                      
                      {selectedIndex === idx && (
                        <span className="ml-auto flex gap-1">
                          <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[10px] font-bold text-slate-300">↵</kbd>
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
