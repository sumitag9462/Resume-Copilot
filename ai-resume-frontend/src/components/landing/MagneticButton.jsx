import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

export default function MagneticButton({ children, className = '', onClick, as = 'button', href, to }) {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.3, y: middleY * 0.3 });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  const { x, y } = position;

  const props = {
    ref,
    onMouseMove: handleMouse,
    onMouseLeave: reset,
    animate: { x, y },
    transition: { type: 'spring', stiffness: 150, damping: 15, mass: 0.1 },
    className: `relative inline-block ${className}`,
    onClick,
  };

  if (as === 'a') {
    return <motion.a href={href} {...props}>{children}</motion.a>;
  }

  if (as === 'div') {
    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouse}
            onMouseLeave={reset}
            animate={{ x: position.x, y: position.y }}
            transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}
            className={`relative inline-block ${className}`}
        >
            {children}
        </motion.div>
    );
  }

  return (
    <motion.button {...props}>
      {children}
    </motion.button>
  );
}
