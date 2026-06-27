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
    primary: "btn-primary",
    secondary: "btn-secondary",
    outline: "btn-ghost border border-white/10"
  };

  const finalClassName = twMerge(baseClasses, variants[variant], className);

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
