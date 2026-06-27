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
  const baseClasses = "card relative overflow-hidden";
  const hoverClasses = hoverEffect ? "hover:-translate-y-1" : "";
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
