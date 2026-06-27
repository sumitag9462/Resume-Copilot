import React from 'react';
import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';
import MagneticButton from '../landing/MagneticButton'; // Reuse the magnetic physics

export default function GradientButton({ 
  children, 
  className, 
  onClick, 
  disabled = false,
  magnetic = true,
  variant = 'primary', // 'primary' | 'secondary' | 'outline'
  as = 'button',
  ...props 
}) {
  const Component = motion[as] || motion.button;
  const baseClasses = "relative flex items-center justify-center gap-2 font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-accent-violet to-accent-teal text-white shadow-[0_0_20px_rgba(124,111,247,0.3)] hover:shadow-[0_0_30px_rgba(124,111,247,0.5)] border border-white/10",
    secondary: "bg-white/[0.05] hover:bg-white/[0.1] text-white border border-white/[0.05] hover:border-white/[0.1]",
    outline: "bg-transparent text-slate-300 hover:text-white border border-white/10 hover:border-white/20 hover:bg-white/[0.02]"
  };

  const finalClassName = twMerge(baseClasses, variants[variant], "rounded-2xl px-6 py-3 text-sm", className);

  const ButtonContent = () => {
    // If it's a Link or something else, we might not want motion props directly unless it's motion(Link)
    // But framer-motion doesn't support 'whileTap' on standard Link directly unless wrapped.
    // For simplicity, we'll just render it as is.
    return (
      <Component 
        className={finalClassName}
        onClick={onClick}
        disabled={disabled}
        whileTap={{ scale: 0.98 }}
        {...props}
      >
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
        {children}
      </Component>
    );
  };

  if (magnetic && !disabled) {
    return (
      <MagneticButton as="div" className="w-full sm:w-auto flex">
        <ButtonContent />
      </MagneticButton>
    );
  }

  return <ButtonContent />;
}
