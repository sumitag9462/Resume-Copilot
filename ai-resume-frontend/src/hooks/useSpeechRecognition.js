// =============================================================
// src/hooks/useSpeechRecognition.js — SPEECH-TO-TEXT HOOK
//
// Custom React hook wrapping the Web Speech Recognition API.
// Provides continuous speech recognition with interim results,
// auto-restart on unexpected stops, error handling, and
// browser compatibility detection.
//
// Usage:
//   const { isListening, transcript, startListening, ... } = useSpeechRecognition()
// =============================================================

import { useState, useRef, useCallback, useEffect } from 'react'

const useSpeechRecognition = ({ language = 'en-US', continuous = true } = {}) => {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [interimTranscript, setInterimTranscript] = useState('')
  const [error, setError] = useState(null)

  const recognitionRef = useRef(null)
  const isStoppedManuallyRef = useRef(false)

  // Check browser support
  const SpeechRecognition = typeof window !== 'undefined'
    ? window.SpeechRecognition || window.webkitSpeechRecognition
    : null
  const isSupported = !!SpeechRecognition

  // Initialize recognition instance
  useEffect(() => {
    if (!SpeechRecognition) return

    const recognition = new SpeechRecognition()
    recognition.continuous = continuous
    recognition.interimResults = true
    recognition.lang = language
    recognition.maxAlternatives = 1

    recognition.onstart = () => {
      setIsListening(true)
      setError(null)
    }

    recognition.onresult = (event) => {
      let finalText = ''
      let interimText = ''

      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i]
        if (result.isFinal) {
          finalText += result[0].transcript
        } else {
          interimText += result[0].transcript
        }
      }

      if (finalText) {
        setTranscript(prev => {
          const separator = prev ? ' ' : ''
          return prev + separator + finalText.trim()
        })
      }
      setInterimTranscript(interimText)
    }

    recognition.onerror = (event) => {
      console.error('[SpeechRecognition] Error:', event.error)

      switch (event.error) {
        case 'not-allowed':
        case 'service-not-allowed':
          setError('Microphone access denied. Please allow microphone permissions.')
          setIsListening(false)
          break
        case 'no-speech':
          // Not a critical error, just no speech detected
          break
        case 'network':
          setError('Network error. Speech recognition requires an internet connection.')
          setIsListening(false)
          break
        case 'aborted':
          // Intentional abort, not an error
          break
        default:
          setError(`Speech recognition error: ${event.error}`)
          setIsListening(false)
      }
    }

    recognition.onend = () => {
      setIsListening(false)
      setInterimTranscript('')

      // Auto-restart if not manually stopped (handles browser auto-stop)
      if (!isStoppedManuallyRef.current && continuous) {
        try {
          recognition.start()
        } catch (e) {
          // Ignore — already running or can't restart
        }
      }
    }

    recognitionRef.current = recognition

    return () => {
      isStoppedManuallyRef.current = true
      try {
        recognition.stop()
      } catch (e) { /* ignore */ }
    }
  }, [SpeechRecognition, language, continuous])


  const startListening = useCallback(() => {
    if (!recognitionRef.current) {
      setError('Speech recognition is not supported in this browser.')
      return
    }

    isStoppedManuallyRef.current = false
    setTranscript('')
    setInterimTranscript('')
    setError(null)

    try {
      recognitionRef.current.start()
    } catch (e) {
      // May already be running
      try {
        recognitionRef.current.stop()
        setTimeout(() => {
          try { recognitionRef.current.start() } catch (e2) { /* ignore */ }
        }, 100)
      } catch (e2) { /* ignore */ }
    }
  }, [])


  const stopListening = useCallback(() => {
    isStoppedManuallyRef.current = true
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop()
      } catch (e) { /* ignore */ }
    }
    setIsListening(false)
    setInterimTranscript('')
  }, [])


  const resetTranscript = useCallback(() => {
    setTranscript('')
    setInterimTranscript('')
  }, [])


  return {
    isListening,
    transcript,
    interimTranscript,
    isSupported,
    error,
    startListening,
    stopListening,
    resetTranscript
  }
}

export default useSpeechRecognition
