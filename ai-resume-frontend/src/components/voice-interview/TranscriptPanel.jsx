// =============================================================
// src/components/voice-interview/TranscriptPanel.jsx
//
// Scrollable chat transcript panel for the voice interview.
// AI messages left-aligned (violet), user messages right-aligned
// (teal). Auto-scrolls on new messages. Shows interim transcript
// as faded italic text. Glass panel with backdrop blur.
// =============================================================

import { useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, User } from 'lucide-react'
import GlassCard from '../ui/GlassCard'

const TranscriptPanel = ({ chatHistory = [], interimTranscript = '' }) => {
  const scrollRef = useRef(null)

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      })
    }
  }, [chatHistory.length, interimTranscript])

  const formatTime = (timestamp) => {
    if (!timestamp) return ''
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <GlassCard className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-2 px-5 py-4 border-b border-white/[0.04]">
        <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">Live Transcript</span>
        <span className="ml-auto text-[10px] text-slate-600">{chatHistory.length} messages</span>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar"
      >
        {chatHistory.length === 0 && !interimTranscript && (
          <div className="flex items-center justify-center h-full text-center">
            <p className="text-sm text-slate-600 italic">Waiting for interview to begin...</p>
          </div>
        )}

        <AnimatePresence initial={false}>
          {chatHistory.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'model' && (
                <div className="flex-shrink-0 mt-1">
                  <div className="h-7 w-7 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                    <Bot className="h-3.5 w-3.5 text-violet-400" />
                  </div>
                </div>
              )}

              <div className={`max-w-[80%] ${msg.role === 'user' ? 'order-first' : ''}`}>
                <div
                  className={`rounded-2xl px-4 py-3 text-[13px] leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-cyan-500/10 border border-cyan-500/15 text-cyan-100 rounded-br-md'
                      : 'bg-white/[0.03] border border-white/[0.06] text-slate-200 rounded-bl-md'
                  }`}
                >
                  {msg.content}
                </div>
                <p className={`text-[9px] text-slate-600 mt-1.5 px-1 ${msg.role === 'user' ? 'text-right' : ''}`}>
                  {msg.role === 'user' ? 'You' : 'AI Interviewer'} · {formatTime(msg.timestamp)}
                </p>
              </div>

              {msg.role === 'user' && (
                <div className="flex-shrink-0 mt-1">
                  <div className="h-7 w-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                    <User className="h-3.5 w-3.5 text-cyan-400" />
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Interim Transcript */}
        {interimTranscript && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3 justify-end"
          >
            <div className="max-w-[80%]">
              <div className="rounded-2xl rounded-br-md px-4 py-3 text-[13px] leading-relaxed bg-cyan-500/5 border border-cyan-500/10 text-cyan-200/50 italic border-dashed">
                {interimTranscript}
                <span className="inline-block w-1 h-4 bg-cyan-400/50 ml-1 animate-pulse" />
              </div>
            </div>
            <div className="flex-shrink-0 mt-1">
              <div className="h-7 w-7 rounded-lg bg-cyan-500/5 border border-cyan-500/10 flex items-center justify-center opacity-50">
                <User className="h-3.5 w-3.5 text-cyan-400" />
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </GlassCard>
  )
}

export default TranscriptPanel
