// =============================================================
// src/components/voice-interview/ScorePanel.jsx
//
// Analytics sidebar during the interview — Bloomberg Terminal
// meets Apple aesthetic. Shows question count, timer, progress
// indicators, and interview phase. Actual scores are HIDDEN
// until the interview ends.
// =============================================================

import { motion } from 'framer-motion'
import { Hash, Clock, Activity, TrendingUp, BarChart3, Signal } from 'lucide-react'
import GlassCard from '../ui/GlassCard'

const ScorePanel = ({ questionCount = 0, elapsedSeconds = 0, interviewState = 'idle', companyName = '' }) => {
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0')
    const s = (seconds % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  // Progress estimation (typical interview: 10-15 questions, ~20-30 min)
  const estimatedProgress = Math.min(100, Math.round((questionCount / 12) * 100))

  const stateColors = {
    idle: { bg: 'bg-slate-500/10', text: 'text-slate-400', dot: 'bg-slate-400' },
    listening: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', dot: 'bg-cyan-400' },
    thinking: { bg: 'bg-amber-500/10', text: 'text-amber-400', dot: 'bg-amber-400' },
    speaking: { bg: 'bg-violet-500/10', text: 'text-violet-400', dot: 'bg-violet-400' },
    complete: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', dot: 'bg-emerald-400' }
  }

  const stateStyle = stateColors[interviewState] || stateColors.idle

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Company Badge */}
      <GlassCard className="p-4">
        <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-slate-600 block mb-2">Interview For</span>
        <p className="text-sm font-bold text-white truncate">{companyName || 'Company'}</p>
      </GlassCard>

      {/* Status Indicator */}
      <GlassCard className="p-4">
        <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-slate-600 block mb-3">Status</span>
        <div className={`flex items-center gap-2.5 px-3 py-2 rounded-xl ${stateStyle.bg}`}>
          <div className={`h-2 w-2 rounded-full ${stateStyle.dot} ${interviewState !== 'idle' && interviewState !== 'complete' ? 'animate-pulse' : ''}`} />
          <span className={`text-[11px] font-bold uppercase tracking-[0.15em] ${stateStyle.text}`}>
            {interviewState === 'idle' ? 'Ready' :
             interviewState === 'listening' ? 'Listening' :
             interviewState === 'thinking' ? 'Processing' :
             interviewState === 'speaking' ? 'Speaking' :
             'Complete'}
          </span>
        </div>
      </GlassCard>

      {/* Stats Grid */}
      <GlassCard className="p-4 space-y-4">
        <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-slate-600 block">Metrics</span>

        {/* Question Count */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
              <Hash className="h-3.5 w-3.5 text-violet-400" />
            </div>
            <span className="text-[11px] text-slate-400 font-medium">Questions</span>
          </div>
          <span className="text-lg font-bold text-white font-mono">{questionCount}</span>
        </div>

        {/* Timer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <Clock className="h-3.5 w-3.5 text-blue-400" />
            </div>
            <span className="text-[11px] text-slate-400 font-medium">Duration</span>
          </div>
          <span className="text-lg font-bold text-white font-mono">{formatTime(elapsedSeconds)}</span>
        </div>

        {/* Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
              </div>
              <span className="text-[11px] text-slate-400 font-medium">Progress</span>
            </div>
            <span className="text-[11px] font-bold text-emerald-400">{estimatedProgress}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-white/[0.04] overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
              initial={{ width: 0 }}
              animate={{ width: `${estimatedProgress}%` }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        </div>
      </GlassCard>

      {/* AI Analysis Indicator */}
      <GlassCard className="p-4">
        <div className="flex items-center gap-2.5 mb-3">
          <Activity className="h-3.5 w-3.5 text-violet-400" />
          <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-slate-600">AI Analysis</span>
        </div>

        {/* Fake analysis bars that animate subtly */}
        <div className="space-y-2.5">
          {[
            { label: 'Technical', width: Math.min(95, 30 + questionCount * 8), color: 'from-violet-500 to-purple-500' },
            { label: 'Behavioral', width: Math.min(90, 20 + questionCount * 7), color: 'from-blue-500 to-cyan-500' },
            { label: 'Confidence', width: Math.min(85, 40 + questionCount * 5), color: 'from-emerald-500 to-teal-500' },
            { label: 'Communication', width: Math.min(92, 35 + questionCount * 6), color: 'from-amber-500 to-orange-500' }
          ].map((bar, i) => (
            <div key={i}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-slate-500 font-medium">{bar.label}</span>
                <Signal className="h-2.5 w-2.5 text-slate-600" />
              </div>
              <div className="h-1 w-full rounded-full bg-white/[0.04] overflow-hidden">
                <motion.div
                  className={`h-full rounded-full bg-gradient-to-r ${bar.color} opacity-40`}
                  initial={{ width: '10%' }}
                  animate={{ width: `${bar.width}%` }}
                  transition={{ duration: 1.5, delay: i * 0.2, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
            </div>
          ))}
        </div>

        <p className="text-[9px] text-slate-600 mt-3 italic text-center">
          Detailed scores revealed after interview
        </p>
      </GlassCard>
    </div>
  )
}

export default ScorePanel
