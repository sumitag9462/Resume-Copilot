// =============================================================
// src/components/voice-interview/InterviewDashboard.jsx
//
// Main interview interface composing all sub-components:
//   - TranscriptPanel (left)
//   - AIOrb (center)
//   - ScorePanel (right)
//   - InterviewControls (bottom)
//
// Orchestrates the conversation flow:
//   AI speaks → Mic activates → User answers → Backend request
//   → Gemini response → Speech synthesis → Repeat
// =============================================================

import { useState, useCallback, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import AIOrb from './AIOrb'
import TranscriptPanel from './TranscriptPanel'
import ScorePanel from './ScorePanel'
import InterviewControls from './InterviewControls'
import { useVoiceInterview } from '../../context/VoiceInterviewContext'
import useSpeechRecognition from '../../hooks/useSpeechRecognition'
import useSpeechSynthesis from '../../hooks/useSpeechSynthesis'

const InterviewDashboard = () => {
  const {
    chatHistory,
    questionCount,
    lastAiMessage,
    interviewState,
    setInterviewState,
    elapsedSeconds,
    companyName,
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
    // AI finished speaking → activate mic
    setInterviewState('listening')
    if (micSupported) {
      startListening()
    }
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
        speak(lastAiMessage)
      } else {
        // If muted or no synthesis, go straight to listening
        setInterviewState('listening')
        if (micSupported) startListening()
      }
    }
  }, [lastAiMessage])  

  // ── Speak new AI messages ───────────────────────────────────
  useEffect(() => {
    if (chatHistory.length > 1 && interviewState === 'speaking') {
      const lastMsg = chatHistory[chatHistory.length - 1]
      if (lastMsg.role === 'model') {
        if (!isMuted && synthSupported) {
          speak(lastMsg.content)
        } else {
          // If muted, skip to listening
          setInterviewState('listening')
          if (micSupported) startListening()
        }
      }
    }
  }, [chatHistory.length])  

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

    // Only start the silence timer if the user has actually said something
    const currentText = (transcript + ' ' + interimTranscript).trim()
    if (!currentText) return

    const timeoutId = setTimeout(() => {
      // User has been silent for 3 seconds -> automatically submit!
      pendingSendRef.current = true
      stopListening()
    }, 3000)

    return () => clearTimeout(timeoutId)
  }, [transcript, interimTranscript, isListening, interviewState, stopListening])

  // ── Mic Toggle ──────────────────────────────────────────────
  const handleMicToggle = useCallback(() => {
    if (isListening) {
      // Stop and send
      pendingSendRef.current = true
      stopListening()
    } else {
      // Start listening
      setInterviewState('listening')
      resetTranscript()
      startListening()
    }
  }, [isListening, stopListening, startListening, resetTranscript, setInterviewState])

  // ── Mute Toggle ─────────────────────────────────────────────
  const handleMuteToggle = useCallback(() => {
    setIsMuted(prev => {
      if (!prev) {
        // Muting — cancel current speech
        cancelSpeech()
      }
      return !prev
    })
  }, [cancelSpeech])

  // ── Repeat Question ─────────────────────────────────────────
  const handleRepeatQuestion = useCallback(() => {
    if (!lastAiMessage) return

    // Stop mic first
    if (isListening) stopListening()
    resetTranscript()

    if (!isMuted && synthSupported) {
      setInterviewState('speaking')
      speak(lastAiMessage)
    } else {
      toast('AI voice is muted. Read the last question in the transcript.', { icon: '🔇' })
    }
  }, [lastAiMessage, isMuted, synthSupported, speak, isListening, stopListening, resetTranscript, setInterviewState])

  // ── End Interview ───────────────────────────────────────────
  const handleEnd = useCallback(() => {
    // Stop everything
    if (isListening) stopListening()
    cancelSpeech()
    setInterviewState('thinking')

    handleEndInterview().catch(err => {
      toast.error(err.message || 'Failed to end interview')
    })
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
        <div className="mt-8 flex gap-1">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-violet-400"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>
      </motion.div>
    )
  }

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] max-h-[900px]">
      {/* Main 3-Column Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_auto_280px] gap-4 lg:gap-6 p-4 lg:p-6 overflow-hidden">
        {/* Left — Transcript */}
        <div className="hidden lg:block min-h-0 overflow-hidden">
          <TranscriptPanel
            chatHistory={chatHistory}
            interimTranscript={isListening ? (interimTranscript || transcript) : ''}
          />
        </div>

        {/* Center — Orb */}
        <div className="flex items-center justify-center px-4 lg:px-8">
          <AIOrb state={interviewState} />
        </div>

        {/* Right — Score Panel */}
        <div className="hidden lg:block overflow-y-auto custom-scrollbar">
          <ScorePanel
            questionCount={questionCount}
            elapsedSeconds={elapsedSeconds}
            interviewState={interviewState}
            companyName={companyName}
          />
        </div>
      </div>

      {/* Mobile Transcript (below orb) */}
      <div className="lg:hidden flex-1 min-h-[200px] max-h-[300px] px-4 overflow-hidden">
        <TranscriptPanel
          chatHistory={chatHistory}
          interimTranscript={isListening ? (interimTranscript || transcript) : ''}
        />
      </div>

      {/* Bottom Controls */}
      <div className="px-4 pb-4 pt-2">
        <InterviewControls
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
  )
}

export default InterviewDashboard
