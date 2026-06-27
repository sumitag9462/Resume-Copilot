// =============================================================
// src/hooks/useSpeechSynthesis.js — TEXT-TO-SPEECH HOOK
//
// Custom React hook wrapping the Web Speech Synthesis API.
// Provides natural voice selection, rate/pitch control,
// pause/resume, and onEnd callbacks for conversation flow.
//
// Usage:
//   const { isSpeaking, speak, cancel, ... } = useSpeechSynthesis()
// =============================================================

import { useState, useRef, useCallback, useEffect } from 'react'

const useSpeechSynthesis = ({ rate = 1.0, pitch = 1.0, onEnd } = {}) => {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [voices, setVoices] = useState([])
  const [selectedVoice, setSelectedVoice] = useState(null)

  const synth = typeof window !== 'undefined' ? window.speechSynthesis : null
  const isSupported = !!synth
  const onEndRef = useRef(onEnd)
  const utteranceRef = useRef(null)

  // Keep onEnd ref updated
  useEffect(() => {
    onEndRef.current = onEnd
  }, [onEnd])

  // Load available voices
  useEffect(() => {
    if (!synth) return

    const loadVoices = () => {
      const available = synth.getVoices()
      setVoices(available)

      // Auto-select a good English voice
      if (available.length > 0 && !selectedVoice) {
        const preferred = [
          'Google UK English Female',
          'Google US English',
          'Microsoft Zira',
          'Samantha',
          'Karen',
          'Daniel',
          'Moira'
        ]

        let bestVoice = null
        for (const name of preferred) {
          bestVoice = available.find(v => v.name.includes(name))
          if (bestVoice) break
        }

        // Fallback: any English voice
        if (!bestVoice) {
          bestVoice = available.find(v => v.lang.startsWith('en'))
        }

        // Last fallback: first available
        if (!bestVoice) {
          bestVoice = available[0]
        }

        setSelectedVoice(bestVoice)
      }
    }

    loadVoices()

    // Chrome fires this event when voices are loaded asynchronously
    synth.addEventListener('voiceschanged', loadVoices)

    // Safari bug fix: Sometimes 'voiceschanged' never fires, so we poll for voices
    const intervalId = setInterval(() => {
      const v = synth.getVoices()
      if (v.length > 0) {
        clearInterval(intervalId)
        loadVoices()
      }
    }, 100)

    // Stop polling after 5 seconds to avoid infinite loops
    setTimeout(() => clearInterval(intervalId), 5000)

    return () => {
      clearInterval(intervalId)
      try {
        synth.removeEventListener('voiceschanged', loadVoices)
      } catch (e) { /* ignore */ }
    }
  }, [synth])  


  const speak = useCallback((text, options = {}) => {
    if (!synth || !text) return

    // Cancel any current speech ONLY if we are not enqueueing
    if (!options.enqueue) {
      synth.cancel()
      setIsSpeaking(false)
    }

    const utterance = new SpeechSynthesisUtterance(text)

    utterance.voice = options.voice || selectedVoice || null
    utterance.rate = options.rate || rate
    utterance.pitch = options.pitch || pitch
    utterance.lang = (options.voice || selectedVoice) ? (options.voice || selectedVoice).lang : 'en-US'
    utterance.volume = options.volume || 1.0

    // Save ref to prevent garbage collection bugs in Safari
    utteranceRef.current = utterance

    utterance.onstart = () => {
      setIsSpeaking(true)
      setIsPaused(false)
    }

    utterance.onend = () => {
      // Check if there are more items in the queue
      if (!synth.pending) {
        setIsSpeaking(false)
        setIsPaused(false)
        if (onEndRef.current) {
          onEndRef.current()
        }
      }
    }

    utterance.onerror = (e) => {
      // 'interrupted' and 'canceled' are normal when we call synth.cancel() manually
      if (e.error !== 'interrupted' && e.error !== 'canceled') {
        console.error('SpeechSynthesisError:', e)
        setIsSpeaking(false)
      }
      
      // Safety net: if queue is empty, trigger onEnd anyway so UI doesn't hang
      if (!synth.pending && onEndRef.current) {
        onEndRef.current()
      }
    }

    synth.speak(utterance)
  }, [synth, selectedVoice, rate, pitch])


  const cancel = useCallback(() => {
    if (!synth) return
    synth.cancel()
    setIsSpeaking(false)
    setIsPaused(false)
  }, [synth])


  const pause = useCallback(() => {
    if (!synth) return
    synth.pause()
    setIsPaused(true)
  }, [synth])


  const resume = useCallback(() => {
    if (!synth) return
    synth.resume()
    setIsPaused(false)
  }, [synth])


  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (synth) {
        try { synth.cancel() } catch (e) { /* ignore */ }
      }
    }
  }, [synth])


  return {
    isSpeaking,
    isPaused,
    isSupported,
    voices,
    selectedVoice,
    setSelectedVoice,
    speak,
    cancel,
    pause,
    resume
  }
}

export default useSpeechSynthesis
