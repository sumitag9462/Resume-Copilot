// =============================================================
// src/components/resume/ATSScoreCircle.jsx
//
// SVG-based circular progress ring.
// Uses stroke-dasharray + stroke-dashoffset trick:
//   - Full circumference = 2πr
//   - We reveal it by adjusting dashoffset from full → partial
// =============================================================

import { useEffect, useState } from 'react'

const ATSScoreCircle = ({ score = 0, size = 160, strokeWidth = 10 }) => {
  const [animatedScore, setAnimatedScore] = useState(0)

  // Animate from 0 → score on mount
  useEffect(() => {
    const duration = 1200
    const startTime = Date.now()
    const tick = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setAnimatedScore(Math.round(eased * score))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [score])

  const radius = (size - strokeWidth * 2) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (animatedScore / 100) * circumference

  const getColor = (s) => {
    if (s >= 75) return { stroke: '#10b981', text: 'text-emerald-600', bg: '#d1fae5', label: 'Excellent' }
    if (s >= 50) return { stroke: '#f59e0b', text: 'text-amber-600',   bg: '#fef3c7', label: 'Good' }
    return           { stroke: '#ef4444', text: 'text-red-500',        bg: '#fee2e2', label: 'Needs Work' }
  }

  const colors = getColor(animatedScore)

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          {/* Track (grey ring) */}
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke="#f1f5f9" strokeWidth={strokeWidth}
          />
          {/* Progress ring */}
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none"
            stroke={colors.stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.05s ease' }}
          />
        </svg>
        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-3xl font-bold font-heading tabular-nums ${colors.text}`}>
            {animatedScore}
          </span>
          <span className="text-xs text-slate-400 font-medium">/100</span>
        </div>
      </div>
      <span
        className={`text-xs font-semibold px-3 py-1 rounded-full`}
        style={{ backgroundColor: colors.bg, color: colors.stroke }}
      >
        {colors.label}
      </span>
    </div>
  )
}

export default ATSScoreCircle