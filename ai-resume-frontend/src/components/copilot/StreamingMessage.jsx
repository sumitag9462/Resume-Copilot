// src/components/copilot/StreamingMessage.jsx
// Renders a single AI or user message as a glass card.
// AI messages support streaming text + structured markdown rendering.
// Hover reveals action buttons: Copy, Bookmark, Regenerate, Speak, Like, Dislike.

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Copy, Bookmark, RefreshCw, Volume2, ThumbsUp, ThumbsDown,
  Check, User, Sparkles
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

// Simple markdown component map for premium rendering
const markdownComponents = {
  h1: ({ children }) => <h1 className="text-xl font-bold text-text-primary mt-4 mb-2">{children}</h1>,
  h2: ({ children }) => <h2 className="text-lg font-semibold text-text-primary mt-3 mb-1.5">{children}</h2>,
  h3: ({ children }) => <h3 className="text-base font-semibold text-text-primary mt-2 mb-1">{children}</h3>,
  p:  ({ children }) => <p className="text-text-secondary leading-relaxed mb-2 last:mb-0">{children}</p>,
  ul: ({ children }) => <ul className="space-y-1 mb-2 pl-1">{children}</ul>,
  ol: ({ children }) => <ol className="space-y-1 mb-2 pl-4 list-decimal">{children}</ol>,
  li: ({ children }) => (
    <li className="flex gap-2 text-text-secondary text-sm leading-relaxed">
      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent-violet shrink-0" />
      <span>{children}</span>
    </li>
  ),
  strong: ({ children }) => <strong className="text-text-primary font-semibold">{children}</strong>,
  em: ({ children }) => <em className="text-text-secondary italic">{children}</em>,
  code: ({ inline, children }) =>
    inline ? (
      <code className="px-1.5 py-0.5 rounded bg-white/[0.07] font-mono text-xs text-accent-violet-light border border-white/[0.06]">
        {children}
      </code>
    ) : (
      <pre className="my-3 p-4 rounded-xl bg-[#0A0B0F] border border-white/[0.07] overflow-x-auto">
        <code className="font-mono text-xs text-green-400">{children}</code>
      </pre>
    ),
  blockquote: ({ children }) => (
    <blockquote className="my-2 pl-3 border-l-2 border-accent-violet/40 text-text-muted italic text-sm">
      {children}
    </blockquote>
  ),
  table: ({ children }) => (
    <div className="overflow-x-auto my-3">
      <table className="w-full text-sm border-collapse">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-white/[0.04]">{children}</thead>,
  th: ({ children }) => <th className="px-3 py-2 text-left text-text-primary font-semibold border-b border-white/[0.07]">{children}</th>,
  td: ({ children }) => <td className="px-3 py-2 text-text-secondary border-b border-white/[0.04]">{children}</td>,
  hr: () => <hr className="my-4 border-white/[0.07]" />,
};

const ActionButton = ({ icon: Icon, label, onClick, active }) => (
  <button
    onClick={onClick}
    title={label}
    className={`p-1.5 rounded-lg transition-all duration-150 ${
      active
        ? 'bg-accent-violet/20 text-accent-violet'
        : 'text-text-muted hover:text-text-secondary hover:bg-white/[0.06]'
    }`}
  >
    <Icon className="w-3.5 h-3.5" />
  </button>
);

export default function StreamingMessage({ message, isStreaming, onRegenerate }) {
  const [hovered, setHovered] = useState(false);
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const isUser = message.role === 'user';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      const utt = new SpeechSynthesisUtterance(message.content);
      utt.rate = 1.0;
      utt.pitch = 1.0;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utt);
    }
  };

  if (isUser) {
    return (
      <motion.div
        className="flex justify-end mb-4"
        initial={{ opacity: 0, x: 20, scale: 0.97 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      >
        <div
          className="max-w-[75%] px-4 py-3 rounded-2xl rounded-tr-sm text-sm text-text-primary leading-relaxed whitespace-pre-wrap"
          style={{
            background: 'linear-gradient(135deg, rgba(124,92,252,0.35), rgba(91,143,255,0.25))',
            border: '1px solid rgba(124,92,252,0.4)',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 4px 24px -4px rgba(124,92,252,0.2)',
          }}
        >
          {message.content}
        </div>
        <div className="ml-2.5 mt-1 w-7 h-7 rounded-full bg-white/[0.07] border border-white/[0.1] flex items-center justify-center shrink-0">
          <User className="w-3.5 h-3.5 text-text-secondary" />
        </div>
      </motion.div>
    );
  }

  // AI message
  return (
    <motion.div
      className="flex items-start gap-2.5 mb-5"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 280, damping: 26 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      {/* AI Avatar */}
      <div
        className="mt-0.5 w-7 h-7 rounded-full flex items-center justify-center shrink-0"
        style={{
          background: 'radial-gradient(circle at 35% 35%, #a78bfa, #7C5CFC)',
          boxShadow: '0 0 12px rgba(124,92,252,0.4)',
        }}
      >
        <Sparkles className="w-3.5 h-3.5 text-white" strokeWidth={2} />
      </div>

      <div className="flex-1 min-w-0">
        {/* Glass message card */}
        <div
          className="relative px-4 py-3.5 rounded-2xl rounded-tl-sm"
          style={{
            background: 'rgba(17,19,24,0.7)',
            border: '1px solid rgba(255,255,255,0.07)',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 4px 24px -4px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)',
          }}
        >
          {/* Streaming cursor */}
          {isStreaming && (
            <motion.span
              className="inline-block w-0.5 h-4 bg-accent-violet ml-0.5 align-middle"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
            />
          )}

          <div className="prose prose-sm max-w-none text-sm">
            {message.content ? (
              <ReactMarkdown components={markdownComponents}>
                {message.content}
              </ReactMarkdown>
            ) : isStreaming ? null : (
              <p className="text-text-muted italic">Empty response.</p>
            )}
          </div>
        </div>

        {/* Action buttons — appear on hover */}
        <AnimatePresence>
          {hovered && !isStreaming && (
            <motion.div
              className="flex items-center gap-0.5 mt-1.5 ml-1"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
            >
              <ActionButton icon={copied ? Check : Copy} label="Copy" onClick={handleCopy} active={copied} />
              <ActionButton icon={Bookmark} label="Bookmark" onClick={() => setBookmarked(!bookmarked)} active={bookmarked} />
              <ActionButton icon={RefreshCw} label="Regenerate" onClick={onRegenerate} />
              <ActionButton icon={Volume2} label="Speak" onClick={handleSpeak} />
              <div className="w-px h-3.5 bg-white/[0.08] mx-0.5" />
              <ActionButton icon={ThumbsUp} label="Good response" onClick={() => { setLiked(!liked); setDisliked(false); }} active={liked} />
              <ActionButton icon={ThumbsDown} label="Bad response" onClick={() => { setDisliked(!disliked); setLiked(false); }} active={disliked} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
