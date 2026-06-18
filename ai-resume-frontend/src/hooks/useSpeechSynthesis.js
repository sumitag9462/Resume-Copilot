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
  }, [synth]) // eslint-disable-line react-hooks/exhaustive-deps


  const speak = useCallback((text, options = {}) => {
    if (!synth || !text) return

    // Cancel any current speech
    synth.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    if (options.voice || selectedVoice) {
      utterance.voice = options.voice || selectedVoice
    }
    utterance.rate = options.rate || rate
    utterance.pitch = options.pitch || pitch
    utterance.volume = options.volume || 1.0

    utterance.onstart = () => {
      setIsSpeaking(true)
      setIsPaused(false)
    }

    utterance.onend = () => {
      setIsSpeaking(false)
      setIsPaused(false)
      if (onEndRef.current) onEndRef.current()
    }

    utterance.onerror = (event) => {
      // 'canceled' is not a real error — it happens when we call cancel()
      if (event.error !== 'canceled') {
        console.error('[SpeechSynthesis] Error:', event.error)
      }
      setIsSpeaking(false)
      setIsPaused(false)
      // Call onEnd even on error so the app can recover and activate the mic
      if (onEndRef.current) onEndRef.current()
    }

    utteranceRef.current = utterance

    // Chrome has a bug where long texts get cut off.
    // The workaround is to keep the synth "alive" by resuming periodically.
    // For our use case (short interviewer responses), this shouldn't be needed,
    // but we add a safety net.
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
