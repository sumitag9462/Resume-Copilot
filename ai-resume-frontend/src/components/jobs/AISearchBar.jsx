import React, { useState } from 'react';
import { Search, Sparkles, Command, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const suggestions = [
  "Find remote React jobs above ₹18 LPA",
  "Show jobs matching my latest resume",
  "Companies hiring freshers in Bangalore",
  "Remote Frontend Engineer roles at startups"
];

export default function AISearchBar({ onSearch }) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
      setIsFocused(false);
    }
  };

  return (
    <div className="relative z-50 w-full max-w-3xl mx-auto">
      <form 
        onSubmit={handleSubmit}
        className={`relative flex items-center w-full transition-all duration-300 rounded-2xl border ${
          isFocused ? 'border-accent-violet/50 bg-white/[0.04] shadow-[0_0_30px_rgba(124,111,247,0.15)]' : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.03]'
        } overflow-hidden backdrop-blur-xl`}
      >
        <div className="pl-4 pr-3 py-4 flex items-center justify-center">
          {isFocused ? (
            <Sparkles className="w-5 h-5 text-accent-violet animate-pulse" />
          ) : (
            <Search className="w-5 h-5 text-slate-400" />
          )}
        </div>
        
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          placeholder="Ask AI to find your next role... (e.g. 'Staff Engineer in London')"
          className="w-full bg-transparent border-none outline-none text-white placeholder:text-slate-500 py-4 text-[15px] font-medium"
        />

        <div className="pr-4 flex items-center gap-2">
          {!query && (
            <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded bg-white/5 border border-white/10 text-[10px] text-slate-400 font-bold tracking-widest">
              <Command className="w-3 h-3" /> K
            </div>
          )}
          {query && (
            <button type="submit" className="flex items-center justify-center w-8 h-8 rounded-full bg-accent-violet text-white hover:bg-accent-violet-light transition-colors">
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </form>

      <AnimatePresence>
        {isFocused && !query && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-[#121422]/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 shadow-2xl"
          >
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-3 ml-2">Suggested AI Prompts</h4>
            <ul className="space-y-1">
              {suggestions.map((suggestion, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => {
                      setQuery(suggestion);
                      onSearch(suggestion);
                      setIsFocused(false);
                    }}
                    className="w-full text-left px-3 py-2.5 rounded-xl text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-3"
                  >
                    <Search className="w-4 h-4 text-slate-500" />
                    {suggestion}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
