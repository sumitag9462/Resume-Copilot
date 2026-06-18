// =============================================================
// src/components/voice-interview/InterviewReport.jsx
//
// Post-interview scorecard and evaluation report.
// Shows: Overall score, 10 dimension cards, strengths/weaknesses,
// hiring decision, recommendation, improvement areas,
// collapsible transcript, and action buttons.
// =============================================================

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Trophy, TrendingUp, TrendingDown, Target, ChevronDown, ArrowLeft,
  Award, Brain, MessageCircle, Shield, Lightbulb, Users, Fingerprint,
  Globe, Briefcase, Star, CheckCircle, XCircle, AlertTriangle,
  RotateCcw, LayoutDashboard
} from 'lucide-react'
import GlassCard from '../ui/GlassCard'
import ScoreRing from '../ui/ScoreRing'
import { useVoiceInterview } from '../../context/VoiceInterviewContext'

const dimensionConfig = {
  technical:          { label: 'Technical Skills', icon: Brain, color: '#8B5CF6' },
  communication:      { label: 'Communication', icon: MessageCircle, color: '#3B82F6' },
  confidence:         { label: 'Confidence', icon: Shield, color: '#F59E0B' },
  leadership:         { label: 'Leadership', icon: Users, color: '#EC4899' },
  problemSolving:     { label: 'Problem Solving', icon: Lightbulb, color: '#10B981' },
  behavior:           { label: 'Behavior', icon: Star, color: '#6366F1' },
  cultureFit:         { label: 'Culture Fit', icon: Globe, color: '#14B8A6' },
  resumeAuthenticity: { label: 'Resume Accuracy', icon: Fingerprint, color: '#F97316' },
  domainKnowledge:    { label: 'Domain Knowledge', icon: Briefcase, color: '#8B5CF6' }
}

