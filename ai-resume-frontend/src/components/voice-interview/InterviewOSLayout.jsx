import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, Zap } from 'lucide-react'
import toast from 'react-hot-toast'
import AIOrb from './AIOrb'
import TranscriptPanel from './TranscriptPanel'
import ScorePanel from './ScorePanel'
import FloatingControls from './FloatingControls'
import { useVoiceInterview } from '../../context/VoiceInterviewContext'
import useSpeechRecognition from '../../hooks/useSpeechRecognition'
import useSpeechSynthesis from '../../hooks/useSpeechSynthesis'

const InterviewOSLayout = () => {
  const {
    chatHistory,
    questionCount,
    lastAiMessage,
    interviewState,
    setInterviewState,
    elapsedSeconds,
    companyName,
    interviewType,
    isLoading,
    isEvaluating,
    handleSendMessage,
    handleEndInterview
  } = useVoiceInterview()

  const [isMuted, setIsMuted] = useState(false)
  const hasSpokenFirstMessage = useRef(false)
  const pendingSendRef = useRef(false)

  // ── Voice Hooks ─────────────────────────────────────────────
  const {
    isListening,
    transcript,
    interimTranscript,
    isSupported: micSupported,
    startListening,
    stopListening,
    resetTranscript
  } = useSpeechRecognition()

  const onSpeechEnd = useCallback(() => {
    setInterviewState('listening')
    if (micSupported) startListening()
  }, [setInterviewState, micSupported, startListening])

  const {
    isSpeaking,
    speak,
    cancel: cancelSpeech,
    isSupported: synthSupported
  } = useSpeechSynthesis({ rate: 1.0, pitch: 1.0, onEnd: onSpeechEnd })

  // ── Speak the first AI message on mount ─────────────────────
  useEffect(() => {
    if (lastAiMessage && !hasSpokenFirstMessage.current) {
      hasSpokenFirstMessage.current = true
      if (!isMuted && synthSupported) {
        speak(lastAiMessage, { enqueue: false })
      } else {
        setInterviewState('listening')
        if (micSupported) startListening()
      }
    }
  }, [lastAiMessage])

  // ── Speak new AI messages (Streaming Sentences) ─────────────────────────
  useEffect(() => {
    if (chatHistory.length > 1 && interviewState === 'speaking' && lastAiMessage) {
      // The context updates lastAiMessage dynamically with sentence chunks during streaming
      if (!isMuted && synthSupported) {
        speak(lastAiMessage, { enqueue: true })
      } else {
        setInterviewState('listening')
        if (micSupported) startListening()
      }
    }
  }, [lastAiMessage])

  // ── Send user answer when mic stops (manual stop) ───────────
  useEffect(() => {
    if (pendingSendRef.current && !isListening && transcript.trim()) {
      pendingSendRef.current = false
      const answer = transcript.trim()
      resetTranscript()
      setInterviewState('thinking')

      handleSendMessage(answer).catch(err => {
        toast.error(err.message || 'Failed to send answer')
        setInterviewState('listening')
        if (micSupported) startListening()
      })
    }
  }, [isListening])

  // ── Auto-submit answer after 3 seconds of silence ───────────
  useEffect(() => {
    if (!isListening || interviewState !== 'listening') return
    const currentText = (transcript + ' ' + interimTranscript).trim()
    if (!currentText) return

    const timeoutId = setTimeout(() => {
      pendingSendRef.current = true
      stopListening()
    }, 3000)

    return () => clearTimeout(timeoutId)
  }, [transcript, interimTranscript, isListening, interviewState, stopListening])

  // ── Handlers ──────────────────────────────────────────────
  const handleMicToggle = useCallback(() => {
    if (isListening) {
      pendingSendRef.current = true
      stopListening()
    } else {
      setInterviewState('listening')
      resetTranscript()
      startListening()
    }
  }, [isListening, stopListening, startListening, resetTranscript, setInterviewState])

  const handleMuteToggle = useCallback(() => {
    setIsMuted(prev => {
      if (!prev) cancelSpeech()
      return !prev
    })
  }, [cancelSpeech])

  const handleRepeatQuestion = useCallback(() => {
    if (!lastAiMessage) return
    if (isListening) stopListening()
    resetTranscript()
    if (!isMuted && synthSupported) {
      setInterviewState('speaking')
      speak(lastAiMessage)
    } else {
      toast('AI voice is muted. Read the last question in the transcript.', { icon: '🔇' })
    }
  }, [lastAiMessage, isMuted, synthSupported, speak, isListening, stopListening, resetTranscript, setInterviewState])

  const handleEnd = useCallback(() => {
    if (isListening) stopListening()
    cancelSpeech()
    setInterviewState('thinking')
    handleEndInterview().catch(err => toast.error(err.message || 'Failed to end interview'))
  }, [isListening, stopListening, cancelSpeech, setInterviewState, handleEndInterview])

  // ── Evaluating Overlay ──────────────────────────────────────
  if (isEvaluating) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0A0B0F]/95 backdrop-blur-xl"
      >
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="mb-8"
        >
          <div className="h-24 w-24 rounded-full bg-gradient-to-br from-violet-500/20 via-purple-500/15 to-fuchsia-500/20 border border-violet-500/20 flex items-center justify-center shadow-[0_0_60px_rgba(139,92,246,0.2)]">
            <Loader2 className="h-10 w-10 text-violet-400 animate-spin" />
          </div>
        </motion.div>
        <h2 className="text-2xl font-display font-bold text-white mb-3">Analyzing Your Interview</h2>
        <p className="text-sm text-slate-400 max-w-md text-center leading-relaxed">
          Our AI is evaluating your responses across 10 dimensions including technical skills,
          communication, confidence, and more...
        </p>
      </motion.div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-80px)] overflow-hidden bg-[#0A0B0F]">
      
      {/* LEFT PANE - Dashboard/Stats */}
      <div className="hidden lg:flex w-[320px] flex-col border-r border-white/5 bg-[#111318]/50 p-6 shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]">
         <div className="flex items-center gap-3 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/20 border border-violet-500/30 shadow-[0_0_20px_rgba(139,92,246,0.2)]">
               <Zap className="h-5 w-5 text-violet-400" />
            </div>
            <div>
               <h2 className="text-sm font-bold text-white tracking-widest uppercase opacity-90">{interviewType || 'Technical'}</h2>
               <p className="text-xs text-slate-500">{companyName} Interview</p>
            </div>
         </div>
         <div className="flex-1 overflow-y-auto custom-scrollbar">
            <ScorePanel
              questionCount={questionCount}
              elapsedSeconds={elapsedSeconds}
              interviewState={interviewState}
              companyName={companyName}
            />
         </div>
      </div>

      {/* CENTER PANE - The AI Engine */}
      <div className="flex-1 relative flex flex-col items-center justify-center bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-violet-900/10 via-[#0A0B0F] to-[#0A0B0F]">
         <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-5" />
         
         <div className="relative z-10 scale-125 mb-16">
            <AIOrb state={interviewState} />
         </div>

         {/* Floating Controls Island */}
         <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20">
            <FloatingControls
              isListening={isListening}
              isSpeaking={isSpeaking}
              isMuted={isMuted}
              isLoading={isLoading}
              interviewState={interviewState}
              onMicToggle={handleMicToggle}
              onMuteToggle={handleMuteToggle}
              onRepeatQuestion={handleRepeatQuestion}
              onEndInterview={handleEnd}
            />
         </div>
      </div>

      {/* RIGHT PANE - Live Transcript */}
      <div className="hidden lg:flex w-[400px] flex-col border-l border-white/5 bg-[#111318]/30 shadow-[-20px_0_40px_rgba(0,0,0,0.3)]">
         <div className="p-6 pb-2 border-b border-white/5">
            <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2">
               <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
               Live Transcript
            </h3>
         </div>
         <div className="flex-1 overflow-y-auto min-h-0">
            <TranscriptPanel
              chatHistory={chatHistory}
              interimTranscript={isListening ? (interimTranscript || transcript) : ''}
              compact={true}
            />
         </div>
      </div>

    </div>
  )
}

export default InterviewOSLayout
