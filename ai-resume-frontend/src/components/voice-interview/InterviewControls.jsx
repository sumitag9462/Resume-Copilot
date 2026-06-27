// =============================================================
// src/components/voice-interview/InterviewControls.jsx
//
// Bottom control bar for the voice interview.
// Controls: Mic toggle, Mute, Repeat question, End interview.
// Keyboard shortcuts: Space (mic), M (mute), Escape (end).
// =============================================================

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mic, MicOff, Volume2, VolumeX, RotateCcw, Square, Keyboard, X
} from 'lucide-react'
import GlassCard from '../ui/GlassCard'

const InterviewControls = ({
  isListening,
  isSpeaking,
  isMuted,
  isLoading,
  interviewState,
  onMicToggle,
  onMuteToggle,
  onRepeatQuestion,
  onEndInterview
}) => {
  const [showEndConfirm, setShowEndConfirm] = useState(false)
  const [showShortcuts, setShowShortcuts] = useState(false)

  // Keyboard shortcuts
  const handleKeyDown = useCallback((e) => {
    // Don't capture if user is in an input/textarea
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return

    switch (e.code) {
      case 'Space':
        e.preventDefault()
        if (!isLoading && interviewState !== 'thinking') onMicToggle()
        break
      case 'KeyM':
        e.preventDefault()
        onMuteToggle()
        break
      case 'KeyR':
        e.preventDefault()
        if (!isLoading) onRepeatQuestion()
        break
      case 'Escape':
        e.preventDefault()
        if (showEndConfirm) setShowEndConfirm(false)
        else setShowEndConfirm(true)
        break
      default:
        break
    }
  }, [isLoading, interviewState, onMicToggle, onMuteToggle, onRepeatQuestion, showEndConfirm])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  const controlBtnClass = (active, color = 'white') =>
    `relative flex items-center justify-center h-14 w-14 rounded-2xl border transition-all duration-300 ${
      active
        ? color === 'red'
          ? 'bg-rose-500/20 border-rose-500/30 text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.2)]'
          : 'bg-violet-500/20 border-violet-500/30 text-violet-300 shadow-[0_0_20px_rgba(139,92,246,0.2)]'
        : 'bg-white/[0.04] border-white/[0.06] text-slate-400 hover:bg-white/[0.08] hover:text-white hover:border-white/[0.12]'
    }`

  return (
    <>
      <GlassCard className="px-6 py-4 rounded-3xl backdrop-blur-2xl shadow-[0_-8px_32px_rgba(0,0,0,0.3)]">
        <div className="flex items-center justify-center gap-3 md:gap-4">
          {/* Mic Toggle */}
          <div className="relative group">
            <motion.button
              onClick={onMicToggle}
              disabled={isLoading || interviewState === 'thinking'}
              className={controlBtnClass(isListening)}
              whileTap={{ scale: 0.92 }}
              title="Toggle Microphone (Space)"
            >
              {isListening ? (
                <>
                  <Mic className="h-5 w-5 relative z-10" />
                  <motion.div
                    className="absolute inset-0 rounded-2xl border-2 border-violet-400/30"
                    animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                </>
              ) : (
                <MicOff className="h-5 w-5" />
              )}
            </motion.button>
            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[8px] font-bold uppercase tracking-[0.2em] text-slate-600 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
              Space
            </span>
          </div>

          {/* Mute Toggle */}
          <div className="relative group">
            <motion.button
              onClick={onMuteToggle}
              className={controlBtnClass(isMuted, 'red')}
              whileTap={{ scale: 0.92 }}
              title="Mute AI Voice (M)"
            >
              {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </motion.button>
            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[8px] font-bold uppercase tracking-[0.2em] text-slate-600 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
              M
            </span>
          </div>

          {/* Repeat Question */}
          <div className="relative group">
            <motion.button
              onClick={onRepeatQuestion}
              disabled={isLoading}
              className={controlBtnClass(false)}
              whileTap={{ scale: 0.92 }}
              title="Repeat Last Question (R)"
            >
              <RotateCcw className="h-5 w-5" />
            </motion.button>
            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[8px] font-bold uppercase tracking-[0.2em] text-slate-600 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
              R
            </span>
          </div>

          {/* Divider */}
          <div className="h-8 w-px bg-white/[0.06] mx-1" />

          {/* Keyboard Shortcuts */}
          <div className="relative group">
            <motion.button
              onClick={() => setShowShortcuts(!showShortcuts)}
              className={controlBtnClass(showShortcuts)}
              whileTap={{ scale: 0.92 }}
              title="Keyboard Shortcuts"
            >
              <Keyboard className="h-5 w-5" />
            </motion.button>
          </div>

          {/* Divider */}
          <div className="h-8 w-px bg-white/[0.06] mx-1" />

          {/* End Interview */}
          <div className="relative group">
            <motion.button
              onClick={() => setShowEndConfirm(true)}
              className="flex items-center gap-2 h-14 px-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 hover:border-rose-500/30 hover:shadow-[0_0_20px_rgba(244,63,94,0.15)] transition-all duration-300"
              whileTap={{ scale: 0.95 }}
              title="End Interview (Esc)"
            >
              <Square className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline">End</span>
            </motion.button>
            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[8px] font-bold uppercase tracking-[0.2em] text-slate-600 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
              Esc
            </span>
          </div>
        </div>
      </GlassCard>

      {/* End Interview Confirmation Modal */}
      <AnimatePresence>
        {showEndConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setShowEndConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-3xl bg-[#161820] border border-white/[0.08] p-8 max-w-md w-full shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-display font-bold text-white">End Interview?</h3>
                <button
                  onClick={() => setShowEndConfirm(false)}
                  className="p-2 rounded-xl text-slate-500 hover:text-white hover:bg-white/[0.06] transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <p className="text-sm text-slate-400 mb-8 leading-relaxed">
                The AI will evaluate your performance and generate a detailed scorecard.
                This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowEndConfirm(false)}
                  className="flex-1 h-12 rounded-2xl border border-white/10 bg-white/[0.04] text-sm font-bold text-slate-300 hover:bg-white/[0.08] transition-colors"
                >
                  Continue Interview
                </button>
                <button
                  onClick={() => {
                    setShowEndConfirm(false)
                    onEndInterview()
                  }}
                  className="flex-1 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/30 text-sm font-bold text-rose-300 hover:bg-rose-500/30 transition-colors"
                >
                  End & Evaluate
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Keyboard Shortcuts Panel */}
      <AnimatePresence>
        {showShortcuts && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="fixed bottom-28 left-1/2 -translate-x-1/2 z-50 rounded-2xl bg-[#161820] border border-white/[0.08] p-5 shadow-2xl min-w-[280px]"
          >
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-4">Keyboard Shortcuts</h4>
            <div className="space-y-3">
              {[
                { key: 'Space', action: 'Toggle microphone' },
                { key: 'M', action: 'Mute/unmute AI voice' },
                { key: 'R', action: 'Repeat last question' },
                { key: 'Esc', action: 'End interview' }
              ].map(({ key, action }) => (
                <div key={key} className="flex items-center justify-between gap-4">
                  <span className="text-[12px] text-slate-400">{action}</span>
                  <kbd className="px-2.5 py-1 rounded-lg bg-white/[0.06] border border-white/[0.08] text-[10px] font-bold text-slate-300 font-mono">
                    {key}
                  </kbd>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default InterviewControls
