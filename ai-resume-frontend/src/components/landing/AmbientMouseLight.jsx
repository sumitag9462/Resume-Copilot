import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function AmbientMouseLight() {
  const [isVisible, setIsVisible] = useState(false);
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);

  // Smooth springs to make the light lag slightly behind the cursor for an elegant feel
  const springX = useSpring(mouseX, { damping: 40, stiffness: 200, mass: 0.5 });
  const springY = useSpring(mouseY, { damping: 40, stiffness: 200, mass: 0.5 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [mouseX, mouseY, isVisible]);

  return (
    <motion.div
      style={{
        x: springX,
        y: springY,
        opacity: isVisible ? 1 : 0,
      }}
      className="pointer-events-none fixed top-0 left-0 z-0 transition-opacity duration-700"
    >
      <div 
        className="w-[800px] h-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(124,111,247,0.06) 0%, rgba(46,203,173,0.03) 40%, transparent 70%)',
          filter: 'blur(60px)',
          mixBlendMode: 'screen'
        }}
      />
    </motion.div>
  );
}
