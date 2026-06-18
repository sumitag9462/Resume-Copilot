// src/components/copilot/MessageList.jsx
// Auto-scrolling, virtualized-ready message canvas.
// Renders all messages and shows a typing indicator while AI streams.

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import StreamingMessage from './StreamingMessage';
import EmptyState from './EmptyState';

const TypingDots = () => (
  <div className="flex items-start gap-2.5 mb-5">
    <div
      className="mt-0.5 w-7 h-7 rounded-full flex items-center justify-center shrink-0"
      style={{
        background: 'radial-gradient(circle at 35% 35%, #a78bfa, #7C5CFC)',
        boxShadow: '0 0 12px rgba(124,92,252,0.4)',
      }}
    >
      <span className="text-white text-xs">✦</span>
    </div>
    <div
      className="flex items-center gap-1.5 px-4 py-3.5 rounded-2xl rounded-tl-sm"
      style={{
        background: 'rgba(17,19,24,0.7)',
        border: '1px solid rgba(255,255,255,0.07)',
        backdropFilter: 'blur(16px)',
      }}
    >
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-accent-violet"
          animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 1, delay: i * 0.15 }}
        />
      ))}
    </div>
  </div>
);

export default function MessageList({ messages, isStreaming, streamingContent, onPrompt, onRegenerate }) {
  const bottomRef = useRef(null);

  // Auto-scroll to bottom on new content
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent]);

  if (messages.length === 0 && !isStreaming) {
    return <EmptyState onPrompt={onPrompt} />;
  }

  // Build the display list: real messages + the currently streaming one
  const displayMessages = [...messages];
  if (isStreaming && streamingContent !== null) {
    displayMessages.push({ role: 'assistant', content: streamingContent, id: 'streaming' });
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-0 scroll-smooth">
      <div className="max-w-3xl mx-auto">
        {displayMessages.map((msg, i) => (
          <StreamingMessage
            key={msg.id || i}
            message={msg}
            isStreaming={isStreaming && i === displayMessages.length - 1 && msg.role === 'assistant'}
            onRegenerate={() => onRegenerate(i)}
          />
        ))}
        {/* Show dots only before any streaming content has arrived */}
        {isStreaming && streamingContent === '' && <TypingDots />}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
