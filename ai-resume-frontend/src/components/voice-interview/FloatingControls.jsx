import { motion } from 'framer-motion'
import { Mic, MicOff, Volume2, VolumeX, RotateCcw, XCircle } from 'lucide-react'

const FloatingControls = ({
  isListening,
  isSpeaking,
  isMuted,
  isLoading,
  interviewState,
  onMicToggle,
  onMuteToggle,
  onRepeatQuestion,
  onEndInterview
}) => {
  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="flex items-center gap-2 rounded-full border border-white/10 bg-[#111318]/80 p-2 backdrop-blur-2xl shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
    >
      {/* Mic Toggle */}
      <button
        onClick={onMicToggle}
        disabled={isLoading || isSpeaking || interviewState === 'thinking'}
        className={`group relative flex h-14 w-14 items-center justify-center rounded-full transition-all duration-300 ${
          isListening
            ? 'bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 border border-rose-500/30 shadow-[0_0_20px_rgba(244,63,94,0.3)]'
            : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-transparent'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {isListening ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
        <span className="absolute -top-10 scale-0 rounded bg-slate-800 px-2 py-1 text-xs text-white opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100 whitespace-nowrap">
          {isListening ? 'Mute Mic' : 'Unmute Mic'}
        </span>
      </button>

      {/* Repeat AI */}
      <button
        onClick={onRepeatQuestion}
        disabled={isLoading || isListening || interviewState === 'thinking'}
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-white/5 text-slate-400 transition-all hover:bg-white/10 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <RotateCcw className="h-5 w-5" />
        <span className="absolute -top-10 scale-0 rounded bg-slate-800 px-2 py-1 text-xs text-white opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100 whitespace-nowrap">
          Repeat Question
        </span>
      </button>

      {/* AI Mute Toggle */}
      <button
        onClick={onMuteToggle}
        className={`group relative flex h-14 w-14 items-center justify-center rounded-full transition-all ${
          isMuted
            ? 'bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 border border-orange-500/30'
            : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-transparent'
        }`}
      >
        {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        <span className="absolute -top-10 scale-0 rounded bg-slate-800 px-2 py-1 text-xs text-white opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100 whitespace-nowrap">
          {isMuted ? 'Unmute AI' : 'Mute AI'}
        </span>
      </button>

      <div className="mx-2 h-8 w-[1px] bg-white/10" />

      {/* End Interview */}
      <button
        onClick={onEndInterview}
        disabled={isLoading}
        className="group relative flex h-14 px-6 items-center justify-center gap-2 rounded-full bg-rose-500/10 text-rose-400 transition-all hover:bg-rose-500/20 hover:text-rose-300 border border-rose-500/20 disabled:opacity-50"
      >
        <XCircle className="h-5 w-5" />
        <span className="font-bold text-sm tracking-wide">End</span>
      </button>
    </motion.div>
  )
}

export default FloatingControls
