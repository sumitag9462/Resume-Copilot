// src/components/copilot/InputComposer.jsx
// The premium floating input bar.
// Features: slash commands, voice input, file upload, auto-grow textarea.

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, Square, Mic, MicOff, Paperclip, Command,
  Wand2, FileText, Target, Mail, Briefcase, DollarSign,
  Map, Linkedin, GitBranch, BookOpen
} from 'lucide-react';

const SLASH_MENU = [
  { cmd: '/resume',    icon: FileText,  desc: 'Full resume review & ATS audit' },
  { cmd: '/ats',       icon: Target,    desc: 'ATS compatibility analysis' },
  { cmd: '/jd',        icon: Briefcase, desc: 'Job description breakdown' },
  { cmd: '/interview', icon: Wand2,     desc: 'Interview prep questions' },
  { cmd: '/mock',      icon: Mic,       desc: 'Start a mock interview' },
  { cmd: '/cover',     icon: Mail,      desc: 'Generate cover letter' },
  { cmd: '/outreach',  icon: Mail,      desc: 'Networking messages & cold emails' },
  { cmd: '/salary',    icon: DollarSign,desc: 'Salary range & negotiation tips' },
  { cmd: '/linkedin',  icon: Linkedin,  desc: 'LinkedIn profile optimization' },
  { cmd: '/roadmap',   icon: Map,       desc: 'Career growth roadmap' },
];

