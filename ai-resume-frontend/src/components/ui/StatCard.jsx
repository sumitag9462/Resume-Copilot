import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import GlassCard from './GlassCard';

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
    <GlassCard 
      animated 
      hoverEffect
      className="p-5 cursor-default group"
    >
      <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/5 rounded-full blur-2xl transition-transform duration-500 group-hover:scale-150" />
      <div className="relative z-10 flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconBg[iconColor]}`}>
          <Icon size={18} strokeWidth={1.8} />
        </div>
        {trend && (
          <span className={`text-xs font-medium ${trendColor}`}>
            {trend}
          </span>
        )}
      </div>
      
      <div className="relative z-10">
        <div ref={valueRef} className="text-3xl font-bold text-white font-display mb-1 drop-shadow-md">
          {displayed}{suffix}
        </div>
        <div className="text-xs text-slate-400 uppercase tracking-wider font-bold">
          {label}
        </div>
      </div>
    </GlassCard>
  );
};

export default StatCard;