const hiringColors = {
  'Strong Hire':     { bg: 'bg-emerald-500/15', border: 'border-emerald-500/30', text: 'text-emerald-300', glow: 'shadow-[0_0_30px_rgba(16,185,129,0.15)]' },
  'Hire':            { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400', glow: '' },
  'Lean Hire':       { bg: 'bg-teal-500/10', border: 'border-teal-500/20', text: 'text-teal-400', glow: '' },
  'Lean No Hire':    { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400', glow: '' },
  'No Hire':         { bg: 'bg-rose-500/10', border: 'border-rose-500/20', text: 'text-rose-400', glow: '' },
  'Strong No Hire':  { bg: 'bg-rose-500/15', border: 'border-rose-500/30', text: 'text-rose-300', glow: '' }
}

const InterviewReport = () => {
  const { evaluation, chatHistory, questionCount, elapsedSeconds, companyName, resetInterview } = useVoiceInterview()
  const [showTranscript, setShowTranscript] = useState(false)

  if (!evaluation) return null

  const overallScore = evaluation.overallScore || 0
  const decision = evaluation.hiringDecision || 'Not Evaluated'
  const decisionStyle = hiringColors[decision] || hiringColors['Lean No Hire']

  const formatDuration = (seconds) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}m ${s}s`
  }

  const getScoreColor = (score) => {
    if (score >= 80) return '#10B981'
    if (score >= 60) return '#3B82F6'
    if (score >= 40) return '#F59E0B'
    return '#EF4444'
  }

  const stagger = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.06, delayChildren: 0.1 }
    }
  }

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
  }

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="visible"
      className="w-full max-w-6xl mx-auto pb-12 space-y-6"
    >
      {/* Hero Section */}
      <motion.div variants={fadeUp}>
        <GlassCard className="p-8 md:p-10 relative overflow-hidden">
          {/* Background glow */}
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-violet-500/10 blur-[100px] pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-emerald-500/10 blur-[100px] pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-12">
            {/* Score Ring */}
            <div className="flex-shrink-0">
              <ScoreRing
                score={overallScore}
                size={160}
                label="Overall"
                color={getScoreColor(overallScore)}
              />
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-2">
                <Trophy className="h-4 w-4 text-violet-400" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-400">Interview Report</span>
              </div>

              <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-3">
                Interview Complete
              </h1>

              <div className="flex flex-wrap gap-3 justify-center md:justify-start mb-4">
                <span className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[11px] font-bold text-slate-300">
                  {companyName}
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[11px] font-bold text-slate-300">
                  {questionCount} Questions
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[11px] font-bold text-slate-300">
                  {formatDuration(elapsedSeconds)}
                </span>
              </div>

              {/* Hiring Decision Badge */}
              <div className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl ${decisionStyle.bg} ${decisionStyle.border} border ${decisionStyle.glow}`}>
                <Award className={`h-5 w-5 ${decisionStyle.text}`} />
                <span className={`text-sm font-bold ${decisionStyle.text}`}>{decision}</span>
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Score Grid — 10 Dimensions */}
      <motion.div variants={fadeUp}>
        <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-4 px-1">
          Performance Breakdown
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(dimensionConfig).map(([key, config], i) => {
            const dim = evaluation[key]
            if (!dim) return null
            const score = dim.score || 0
            const Icon = config.icon

            return (
              <motion.div
                key={key}
                variants={fadeUp}
              >
                <GlassCard className="p-5 group hover:border-white/10 transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div
                      className="flex-shrink-0 h-10 w-10 rounded-xl flex items-center justify-center border"
                      style={{
                        backgroundColor: `${config.color}15`,
                        borderColor: `${config.color}30`
                      }}
                    >
                      <Icon className="h-5 w-5" style={{ color: config.color }} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[12px] font-bold text-slate-300">{config.label}</span>
                        <span className="text-lg font-bold font-mono" style={{ color: getScoreColor(score) }}>
                          {score}
                        </span>
                      </div>

                      {/* Score Bar */}
                      <div className="h-1.5 w-full rounded-full bg-white/[0.04] overflow-hidden mb-3">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: config.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${score}%` }}
                          transition={{ duration: 1, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                        />
                      </div>

                      {/* Notes */}
                      {dim.notes && (
                        <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-3">
                          {dim.notes}
                        </p>
                      )}
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* Strengths & Weaknesses */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Strengths */}
        <GlassCard className="p-6 border-t-2 border-t-emerald-500/40">
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp className="h-4 w-4 text-emerald-400" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-400">Strengths</span>
          </div>
          <div className="space-y-3">
            {(evaluation.strengths || []).map((s, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-[13px] text-slate-200 leading-relaxed">{s}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Weaknesses */}
        <GlassCard className="p-6 border-t-2 border-t-rose-500/40">
          <div className="flex items-center gap-2 mb-5">
            <TrendingDown className="h-4 w-4 text-rose-400" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-rose-400">Areas for Improvement</span>
          </div>
          <div className="space-y-3">
            {(evaluation.weaknesses || []).map((w, i) => (
              <div key={i} className="flex items-start gap-3">
                <XCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                <span className="text-[13px] text-slate-200 leading-relaxed">{w}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      {/* Recommendation */}
      {evaluation.recommendation && (
        <motion.div variants={fadeUp}>
          <GlassCard className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Target className="h-4 w-4 text-violet-400" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-violet-400">AI Recommendation</span>
            </div>
            <p className="text-[14px] text-slate-200 leading-relaxed">
              {evaluation.recommendation}
            </p>
          </GlassCard>
        </motion.div>
      )}

      {/* Improvement Areas */}
      {evaluation.improvementAreas?.length > 0 && (
        <motion.div variants={fadeUp}>
          <GlassCard className="p-6">
            <div className="flex items-center gap-2 mb-5">
              <AlertTriangle className="h-4 w-4 text-amber-400" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-400">Action Items</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {evaluation.improvementAreas.map((area, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/20 text-[10px] font-bold text-amber-400 shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-[12px] text-slate-300 leading-relaxed">{area}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* Collapsible Transcript */}
      <motion.div variants={fadeUp}>
        <GlassCard className="overflow-hidden">
          <button
            onClick={() => setShowTranscript(!showTranscript)}
            className="w-full p-6 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors"
          >
            <div className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-slate-400" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">Full Transcript</span>
              <span className="text-[10px] text-slate-600 ml-2">({chatHistory.length} messages)</span>
            </div>
            <ChevronDown className={`h-4 w-4 text-slate-500 transition-transform duration-300 ${showTranscript ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {showTranscript && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="border-t border-white/[0.04]"
              >
                <div className="p-6 space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar">
                  {chatHistory.map((msg, i) => (
                    <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-[13px] leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-cyan-500/10 border border-cyan-500/15 text-cyan-100'
                          : 'bg-white/[0.03] border border-white/[0.06] text-slate-200'
                      }`}>
                        <span className={`text-[9px] font-bold uppercase tracking-[0.2em] block mb-1.5 ${
                          msg.role === 'user' ? 'text-cyan-500/60' : 'text-violet-500/60'
                        }`}>
                          {msg.role === 'user' ? 'You' : 'Interviewer'}
                        </span>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </GlassCard>
      </motion.div>

      {/* Action Buttons */}
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={resetInterview}
          className="flex-1 flex items-center justify-center gap-2 h-14 rounded-2xl bg-gradient-to-r from-violet-600 via-purple-500 to-fuchsia-500 text-white font-bold text-sm shadow-[0_0_30px_rgba(139,92,246,0.3)] hover:shadow-[0_0_50px_rgba(139,92,246,0.5)] transition-all"
        >
          <RotateCcw className="h-4 w-4" />
          New Interview
        </button>
        <a
          href="/dashboard"
          className="flex-1 flex items-center justify-center gap-2 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.06] text-slate-300 font-bold text-sm hover:bg-white/[0.08] hover:text-white transition-all"
        >
          <LayoutDashboard className="h-4 w-4" />
          Back to Dashboard
        </a>
      </motion.div>
    </motion.div>
  )
}

export default InterviewReport