export default function InputComposer({ onSend, onStop, isStreaming, disabled }) {
  const [value, setValue] = useState('');
  const [slashMenu, setSlashMenu] = useState([]);
  const [slashIndex, setSlashIndex] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const textareaRef = useRef(null);
  const recognitionRef = useRef(null);

  // Auto-grow textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 200) + 'px';
  }, [value]);

  // Slash command detection
  const handleChange = (e) => {
    const val = e.target.value;
    setValue(val);
    const lastWord = val.split('\n').pop();
    if (lastWord.startsWith('/') && lastWord.length >= 1) {
      const query = lastWord.slice(1).toLowerCase();
      const filtered = SLASH_MENU.filter(
        (s) => s.cmd.slice(1).startsWith(query) || s.desc.toLowerCase().includes(query)
      );
      setSlashMenu(filtered);
      setSlashIndex(0);
    } else {
      setSlashMenu([]);
    }
  };

  const applySlash = (item) => {
    const lines = value.split('\n');
    lines[lines.length - 1] = item.cmd + ' ';
    setValue(lines.join('\n'));
    setSlashMenu([]);
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (slashMenu.length > 0) {
      if (e.key === 'ArrowDown') { e.preventDefault(); setSlashIndex((i) => Math.min(i + 1, slashMenu.length - 1)); return; }
      if (e.key === 'ArrowUp')   { e.preventDefault(); setSlashIndex((i) => Math.max(i - 1, 0)); return; }
      if (e.key === 'Enter' || e.key === 'Tab') { e.preventDefault(); applySlash(slashMenu[slashIndex]); return; }
      if (e.key === 'Escape')    { setSlashMenu([]); return; }
    }
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || isStreaming || disabled) return;
    onSend(trimmed);
    setValue('');
    setSlashMenu([]);
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  // Voice input
  const toggleVoice = useCallback(() => {
    if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      alert('Voice input is not supported in this browser. Try Chrome.');
      return;
    }
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }
    const SRClass = window.SpeechRecognition || window.webkitSpeechRecognition;
    const sr = new SRClass();
    sr.continuous = false;
    sr.interimResults = true;
    sr.lang = 'en-US';
    sr.onresult = (ev) => {
      const transcript = Array.from(ev.results).map((r) => r[0].transcript).join('');
      setValue(transcript);
    };
    sr.onend = () => setIsListening(false);
    sr.onerror = () => setIsListening(false);
    recognitionRef.current = sr;
    sr.start();
    setIsListening(true);
  }, [isListening]);

  const canSend = value.trim().length > 0 && !isStreaming && !disabled;

  return (
    <div className="relative px-4 pb-4 pt-2">
      {/* Slash command dropdown */}
      <AnimatePresence>
        {slashMenu.length > 0 && (
          <motion.div
            className="absolute bottom-full left-4 right-4 mb-2 rounded-2xl overflow-hidden z-50"
            style={{
              background: 'rgba(17,19,24,0.95)',
              border: '1px solid rgba(255,255,255,0.09)',
              backdropFilter: 'blur(24px)',
              boxShadow: '0 -8px 32px rgba(0,0,0,0.4)',
            }}
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.15 }}
          >
            <div className="px-3 py-2 border-b border-white/[0.06] flex items-center gap-1.5">
              <Command className="w-3 h-3 text-text-muted" />
              <span className="text-xs text-text-muted">Slash Commands</span>
            </div>
            {slashMenu.map((item, i) => (
              <button
                key={item.cmd}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors duration-100 ${
                  i === slashIndex ? 'bg-accent-violet/10' : 'hover:bg-white/[0.04]'
                }`}
                onMouseDown={(e) => { e.preventDefault(); applySlash(item); }}
                onMouseEnter={() => setSlashIndex(i)}
              >
                <item.icon className="w-4 h-4 text-accent-violet shrink-0" strokeWidth={1.8} />
                <div>
                  <p className="text-sm font-medium text-text-primary">{item.cmd}</p>
                  <p className="text-xs text-text-muted">{item.desc}</p>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main composer glass surface */}
      <div
        className="relative flex items-end gap-2 rounded-2xl px-3 pt-3 pb-2"
        style={{
          background: 'rgba(17,19,24,0.8)',
          border: '1px solid rgba(255,255,255,0.09)',
          backdropFilter: 'blur(24px)',
          boxShadow: '0 0 0 1px rgba(255,255,255,0.03), 0 8px 32px rgba(0,0,0,0.3)',
          transition: 'border-color 0.2s, box-shadow 0.2s',
        }}
        onFocusCapture={(e) => {
          e.currentTarget.style.borderColor = 'rgba(124,92,252,0.35)';
          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(124,92,252,0.08), 0 8px 32px rgba(0,0,0,0.3)';
        }}
        onBlurCapture={(e) => {
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)';
          e.currentTarget.style.boxShadow = '0 0 0 1px rgba(255,255,255,0.03), 0 8px 32px rgba(0,0,0,0.3)';
        }}
      >
        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={isListening ? '🎙️ Listening...' : 'Ask anything about your career... (type / for commands)'}
          disabled={disabled && !isStreaming}
          rows={1}
          className="flex-1 resize-none bg-transparent text-sm text-text-primary placeholder:text-text-muted
                     outline-none leading-relaxed py-1 max-h-[200px] overflow-y-auto
                     disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ scrollbarWidth: 'none' }}
        />

        {/* Action buttons */}
        <div className="flex items-center gap-1 pb-0.5 shrink-0">
          {/* Voice button */}
          <motion.button
            onClick={toggleVoice}
            className={`p-1.5 rounded-lg transition-all duration-200 ${
              isListening
                ? 'bg-red-500/20 text-red-400'
                : 'text-text-muted hover:text-text-secondary hover:bg-white/[0.06]'
            }`}
            whileTap={{ scale: 0.92 }}
            title="Voice input"
          >
            {isListening
              ? <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.8 }}>
                  <MicOff className="w-4 h-4" />
                </motion.div>
              : <Mic className="w-4 h-4" />
            }
          </motion.button>

          {/* Stop or Send */}
          {isStreaming ? (
            <motion.button
              onClick={onStop}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.07] hover:bg-white/[0.12]
                         text-text-secondary text-xs font-medium transition-all duration-200"
              whileTap={{ scale: 0.95 }}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <Square className="w-3 h-3" />
              Stop
            </motion.button>
          ) : (
            <motion.button
              onClick={handleSend}
              disabled={!canSend}
              className="p-1.5 rounded-xl transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
              style={canSend ? {
                background: 'linear-gradient(135deg, #7C5CFC, #5B8FFF)',
                boxShadow: '0 2px 12px rgba(124,92,252,0.35)',
              } : { background: 'rgba(255,255,255,0.07)' }}
              whileTap={canSend ? { scale: 0.92 } : {}}
              title="Send message (Enter)"
            >
              <Send className="w-4 h-4 text-white" />
            </motion.button>
          )}
        </div>
      </div>

      {/* Hint text */}
      <p className="text-center text-xs text-text-muted mt-2 opacity-60">
        Press <kbd className="px-1 py-0.5 rounded bg-white/[0.06] font-mono text-[10px]">Enter</kbd> to send
        · <kbd className="px-1 py-0.5 rounded bg-white/[0.06] font-mono text-[10px]">Shift+Enter</kbd> for new line
        · Type <span className="text-accent-violet-light">/</span> for commands
      </p>
    </div>
  );
}
