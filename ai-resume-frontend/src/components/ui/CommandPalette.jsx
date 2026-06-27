import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, FileText, Briefcase, Settings, Zap, ArrowRight, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const actions = [
  { id: 'home', label: 'Go to Dashboard', icon: Home, route: '/dashboard', category: 'Navigation' },
  { id: 'jobs', label: 'Search Jobs', icon: Briefcase, route: '/jd-match', category: 'Navigation' },
  { id: 'resumes', label: 'My Resumes', icon: FileText, route: '/resumes', category: 'Navigation' },
  { id: 'settings', label: 'Account Settings', icon: Settings, route: '/settings', category: 'Navigation' },
  { id: 'optimize', label: 'Optimize Resume', icon: Zap, route: '/analyzer', category: 'AI Tools' },
  { id: 'coverletter', label: 'Generate Cover Letter', icon: FileText, route: '/cover-letter', category: 'AI Tools' },
];

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredActions = actions.filter(a => 
    a.label.toLowerCase().includes(query.toLowerCase()) || 
    a.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (route) => {
    setIsOpen(false);
    setQuery("");
    navigate(route);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-[#0A0B0F]/80 backdrop-blur-sm z-[100]"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-2xl bg-[#121422]/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_30px_100px_rgba(0,0,0,0.8)] z-[101] overflow-hidden"
          >
            <div className="flex items-center px-4 py-4 border-b border-white/10">
              <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
              <input 
                type="text"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search commands, navigate, or ask AI..."
                className="w-full bg-transparent border-none outline-none text-lg text-white placeholder:text-slate-500 font-medium"
              />
              <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-white/5 px-2 py-1 rounded">
                ESC
              </div>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-2 scrollbar-hide">
              {filteredActions.length === 0 ? (
                <div className="p-8 text-center text-slate-400">
                  No commands found for "{query}"
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredActions.map((action, idx) => (
                    <button
                      key={action.id}
                      onClick={() => handleSelect(action.route)}
                      className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.05] transition-colors group text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-accent-violet/20 group-hover:border-accent-violet/30 transition-colors">
                          <action.icon className="w-4 h-4 text-slate-400 group-hover:text-accent-violet-light transition-colors" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">{action.label}</p>
                          <p className="text-[10px] text-slate-500 uppercase tracking-widest">{action.category}</p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-600 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
