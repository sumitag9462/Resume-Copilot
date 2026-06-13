import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';

const StatCard = ({ 
  icon: Icon,
  label,
  value,
  trend,          // e.g. '+6%'
  trendDirection, // 'up' | 'down' | 'neutral'
  iconColor = 'violet',
  suffix = '',
}) => {
  const [displayed, setDisplayed] = useState(0);
  const valueRef = useRef(null);

  useEffect(() => {
    // GSAP counter animation on mount
    const numericValue = parseInt(value) || 0;
    const obj = { val: 0 };
    gsap.to(obj, {
      val: numericValue,
      duration: 1.5,
      ease: 'power2.out',
      onUpdate: () => {
        setDisplayed(Math.round(obj.val));
      }
    });
  }, [value]);

  const iconBg = {
    violet: 'bg-accent-violet/10 text-accent-violet',
    teal: 'bg-accent-teal/10 text-accent-teal',
    amber: 'bg-amber-500/10 text-amber-400',
    red: 'bg-red-500/10 text-red-400',
  };

  const trendColor = trendDirection === 'up' ? 
    'text-accent-teal' : 
    trendDirection === 'down' ? 'text-danger' : 
    'text-secondary';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.3 }}
      className="card p-5 cursor-default"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconBg[iconColor]}`}>
          <Icon size={18} strokeWidth={1.8} />
        </div>
        {trend && (
          <span className={`text-xs font-medium ${trendColor}`}>
            {trend}
          </span>
        )}
      </div>
      
      <div ref={valueRef} className="text-2xl font-bold text-primary font-heading mb-1">
        {displayed}{suffix}
      </div>
      <div className="text-xs text-secondary font-body">
        {label}
      </div>
    </motion.div>
  );
};

export default StatCard;
