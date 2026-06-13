import React from 'react';
import { motion } from 'framer-motion';

const WorkspaceLayout = ({ 
  left, 
  right, 
  isEmpty = false 
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
    className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-5 min-h-full"
  >
    {/* LEFT COLUMN */}
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className="flex flex-col gap-5"
    >
      {left}
    </motion.div>

    {/* RIGHT COLUMN */}
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.05, ease: [0.23, 1, 0.32, 1] }}
      className="flex flex-col gap-5 lg:sticky lg:top-0 lg:h-[calc(100vh-4rem)] lg:overflow-y-auto lg:pl-5 lg:border-l lg:border-white/[0.05]"
    >
      {right}
    </motion.div>
  </motion.div>
);

export default WorkspaceLayout;
