import React, { useState } from 'react';
import { X, Sparkles, Send, Target, Zap, FileText } from 'lucide-react';

export default function AIAssistantDrawer({ onClose }) {
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Hi! I'm your AI Resume Coach. I can help you rewrite bullets, improve your summary, or optimize for a specific job description. What would you like to do?" }
  ]);
  const [input, setInput] = useState("");

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages(prev => [...prev, { role: 'user', text: input }]);
    setInput("");
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'ai', text: "I'm analyzing your request... (This is a mock response, AI integration pending)" }]);
    }, 1000);
  };

  return (
    <div className="h-full flex flex-col relative bg-[#111318]">
      {/* Header */}
      <div className="h-14 flex items-center justify-between px-4 border-b border-white/[0.05] bg-[#0A0B0F]/80 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-accent-violet to-accent-teal flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-sm font-bold text-white">AI Assistant</span>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/[0.05] text-slate-400 hover:text-white transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-b border-white/[0.05] flex flex-wrap gap-2">
        <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.05] text-[10px] font-bold uppercase tracking-wider text-slate-300 transition-colors">
          <Zap className="w-3 h-3 text-accent-teal" /> Improve Summary
        </button>
        <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.05] text-[10px] font-bold uppercase tracking-wider text-slate-300 transition-colors">
          <Target className="w-3 h-3 text-accent-violet-light" /> Match JD
        </button>
        <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.05] text-[10px] font-bold uppercase tracking-wider text-slate-300 transition-colors">
          <FileText className="w-3 h-3 text-warning" /> Fix Grammar
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar flex flex-col gap-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-2xl text-[13px] leading-relaxed ${
              msg.role === 'user' 
              ? 'bg-accent-violet text-white rounded-tr-sm' 
              : 'bg-white/[0.04] border border-white/[0.05] text-slate-300 rounded-tl-sm'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-[#0A0B0F]/80 backdrop-blur-md border-t border-white/[0.05]">
        <form onSubmit={handleSend} className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AI to improve this section..."
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-accent-violet focus:ring-1 focus:ring-accent-violet/50 transition-all"
          />
          <button 
            type="submit"
            disabled={!input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-accent-violet/20 hover:bg-accent-violet text-accent-violet-light hover:text-white flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
