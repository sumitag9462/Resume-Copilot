import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

const GlassCard = forwardRef(({ 
  children, 
  className, 
  hoverEffect = false,
  animated = false,
  delay = 0,
  ...props 
}, ref) => {
  const baseClasses = "relative overflow-hidden rounded-3xl bg-[#111318]/40 backdrop-blur-xl border border-white/[0.05] shadow-[0_8px_32px_rgba(0,0,0,0.2)]";
  const hoverClasses = hoverEffect ? "transition-all duration-500 hover:shadow-[0_20px_40px_rgba(124,111,247,0.1)] hover:-translate-y-1 hover:border-white/[0.1]" : "";
  const finalClassName = twMerge(baseClasses, hoverClasses, className);

  if (animated) {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
        className={finalClassName}
        {...props}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
        <div className="relative z-10 h-full">{children}</div>
      </motion.div>
    );
  }

  return (
    <div ref={ref} className={finalClassName} {...props}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
});

export default GlassCard;
