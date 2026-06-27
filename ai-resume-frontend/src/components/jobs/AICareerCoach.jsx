import React, { useState } from 'react';
import { Bot, Send, X, Sparkles, User, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AICareerCoach() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Hi! I'm your AI Career Coach. Need help negotiating a salary or preparing for an interview?" }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'ai', text: "I can analyze that for you. Based on the job description, I recommend highlighting your work with React Server Components." }]);
    }, 1000);
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-gradient-to-br from-accent-violet to-accent-teal shadow-[0_10px_30px_rgba(124,111,247,0.4)] flex items-center justify-center hover:scale-110 transition-transform z-50 group"
          >
            <Bot className="w-6 h-6 text-white" />
            <div className="absolute right-full mr-4 whitespace-nowrap bg-[#121422] border border-white/10 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              AI Career Coach
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-8 right-8 w-[380px] max-h-[600px] h-[80vh] bg-[#0A0B0F]/95 backdrop-blur-3xl border border-white/10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col z-50 overflow-hidden"
          >
            <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-accent-violet/20 flex items-center justify-center border border-accent-violet/30">
                  <Bot className="w-4 h-4 text-accent-violet-light" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Career Coach</h3>
                  <p className="text-[10px] text-accent-teal uppercase tracking-widest font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-teal animate-pulse" /> Online
                  </p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-hide">
              {messages.map((msg, i) => (
                <div key={i} className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-6 h-6 rounded-full flex flex-shrink-0 items-center justify-center ${msg.role === 'user' ? 'bg-white/10' : 'bg-accent-violet/20'}`}>
                    {msg.role === 'user' ? <User className="w-3 h-3 text-slate-300" /> : <Sparkles className="w-3 h-3 text-accent-violet-light" />}
                  </div>
                  <div className={`p-3 rounded-2xl max-w-[80%] text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-white/10 text-white rounded-tr-none' 
                      : 'bg-accent-violet/10 border border-accent-violet/20 text-slate-200 rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSend} className="p-4 border-t border-white/10 bg-white/[0.02]">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything..."
                  className="w-full bg-[#121422] border border-white/10 rounded-full py-3 pl-4 pr-12 text-sm text-white placeholder:text-slate-500 outline-none focus:border-accent-violet/50 transition-colors"
                />
                <button type="submit" disabled={!input.trim()} className="absolute right-2 w-8 h-8 rounded-full bg-accent-violet text-white flex items-center justify-center hover:bg-accent-violet-light transition-colors disabled:opacity-50 disabled:hover:bg-accent-violet">
                  <Send className="w-3.5 h-3.5 -ml-0.5" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Internal ChevronDown component to avoid another lucide import if missing
const ChevronDown = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);
