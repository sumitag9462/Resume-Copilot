import React from 'react';
import { motion, useScroll } from 'framer-motion';

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  
  return (
    <motion.div
      style={{ scaleX: scrollYProgress }}
      className="fixed top-0 left-0 right-0 h-[2px] z-[9999] origin-left"
      animate={{}} // Keep motion div happy without css prop issues
      initial={{ scaleX: 0 }}
    >
      <div className="w-full h-full" style={{ background: 'linear-gradient(90deg, #7C6FF7, #2ECBAD)' }} />
    </motion.div>
  );
};

export default ScrollProgress;
