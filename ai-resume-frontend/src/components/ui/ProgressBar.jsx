import { useEffect, useState } from 'react'

// score: 0–100 number. Animates from 0 → score on mount.
const ProgressBar = ({ score = 0, label = '', showPercent = true, className = '' }) => {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => setWidth(score), 100)
    return () => clearTimeout(timer)
  }, [score])

  const getColor = (s) => {
    if (s >= 75) return 'from-emerald-400 to-emerald-500'
    if (s >= 50) return 'from-amber-400 to-amber-500'
    return 'from-red-400 to-rose-500'
  }

  return (
    <div className={`${className}`}>
      {(label || showPercent) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && <span className="text-xs font-medium text-slate-600">{label}</span>}
          {showPercent && (
            <span className={`text-xs font-bold tabular-nums ${
              score >= 75 ? 'text-emerald-600' : score >= 50 ? 'text-amber-600' : 'text-red-500'
            }`}>
              {score}%
            </span>
          )}
        </div>
      )}
      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${getColor(score)} transition-all duration-700 ease-out`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  )
}

export default ProgressBar