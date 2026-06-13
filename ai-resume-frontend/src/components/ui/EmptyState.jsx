import React from 'react';
import { motion } from 'framer-motion';

const EmptyState = ({ 
  icon: Icon, 
  title, 
  subtitle, 
  chips = [],
  action = null 
}) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: [0.23,1,0.32,1] }}
    className="flex flex-col items-center justify-center h-full min-h-[320px] text-center p-8"
  >
    {/* Icon container with subtle glow */}
    <div className="relative mb-6">
      <div className="absolute inset-0 rounded-2xl bg-accent-violet/10 blur-xl scale-150" />
      <div className="relative w-16 h-16 rounded-2xl bg-accent-violet/10 border border-accent-violet/20 flex items-center justify-center animate-float">
        <Icon 
          size={28} 
          className="text-accent-violet" 
          strokeWidth={1.5}
        />
      </div>
    </div>

    {/* Text */}
    <h3 className="text-base font-semibold text-primary mb-2">
      {title}
    </h3>
    <p className="text-sm text-secondary max-w-[240px] leading-relaxed mb-6">
      {subtitle}
    </p>

    {/* Hint chips */}
    {chips.length > 0 && (
      <div className="flex flex-wrap gap-2 justify-center mb-6">
        {chips.map((chip, i) => (
          <span key={i} className={`badge 
            ${chip.color === 'teal' ? 'badge-teal' : 
              chip.color === 'red' ? 'badge-red' :
              chip.color === 'amber' ? 'badge-amber' :
              'badge-violet'}`}>
            {chip.label}
          </span>
        ))}
      </div>
    )}

    {/* Optional action */}
    {action && (
      <button onClick={action.onClick}
        className="btn-secondary text-sm px-4 py-2 rounded-lg text-secondary hover:text-primary">
        {action.label}
      </button>
    )}
  </motion.div>
)

export default EmptyState;
