// =============================================================
// src/context/VoiceInterviewContext.jsx — VOICE INTERVIEW STATE
//
// React Context managing the entire voice interview lifecycle:
//   - Session state (ID, status, company)
//   - Interview phase (setup → interviewing → report)
//   - Chat history
//   - Evaluation results
//   - Timer
//   - Loading/error states
//
// All API calls are centralized here so components only need
// to call context methods and read state.
// =============================================================

import { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react'
import {
  startVoiceInterview,
  sendVoiceMessage,
  streamVoiceMessage,
  endVoiceInterview
} from '../api/voiceInterviewApi'

const VoiceInterviewContext = createContext(null)

export const useVoiceInterview = () => {
  const ctx = useContext(VoiceInterviewContext)
  if (!ctx) throw new Error('useVoiceInterview must be used within VoiceInterviewProvider')
  return ctx
}

export const VoiceInterviewProvider = ({ children }) => {
  // ── Phase Management ──────────────────────────────────────
  const [phase, setPhase] = useState('setup') // 'setup' | 'interviewing' | 'report'

  // ── Session State ─────────────────────────────────────────
  const [sessionId, setSessionId] = useState(null)
  const [companyName, setCompanyName] = useState('')
  const [status, setStatus] = useState('idle') // 'idle' | 'active' | 'completed'

  // ── Chat & Transcript ─────────────────────────────────────
  const [chatHistory, setChatHistory] = useState([])
  const [questionCount, setQuestionCount] = useState(0)
  const [lastAiMessage, setLastAiMessage] = useState('')

  // ── Evaluation ────────────────────────────────────────────
  const [evaluation, setEvaluation] = useState(null)

  // ── Loading & Error ───────────────────────────────────────
  const [isLoading, setIsLoading] = useState(false)
  const [isEvaluating, setIsEvaluating] = useState(false)
  const [error, setError] = useState(null)

  // ── Interview State (for Orb) ─────────────────────────────
  const [interviewState, setInterviewState] = useState('idle') // 'idle' | 'listening' | 'thinking' | 'speaking' | 'complete'

  // ── Timer ─────────────────────────────────────────────────
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const timerRef = useRef(null)

  const startTimer = useCallback(() => {
    if (timerRef.current) return
    timerRef.current = setInterval(() => {
      setElapsedSeconds(prev => prev + 1)
    }, 1000)
  }, [])

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  // Cleanup timer on unmount
  useEffect(() => {
    return () => stopTimer()
  }, [stopTimer])


  // ── API: Start Interview ──────────────────────────────────
  const handleStartInterview = useCallback(async ({ resumeText, resumeId, jobDescription, companyName: company, interviewType, language, companyMode }) => {
    setIsLoading(true)
    setError(null)
    try {
      const payload = { 
        jobDescription, 
        companyName: company,
        interviewType,
        language,
        companyMode 
      }
      if (resumeId) payload.resumeId = resumeId
      else payload.resumeText = resumeText

      const data = await startVoiceInterview(payload)

      if (data.success) {
        setSessionId(data.sessionId)
        setCompanyName(company)
        setStatus('active')
        setQuestionCount(data.questionCount || 1)
        setLastAiMessage(data.aiMessage)
        setChatHistory([{
          role: 'model',
          content: data.aiMessage,
          timestamp: new Date().toISOString()
        }])
        setPhase('interviewing')
        setInterviewState('speaking')
        startTimer()
        return data
      } else {
        throw new Error(data.message || 'Failed to start interview')
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to start interview'
      setError(msg)
      throw new Error(msg)
    } finally {
      setIsLoading(false)
    }
  }, [startTimer])


  // ── API: Send Message ─────────────────────────────────────
  const handleSendMessage = useCallback(async (userAnswer) => {
    if (!sessionId || !userAnswer.trim()) return
    setIsLoading(true)
    setError(null)
    setInterviewState('thinking')

    // Optimistically add user message
    const userMsg = {
      role: 'user',
      content: userAnswer.trim(),
      timestamp: new Date().toISOString()
    }
    setChatHistory(prev => [...prev, userMsg])
    
    // Add empty model message placeholder for the stream
    const modelMsgIndex = chatHistory.length + 1
    setChatHistory(prev => [...prev, {
      role: 'model',
      content: '',
      timestamp: new Date().toISOString()
    }])

    try {
      const reader = await streamVoiceMessage({ sessionId, userAnswer: userAnswer.trim() })
      setInterviewState('speaking')
      
      const decoder = new TextDecoder()
      let fullResponse = ''
      let sentenceBuffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        
        const chunkStr = decoder.decode(value, { stream: true })
        // SSE chunks look like: data: {"text":"..."}\n\n
        const lines = chunkStr.split('\n')
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.replace('data: ', '').trim()
            if (!dataStr) continue
            
            try {
              const data = JSON.parse(dataStr)
              if (data.done) break
              if (data.error) throw new Error(data.error)
              
              if (data.text) {
                fullResponse += data.text
                sentenceBuffer += data.text
                
                // Update chat history in real-time
                setChatHistory(prev => {
                  const newHistory = [...prev]
                  if (newHistory.length > 0) {
                    newHistory[newHistory.length - 1].content = fullResponse
                  }
                  return newHistory
                })
                
                // Check for sentence boundaries
                const match = sentenceBuffer.match(/([^.?!]+[.?!]+)/)
                if (match) {
                  const sentence = match[1]
                  setLastAiMessage(sentence) // Triggers TTS in layout
                  sentenceBuffer = sentenceBuffer.substring(sentence.length)
                }
              }
            } catch (e) {
              console.error('Failed to parse SSE data:', dataStr, e)
            }
          }
        }
      }
      
      // Flush remaining text
      if (sentenceBuffer.trim()) {
        setLastAiMessage(sentenceBuffer.trim())
      }
      
      setQuestionCount(prev => prev + 1)
      setIsLoading(false)

    } catch (err) {
      console.error('[VoiceInterviewContext] stream error:', err)
      const msg = err.response?.data?.message || err.message || 'Failed to process answer'
      setError(msg)
      setInterviewState('idle')
      setIsLoading(false)
      throw new Error(msg)
    }
  }, [sessionId, chatHistory.length])


  // ── API: End Interview ────────────────────────────────────
  const handleEndInterview = useCallback(async () => {
    if (!sessionId) return
    setIsEvaluating(true)
    setError(null)
    stopTimer()

    try {
      const data = await endVoiceInterview({ sessionId })

      if (data.success) {
        setStatus('completed')
        setEvaluation(data.evaluation)
        setInterviewState('complete')
        setPhase('report')
        return data
      } else {
        throw new Error(data.message || 'Failed to end interview')
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to generate evaluation'
      setError(msg)
      throw new Error(msg)
    } finally {
      setIsEvaluating(false)
    }
  }, [sessionId, stopTimer])


  // ── Reset (start new interview) ───────────────────────────
  const resetInterview = useCallback(() => {
    stopTimer()
    setPhase('setup')
    setSessionId(null)
    setCompanyName('')
    setStatus('idle')
    setChatHistory([])
    setQuestionCount(0)
    setLastAiMessage('')
    setEvaluation(null)
    setIsLoading(false)
    setIsEvaluating(false)
    setError(null)
    setInterviewState('idle')
    setElapsedSeconds(0)
  }, [stopTimer])


  const value = {
    // Phase
    phase,
    setPhase,
    // Session
    sessionId,
    companyName,
    status,
    // Chat
    chatHistory,
    questionCount,
    lastAiMessage,
    // Evaluation
    evaluation,
    // Loading
    isLoading,
    isEvaluating,
    error,
    // Interview State (Orb)
    interviewState,
    setInterviewState,
    // Timer
    elapsedSeconds,
    // Actions
    handleStartInterview,
    handleSendMessage,
    handleEndInterview,
    resetInterview
  }

  return (
    <VoiceInterviewContext.Provider value={value}>
      {children}
    </VoiceInterviewContext.Provider>
  )
}

export default VoiceInterviewContext
