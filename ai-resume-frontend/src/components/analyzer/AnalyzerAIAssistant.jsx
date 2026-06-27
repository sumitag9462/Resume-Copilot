import React, { useState } from 'react';
import GlassCard from '../ui/GlassCard';
import { Sparkles, Send, Bot } from 'lucide-react';

export default function AnalyzerAIAssistant() {
  const [messages, setMessages] = useState([
    { role: 'ai', text: "I've analyzed your resume against the industry standards for Frontend roles. Your formatting is excellent, but your Experience section is missing key metrics. Would you like me to rewrite your most recent role to include impact metrics?" }
  ]);
  const [input, setInput] = useState("");

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages(prev => [...prev, { role: 'user', text: input }]);
    setInput("");
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'ai', text: "I am processing your request. (This is a mock response, AI integration pending)" }]);
    }, 1000);
  };

  return (
    <GlassCard className="flex flex-col h-full border-t-2 border-t-accent-teal p-0 overflow-hidden">
      {/* Header */}
      <div className="h-14 flex items-center gap-3 px-4 border-b border-white/[0.05] bg-white/[0.02]">
        <div className="w-8 h-8 rounded-xl bg-accent-teal/20 flex items-center justify-center">
          <Bot className="w-4 h-4 text-accent-teal-light" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">Career Coach</h3>
          <p className="text-[10px] text-slate-400">Context: Frontend Engineer</p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar flex flex-col gap-4 max-h-[500px]">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 text-[13px] leading-relaxed rounded-2xl ${
              msg.role === 'user' 
              ? 'bg-accent-teal text-[#0A0B0F] rounded-tr-sm font-medium' 
              : 'bg-white/[0.04] border border-white/[0.05] text-slate-300 rounded-tl-sm'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/[0.05] bg-white/[0.01]">
        <form onSubmit={handleSend} className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask for resume advice..."
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-accent-teal focus:ring-1 focus:ring-accent-teal/50 transition-all"
          />
          <button 
            type="submit"
            disabled={!input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-accent-teal/20 hover:bg-accent-teal text-accent-teal-light hover:text-[#0A0B0F] flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </GlassCard>
  );
}
