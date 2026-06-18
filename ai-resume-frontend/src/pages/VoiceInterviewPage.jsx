// =============================================================
// src/pages/VoiceInterviewPage.jsx — AI VOICE INTERVIEW PAGE
//
// Single page with 3 internal phases:
//   setup        → InterviewSetup (collect resume, JD, company)
//   interviewing → InterviewDashboard (voice conversation)
//   report       → InterviewReport (evaluation scorecard)
//
// Wrapped in VoiceInterviewProvider for state management.
// =============================================================

import { motion, AnimatePresence } from 'framer-motion'
import DashboardLayout from '../components/layout/DashboardLayout'
import InterviewSetup from '../components/voice-interview/InterviewSetup'
import InterviewDashboard from '../components/voice-interview/InterviewDashboard'
import InterviewReport from '../components/voice-interview/InterviewReport'
import { VoiceInterviewProvider, useVoiceInterview } from '../context/VoiceInterviewContext'

const pageTransition = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
  transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
}

const VoiceInterviewContent = () => {
  const { phase } = useVoiceInterview()

  return (
    <AnimatePresence mode="wait">
      {phase === 'setup' && (
        <motion.div key="setup" {...pageTransition} className="py-6 px-4">
          <InterviewSetup />
        </motion.div>
      )}

      {phase === 'interviewing' && (
        <motion.div key="interviewing" {...pageTransition} className="h-full">
          <InterviewDashboard />
        </motion.div>
      )}

      {phase === 'report' && (
        <motion.div key="report" {...pageTransition} className="py-6 px-4">
          <InterviewReport />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const VoiceInterviewPage = () => {
  return (
    <VoiceInterviewProvider>
      <DashboardLayout>
        <VoiceInterviewContent />
      </DashboardLayout>
    </VoiceInterviewProvider>
  )
}

export default VoiceInterviewPage
