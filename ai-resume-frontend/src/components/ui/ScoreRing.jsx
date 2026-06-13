import React, { useState, useEffect } from 'react';

const ScoreRing = ({ 
  score = 0, 
  size = 120, 
  label = 'Score',
  sublabel = '',
  color = '#7C6FF7'
}) => {
  const radius = (size - 12) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  
  const [animatedScore, setAnimatedScore] = useState(0)
  const [animatedOffset, setAnimatedOffset] = useState(circumference)

  useEffect(() => {
    // Animate from 0 to score on mount
    let start = null
    const duration = 1200
    
    const animate = (timestamp) => {
      if (!start) start = timestamp
      const progress = Math.min((timestamp - start) / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      
      setAnimatedScore(Math.round(score * eased))
      setAnimatedOffset(circumference - (score / 100) * circumference * eased)
      
      if (progress < 1) requestAnimationFrame(animate)
    }
    
    const timeout = setTimeout(() => {
      requestAnimationFrame(animate)
    }, 300)
    
    return () => clearTimeout(timeout)
  }, [score, circumference])

  // Color based on score range
  const ringColor = score >= 80 ? '#2ECBAD' :
                    score >= 60 ? '#7C6FF7' :
                    score >= 40 ? '#FBBF24' : '#F87171'

  const glowColor = score >= 80 ? 'rgba(46,203,173,0.3)' :
                    score >= 60 ? 'rgba(124,111,247,0.3)' :
                    score >= 40 ? 'rgba(251,191,36,0.3)' : 'rgba(248,113,113,0.3)'

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg 
          width={size} height={size}
          style={{ transform: 'rotate(-90deg)' }}
        >
          <defs>
            <filter id="ring-glow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          
          {/* Track */}
          <circle
            cx={size/2} cy={size/2} r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="8"
          />
          
          {/* Progress */}
          <circle
            cx={size/2} cy={size/2} r={radius}
            fill="none"
            stroke={ringColor}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={animatedOffset}
            style={{ 
              transition: 'stroke 0.5s ease',
              filter: `drop-shadow(0 0 6px ${glowColor})`
            }}
          />
        </svg>
        
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-primary font-heading" style={{ color: ringColor }}>
            {animatedScore}
          </span>
          <span className="text-xs text-tertiary font-body">
            / 100
          </span>
        </div>
      </div>
      
      <div className="text-center">
        <p className="text-sm font-medium text-primary">
          {label}
        </p>
        {sublabel && (
          <p className="text-xs text-secondary mt-0.5">
            {sublabel}
          </p>
        )}
      </div>
    </div>
  )
}

export default ScoreRing;
