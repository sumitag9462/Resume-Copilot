// =============================================================
// src/components/voice-interview/AIOrb.jsx — ANIMATED AI ORB
//
// Central animated orb that visually represents the AI state:
//   idle      → Gentle pulse, dim glow
//   listening → Expanding ripple rings, blue/teal glow
//   thinking  → Rotating gradient, amber glow
//   speaking  → Waveform bars, violet glow
//   complete  → Checkmark, green glow
// =============================================================

import { motion, AnimatePresence } from 'framer-motion'
import { Mic, Loader2, Volume2, CheckCircle2, Sparkles } from 'lucide-react'

const orbStyles = {
  idle: {
    gradient: 'from-slate-700/50 via-slate-600/30 to-slate-700/50',
    glow: '0 0 60px rgba(100, 116, 139, 0.15)',
    ringColor: 'rgba(100, 116, 139, 0.1)',
    icon: <Sparkles className="h-8 w-8 text-slate-400" />,
    label: 'Ready'
  },
  listening: {
    gradient: 'from-cyan-500/40 via-blue-500/30 to-teal-500/40',
    glow: '0 0 80px rgba(6, 182, 212, 0.3), 0 0 120px rgba(59, 130, 246, 0.15)',
    ringColor: 'rgba(6, 182, 212, 0.2)',
    icon: <Mic className="h-8 w-8 text-cyan-300" />,
    label: 'Listening...'
  },
  thinking: {
    gradient: 'from-amber-500/40 via-orange-500/30 to-yellow-500/40',
    glow: '0 0 80px rgba(245, 158, 11, 0.3), 0 0 120px rgba(249, 115, 22, 0.15)',
    ringColor: 'rgba(245, 158, 11, 0.2)',
    icon: <Loader2 className="h-8 w-8 text-amber-300 animate-spin" />,
    label: 'Thinking...'
  },
  speaking: {
    gradient: 'from-violet-500/40 via-purple-500/30 to-fuchsia-500/40',
    glow: '0 0 80px rgba(139, 92, 246, 0.35), 0 0 120px rgba(168, 85, 247, 0.15)',
    ringColor: 'rgba(139, 92, 246, 0.2)',
    icon: <Volume2 className="h-8 w-8 text-violet-300" />,
    label: 'Speaking...'
  },
  complete: {
    gradient: 'from-emerald-500/40 via-green-500/30 to-teal-500/40',
    glow: '0 0 80px rgba(16, 185, 129, 0.35), 0 0 120px rgba(52, 211, 153, 0.15)',
    ringColor: 'rgba(16, 185, 129, 0.2)',
    icon: <CheckCircle2 className="h-8 w-8 text-emerald-300" />,
    label: 'Complete'
  }
}

const AIOrb = ({ state = 'idle' }) => {
  const style = orbStyles[state] || orbStyles.idle

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      {/* Orb Container */}
      <div className="relative flex items-center justify-center">

        {/* Outer Ripple Rings */}
        {(state === 'listening' || state === 'speaking') && (
          <>
            {[0, 1, 2].map(i => (
              <motion.div
                key={`ring-${i}`}
                className="absolute inset-0 rounded-full border"
                style={{ borderColor: style.ringColor }}
                initial={{ scale: 1, opacity: 0.6 }}
                animate={{
                  scale: [1, 1.8 + i * 0.3],
                  opacity: [0.5, 0]
                }}
                transition={{
                  duration: 2 + i * 0.3,
                  repeat: Infinity,
                  delay: i * 0.5,
                  ease: 'easeOut'
                }}
              />
            ))}
          </>
        )}

        {/* Rotating Glow Ring (thinking) */}
        {state === 'thinking' && (
          <motion.div
            className="absolute inset-[-8px] rounded-full"
            style={{
              background: 'conic-gradient(from 0deg, transparent 0%, rgba(245,158,11,0.3) 25%, transparent 50%, rgba(249,115,22,0.3) 75%, transparent 100%)'
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          />
        )}

        {/* Main Orb */}
        <motion.div
          className={`relative z-10 flex h-36 w-36 items-center justify-center rounded-full bg-gradient-to-br ${style.gradient} backdrop-blur-xl border border-white/10`}
          style={{ boxShadow: style.glow }}
          animate={
            state === 'idle'
              ? { scale: [1, 1.03, 1] }
              : state === 'listening'
              ? { scale: [1, 1.06, 1] }
              : state === 'speaking'
              ? { scale: [1, 1.04, 0.98, 1.02, 1] }
              : {}
          }
          transition={
            state === 'idle'
              ? { duration: 3, repeat: Infinity, ease: 'easeInOut' }
              : state === 'listening'
              ? { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }
              : state === 'speaking'
              ? { duration: 0.8, repeat: Infinity, ease: 'easeInOut' }
              : {}
          }
        >
          {/* Inner glass effect */}
          <div className="absolute inset-2 rounded-full bg-gradient-to-b from-white/[0.08] to-transparent" />

          {/* Waveform bars (speaking state) */}
          {state === 'speaking' && (
            <div className="absolute inset-0 flex items-center justify-center gap-1">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={`bar-${i}`}
                  className="w-1 rounded-full bg-violet-400/30"
                  animate={{
                    height: [8, 20 + Math.random() * 20, 8]
                  }}
                  transition={{
                    duration: 0.5 + Math.random() * 0.3,
                    repeat: Infinity,
                    delay: i * 0.1,
                    ease: 'easeInOut'
                  }}
                />
              ))}
            </div>
          )}

          {/* Center Icon */}
          <AnimatePresence mode="wait">
            <motion.div
              key={state}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10"
            >
              {style.icon}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* State Label */}
      <AnimatePresence mode="wait">
        <motion.span
          key={state}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="text-[11px] font-bold uppercase tracking-[0.25em] text-slate-500"
        >
          {style.label}
        </motion.span>
      </AnimatePresence>
    </div>
  )
}

export default AIOrb
