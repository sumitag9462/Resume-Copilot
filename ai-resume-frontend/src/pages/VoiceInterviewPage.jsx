// =============================================================
// src/pages/VoiceInterviewPage.jsx — AI VOICE INTERVIEW PAGE
//
// Single page with 3 internal phases:
//   setup        → InterviewSetup (collect resume, JD, company)
//   interviewing → InterviewOSLayout (voice conversation)
//   report       → InterviewReport (evaluation scorecard)
//
// Wrapped in VoiceInterviewProvider for state management.
// =============================================================

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { VoiceInterviewProvider, useVoiceInterview } from '../context/VoiceInterviewContext'
import InterviewSetup from '../components/voice-interview/InterviewSetup'
import InterviewOSLayout from '../components/voice-interview/InterviewOSLayout'
import InterviewReport from '../components/voice-interview/InterviewReport'

const VoiceInterviewPageContent = () => {
  const { phase, resetInterview } = useVoiceInterview()

  // Cleanup on unmount (e.g. if user navigates away)
  useEffect(() => {
    return () => {
      if (resetInterview) {
        resetInterview()
      }
    }
  }, [resetInterview])

  return (
    <div className="min-h-screen bg-[#0A0B0F] text-white">
      {/* Dynamic Header */}
      <header className="sticky top-0 z-40 border-b border-white/[0.05] bg-[#0A0B0F]/80 px-6 py-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 shadow-[0_0_15px_rgba(139,92,246,0.3)]" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-violet-400">Resume Copilot Workspace</p>
              <h1 className="font-display text-xl font-bold">AI Voice Interview</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative">
        <AnimatePresence mode="wait">
          {phase === 'setup' && (
            <motion.div key="setup" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }} className="pt-12 pb-24 px-4">
              <InterviewSetup />
            </motion.div>
          )}

          {phase === 'interviewing' && (
            <motion.div key="interviewing" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full">
              <InterviewOSLayout />
            </motion.div>
          )}

          {phase === 'report' && (
            <motion.div key="report" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="pt-8 pb-24 px-4">
              <InterviewReport />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}

const VoiceInterviewPage = () => {
  return (
    <VoiceInterviewProvider>
      <VoiceInterviewPageContent />
    </VoiceInterviewProvider>
  )
}

export default VoiceInterviewPage
